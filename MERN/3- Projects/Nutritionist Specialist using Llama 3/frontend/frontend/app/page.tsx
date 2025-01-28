"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ChatMessage from './components/ChatMessage';
import Header from './components/Header';
import Footer from './components/Footer';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I assist you today?", isBot: true, type: "welcome" },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setIsTyping(true);
      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        isBot: false,
        type: "user"
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
      
      // Simulate bot response with typing animation
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "Thank you for your message! I'll get back to you shortly.",
          isBot: true,
          type: "response"
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleResetChat = () => {
    setMessages([{ id: 1, text: "Hello! How can I assist you today?", isBot: true, type: "welcome" }]);
    setInputMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex flex-col relative overflow-hidden">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative">
        <div className="max-w-10xl w-full bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6 h-[calc(92.5vh-8rem)] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                text={message.text}
                isBot={message.isBot}
                type={message.type}
              />
            ))}
            {isTyping && (
              <div className="flex ml-auto pr-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-black/20 backdrop-blur-lg px-6 py-4 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-white/10 transition-all duration-300"
                placeholder="Type your message..."
              />
              <button
                onClick={handleSendMessage}
                className="send-button"
              >
                Send
              </button>
              <button
                onClick={handleResetChat}
                className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-4 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                Reset
              </button>
            </div>
            <div className="text-right text-gray-400 text-sm mt-2">
              {inputMessage.length}/1000
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}