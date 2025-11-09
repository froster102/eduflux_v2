import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { addToast } from '@heroui/toast';

import { CHAT_WEBSOCKET_URL } from '@/lib/constants';
import { WebSocketEvents } from '@/shared/enums/WebSocketEvents';

interface ChatContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinChat: (chatId: string) => void;
  sendMessage: (chatId: string, content: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState<boolean>(false);

  useEffect(() => {
    const socketInstance = io(`${CHAT_WEBSOCKET_URL}`, {
      path: '/ws/chats/',
      withCredentials: true,
    });

    setSocket(socketInstance);
    setIsConnected(true);
    setupSocketListeners(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, []);

  const setupSocketListeners = (socketInstance: Socket) => {
    socketInstance.on(WebSocketEvents.ERROR, (data: { message: string }) => {
      addToast({
        description: data.message || 'An unexpected error has occurred',
        color: 'danger',
      });
    });
  };

  const joinChat = (chatId: string) => {
    if (socket) {
      socket.emit(WebSocketEvents.CHAT_JOIN, { chatId });
    }
  };

  const sendMessage = (chatId: string, content: string) => {
    if (socket) {
      socket.emit(WebSocketEvents.MESSAGE_SEND, { chatId, content });
    }
  };

  return (
    <ChatContext.Provider
      value={{ socket, joinChat, sendMessage, isConnected }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error('useChatContext must be used with ChatProvider');
  }

  return context;
};
