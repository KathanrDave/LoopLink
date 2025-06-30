import { supabase } from '../lib/supabase';
import { websocketService } from './websocket';

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: number;
  edited?: boolean;
  replyTo?: string;
  reactions?: { [emoji: string]: string[] }; // emoji -> user IDs
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'loop' | 'direct' | 'group';
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: number;
}

export interface TypingData {
  roomId: string;
  userId: string;
  isTyping: boolean;
}

export class ChatService {
  private listeners: Map<string, Function[]> = new Map();
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map();

  async joinRoom(roomId: string, userId: string): Promise<void> {
    try {
      // Join room via WebSocket for real-time updates
      websocketService.joinRoom(roomId, userId);
      
      // Set up WebSocket listeners for chat
      websocketService.on('chat_message', (message: ChatMessage) => {
        this.emit('message', message);
      });
      
      websocketService.on('user_typing', (data: TypingData) => {
        this.emit('typing', data);
      });
      
    } catch (error) {
      console.error('Failed to join chat room:', error);
      throw error;
    }
  }

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    try {
      websocketService.leaveRoom(roomId, userId);
    } catch (error) {
      console.error('Failed to leave chat room:', error);
    }
  }

  async sendMessage(roomId: string, userId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Promise<ChatMessage> {
    try {
      const message: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        roomId,
        userId,
        content,
        type,
        timestamp: Date.now()
      };

      // Store message in database
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          id: message.id,
          room_id: roomId,
          user_id: userId,
          content,
          type,
          timestamp: new Date(message.timestamp).toISOString()
        });

      if (error) {
        console.error('Database insert failed, using WebSocket only:', error);
      }

      // Send via WebSocket for real-time delivery
      websocketService.sendUpdate({
        type: 'message_sent',
        data: message,
        loopId: roomId,
        userId
      });

      return message;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async getMessageHistory(roomId: string, limit: number = 50): Promise<ChatMessage[]> {
    try {
      // Try to get from database first
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('Failed to load message history from database:', error);
        return this.getMockMessages(roomId);
      }

      if (!data || data.length === 0) {
        return this.getMockMessages(roomId);
      }

      return data.map(msg => ({
        id: msg.id,
        roomId: msg.room_id,
        userId: msg.user_id,
        content: msg.content,
        type: msg.type,
        timestamp: new Date(msg.timestamp).getTime(),
        edited: msg.edited,
        replyTo: msg.reply_to,
        reactions: msg.reactions
      })).reverse();

    } catch (error) {
      console.error('Failed to get message history:', error);
      return this.getMockMessages(roomId);
    }
  }

  private getMockMessages(roomId: string): ChatMessage[] {
    // Return some mock messages for demo purposes
    const now = Date.now();
    return [
      {
        id: 'mock_1',
        roomId,
        userId: 'system',
        content: 'Welcome to the chat! Start sharing and connecting with your loop members.',
        type: 'system',
        timestamp: now - 3600000 // 1 hour ago
      },
      {
        id: 'mock_2',
        roomId,
        userId: 'demo_user_1',
        content: 'Hey everyone! Excited to be part of this loop 🎉',
        type: 'text',
        timestamp: now - 1800000 // 30 minutes ago
      }
    ];
  }

  sendTyping(roomId: string, userId: string, isTyping: boolean): void {
    const data: TypingData = { roomId, userId, isTyping };
    
    // Clear existing timeout for this user
    const timeoutKey = `${roomId}_${userId}`;
    if (this.typingTimeouts.has(timeoutKey)) {
      clearTimeout(this.typingTimeouts.get(timeoutKey)!);
    }

    // Send typing indicator
    websocketService.sendUpdate({
      type: 'user_typing',
      data,
      loopId: roomId,
      userId
    });

    // Auto-stop typing after 3 seconds
    if (isTyping) {
      const timeout = setTimeout(() => {
        this.sendTyping(roomId, userId, false);
      }, 3000);
      this.typingTimeouts.set(timeoutKey, timeout);
    }
  }

  async editMessage(messageId: string, newContent: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ 
          content: newContent, 
          edited: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) throw error;

      // Notify via WebSocket
      websocketService.sendUpdate({
        type: 'message_edited',
        data: { messageId, newContent },
        loopId: '', // Will be filled by the message context
        userId: '' // Will be filled by the current user
      });

    } catch (error) {
      console.error('Failed to edit message:', error);
      throw error;
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      // Notify via WebSocket
      websocketService.sendUpdate({
        type: 'message_deleted',
        data: { messageId },
        loopId: '', // Will be filled by the message context
        userId: '' // Will be filled by the current user
      });

    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  }

  async addReaction(messageId: string, emoji: string, userId: string): Promise<void> {
    try {
      // Get current message
      const { data: message, error: fetchError } = await supabase
        .from('chat_messages')
        .select('reactions')
        .eq('id', messageId)
        .single();

      if (fetchError) throw fetchError;

      const reactions = message.reactions || {};
      if (!reactions[emoji]) {
        reactions[emoji] = [];
      }

      // Toggle reaction
      if (reactions[emoji].includes(userId)) {
        reactions[emoji] = reactions[emoji].filter((id: string) => id !== userId);
        if (reactions[emoji].length === 0) {
          delete reactions[emoji];
        }
      } else {
        reactions[emoji].push(userId);
      }

      // Update in database
      const { error } = await supabase
        .from('chat_messages')
        .update({ reactions })
        .eq('id', messageId);

      if (error) throw error;

      // Notify via WebSocket
      websocketService.sendUpdate({
        type: 'message_reaction',
        data: { messageId, emoji, userId, reactions },
        loopId: '', // Will be filled by the message context
        userId
      });

    } catch (error) {
      console.error('Failed to add reaction:', error);
      throw error;
    }
  }

  onMessage(callback: (message: ChatMessage) => void): void {
    this.on('message', callback);
  }

  onTyping(callback: (data: TypingData) => void): void {
    this.on('typing', callback);
  }

  private on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  private emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in chat event listener:', error);
        }
      });
    }
  }

  disconnect(): void {
    // Clear all timeouts
    this.typingTimeouts.forEach(timeout => clearTimeout(timeout));
    this.typingTimeouts.clear();
    
    // Clear listeners
    this.listeners.clear();
  }
}

export const chatService = new ChatService();