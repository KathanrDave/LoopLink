import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, Phone, Video, MoreVertical, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { chatService, ChatMessage, ChatRoom } from '../services/chat';
import GlassmorphicCard from './GlassmorphicCard';
import NeuomorphicButton from './NeuomorphicButton';

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  roomId?: string;
}

const Chat: React.FC<ChatProps> = ({ isOpen, onClose, roomId }) => {
  const { currentUser, currentLoop } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const chatRoomId = roomId || currentLoop?.id || '';

  useEffect(() => {
    if (isOpen && chatRoomId && currentUser) {
      initializeChat();
    }
    
    return () => {
      // Cleanup when component unmounts or modal closes
      if (chatRoomId) {
        chatService.leaveRoom(chatRoomId, currentUser?.id || '');
      }
    };
  }, [isOpen, chatRoomId, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      
      // Join chat room
      await chatService.joinRoom(chatRoomId, currentUser!.id);
      
      // Load message history
      const history = await chatService.getMessageHistory(chatRoomId);
      setMessages(history);
      
      // Set up real-time listeners
      chatService.onMessage((message) => {
        if (message.roomId === chatRoomId) {
          setMessages(prev => [...prev, message]);
        }
      });
      
      chatService.onTyping((data) => {
        if (data.roomId === chatRoomId && data.userId !== currentUser!.id) {
          setTypingUsers(prev => {
            if (data.isTyping && !prev.includes(data.userId)) {
              return [...prev, data.userId];
            } else if (!data.isTyping) {
              return prev.filter(id => id !== data.userId);
            }
            return prev;
          });
        }
      });
      
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    try {
      await chatService.sendMessage(chatRoomId, currentUser.id, newMessage.trim());
      setNewMessage('');
      setIsTyping(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      chatService.sendTyping(chatRoomId, currentUser!.id, true);
    } else if (!value.trim() && isTyping) {
      setIsTyping(false);
      chatService.sendTyping(chatRoomId, currentUser!.id, false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getUserName = (userId: string) => {
    if (userId === currentUser?.id) return 'You';
    const member = currentLoop?.members.find(m => m.id === userId);
    return member?.name || 'Unknown User';
  };

  const getUserAvatar = (userId: string) => {
    if (userId === currentUser?.id) return currentUser.avatar;
    const member = currentLoop?.members.find(m => m.id === userId);
    return member?.avatar || '👤';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-end md:items-center justify-center p-4">
      <GlassmorphicCard ref={modalRef} className="w-full max-w-md h-[80vh] md:h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">💬</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{currentLoop?.name} Chat</h3>
              <p className="text-xs text-gray-600">{currentLoop?.members.length} members</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">💬</div>
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.userId === currentUser?.id;
              const showAvatar = index === 0 || messages[index - 1].userId !== message.userId;
              
              return (
                <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end space-x-2 max-w-[80%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!isOwn && showAvatar && (
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-sm shadow-sm">
                        {getUserAvatar(message.userId)}
                      </div>
                    )}
                    {!isOwn && !showAvatar && <div className="w-8" />}
                    
                    <div className={`rounded-2xl px-4 py-2 ${
                      isOwn 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                        : 'bg-white/50 text-gray-900'
                    }`}>
                      {!isOwn && showAvatar && (
                        <p className="text-xs font-semibold mb-1 opacity-70">
                          {getUserName(message.userId)}
                        </p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {typingUsers.map(getUserName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <Paperclip className="w-4 h-4" />
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-2 bg-white/50 border border-white/20 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:text-indigo-600 transition-colors">
                <Smile className="w-4 h-4" />
              </button>
            </div>
            <NeuomorphicButton
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              variant="primary"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </NeuomorphicButton>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default Chat;