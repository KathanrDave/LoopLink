import { io, Socket } from 'socket.io-client';

export interface RealtimeUpdate {
  type: 'item_added' | 'item_updated' | 'event_created' | 'member_joined' | 'message_sent' | 'user_typing' | 'message_edited' | 'message_deleted' | 'message_reaction';
  data: any;
  loopId: string;
  userId: string;
  timestamp: number;
}

export class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private listeners: Map<string, Function[]> = new Map();
  private isConnected = false;
  private pollingInterval: NodeJS.Timeout | null = null;
  private currentRooms: Set<string> = new Set();

  connect(userId: string, loopId: string) {
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;
    
    if (!wsUrl) {
      console.log('WebSocket URL not configured, using polling mode');
      this.startPolling();
      return;
    }

    try {
      this.socket = io(wsUrl, {
        auth: { userId, loopId },
        transports: ['websocket', 'polling'],
        timeout: 5000,
        forceNew: true
      });

      this.setupEventListeners();
      this.joinRoom(loopId, userId);
      
    } catch (error) {
      console.warn('WebSocket connection failed, falling back to polling:', error);
      this.startPolling();
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.stopPolling();
      this.emit('connection_established', { connected: true });
      
      // Rejoin all rooms
      this.currentRooms.forEach(roomId => {
        this.socket?.emit('join_room', { roomId });
      });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      this.isConnected = false;
      this.handleReconnection();
    });

    this.socket.on('realtime_update', (update: RealtimeUpdate) => {
      this.handleRealtimeUpdate(update);
    });

    this.socket.on('chat_message', (message: any) => {
      this.emit('chat_message', message);
    });

    this.socket.on('user_typing', (data: any) => {
      this.emit('user_typing', data);
    });

    this.socket.on('loop_update', (data: any) => {
      this.emit('loop_update', data);
    });

    this.socket.on('notification', (notification: any) => {
      this.emit('notification', notification);
    });

    this.socket.on('connect_error', (error) => {
      console.warn('WebSocket connection error:', error.message || error);
      this.isConnected = false;
      this.handleReconnection();
    });
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(Math.pow(2, this.reconnectAttempts) * 1000, 10000);
      
      setTimeout(() => {
        if (!this.isConnected) {
          console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          this.socket?.connect();
        }
      }, delay);
    } else {
      console.log('Max reconnection attempts reached. Using polling mode.');
      this.startPolling();
    }
  }

  private startPolling() {
    if (this.pollingInterval) return;
    
    console.log('Starting polling mode for real-time updates');
    this.pollingInterval = setInterval(() => {
      this.emit('poll_update', { timestamp: Date.now() });
    }, 30000);
    
    this.emit('connection_established', { connected: false, polling: true });
  }

  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log('Stopped polling mode');
    }
  }

  joinRoom(roomId: string, userId?: string) {
    this.currentRooms.add(roomId);
    
    if (this.socket?.connected) {
      this.socket.emit('join_room', { roomId, userId });
    }
  }

  leaveRoom(roomId: string, userId?: string) {
    this.currentRooms.delete(roomId);
    
    if (this.socket?.connected) {
      this.socket.emit('leave_room', { roomId, userId });
    }
  }

  sendUpdate(update: Omit<RealtimeUpdate, 'timestamp'>) {
    const fullUpdate: RealtimeUpdate = {
      ...update,
      timestamp: Date.now()
    };

    if (this.socket?.connected) {
      this.socket.emit('send_update', fullUpdate);
    } else {
      console.log('WebSocket not connected, queuing update for next sync');
      this.emit('update_queued', fullUpdate);
    }
  }

  // Chat-specific methods
  sendChatMessage(roomId: string, message: any) {
    if (this.socket?.connected) {
      this.socket.emit('chat_message', { roomId, message });
    } else {
      this.emit('chat_message', message);
    }
  }

  sendTypingIndicator(roomId: string, userId: string, isTyping: boolean) {
    if (this.socket?.connected) {
      this.socket.emit('user_typing', { roomId, userId, isTyping });
    }
  }

  private handleRealtimeUpdate(update: RealtimeUpdate) {
    console.log('Received realtime update:', update);
    this.emit('realtime_update', update);
    
    // Show notification for certain update types
    if (update.type === 'item_added' || update.type === 'event_created') {
      this.showNotification(update);
    }
  }

  private showNotification(update: RealtimeUpdate) {
    if ('Notification' in window && Notification.permission === 'granted') {
      let title = '';
      let body = '';
      
      switch (update.type) {
        case 'item_added':
          title = 'New Item Shared';
          body = `${update.data.title} is now available in your loop`;
          break;
        case 'event_created':
          title = 'New Event Created';
          body = `${update.data.title} - ${update.data.date}`;
          break;
        case 'member_joined':
          title = 'New Member Joined';
          body = `${update.data.name} joined your loop`;
          break;
        case 'message_sent':
          title = 'New Message';
          body = update.data.content;
          break;
      }
      
      if (title && body) {
        try {
          new Notification(title, {
            body,
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png'
          });
        } catch (error) {
          console.warn('Failed to show notification:', error);
        }
      }
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.warn('Error in event listener:', error);
        }
      });
    }
  }

  disconnect() {
    this.isConnected = false;
    this.stopPolling();
    this.currentRooms.clear();
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  isWebSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  isUsingPolling(): boolean {
    return this.pollingInterval !== null;
  }
}

export const websocketService = new WebSocketService();