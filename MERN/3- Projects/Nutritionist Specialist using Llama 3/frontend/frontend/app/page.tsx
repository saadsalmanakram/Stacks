"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ChatMessage from './components/ChatMessage';
import Header from './components/Header';
import Footer from './components/Footer';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I assist you today?", isBot: true },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        isBot: false,
      };
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
      
      // Simulate bot response after 1 second
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "Thank you for your message! I'll get back to you shortly.",
          isBot: true,
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 md:p-8 relative">
        <div className="max-w-4xl mx-auto bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl p-6 h-[80vh] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                text={message.text}
                isBot={message.isBot}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-opacity-10 backdrop-blur-lg px-6 py-4 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 rounded-xl text-white font-semibold hover:scale-105 transition-transform duration-200"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}