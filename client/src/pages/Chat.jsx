import React from 'react';
import ChatWindow from '../components/chat/ChatWindow';
import { motion } from 'framer-motion';

const Chat = () => {
  return (
    <div className="fixed inset-0 top-16 bg-background chat-gradient overflow-hidden">
      <ChatWindow />
    </div>
  );
};


export default Chat;
