import React, { useState, useEffect, useRef } from 'react';
import { Ride } from '../types';

interface ChatScreenProps {
  ride: Ride;
  onBack: () => void;
  onCall: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ ride, onBack, onCall }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hi! I'm waiting at the main entrance.", sender: 'them', time: 'Now' }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Okay, see you soon!",
        sender: 'them',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f6f7f8] dark:bg-[#101922]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-[#1F2937] border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        
        <div className="flex-1 flex items-center gap-3">
          <div className="relative">
            <img 
              src={ride.passengerImage} 
              alt={ride.passengerName} 
              className="size-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
            />
            <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-white dark:border-[#1F2937] rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{ride.passengerName}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Passenger</p>
          </div>
        </div>

        <button 
          onClick={onCall}
          className="size-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 shadow-md transition-colors"
        >
          <span className="material-symbols-outlined">call</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-xs text-gray-400 my-4">Today</div>
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex w-full ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm relative ${
                msg.sender === 'me' 
                  ? 'bg-[#137fec] text-white rounded-br-sm' 
                  : 'bg-white dark:bg-[#1F2937] text-slate-800 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-gray-700'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <span className={`text-[10px] block text-right mt-1 ${
                msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-[#1F2937] border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#101922] rounded-full px-4 py-2 border border-transparent focus-within:border-[#137fec] transition-colors">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder-gray-500 h-10"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="size-10 flex items-center justify-center rounded-full bg-[#137fec] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;