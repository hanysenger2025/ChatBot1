
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, MessageRole } from '../types';
import { SCHOOL_DATA_CONTEXT, SYSTEM_INSTRUCTION } from '../constants';

interface TextChatProps {
  apiKey: string;
}

export const TextChat: React.FC<TextChatProps> = ({ apiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getChatSession = () => {
    const ai = new GoogleGenAI({ apiKey });
    return ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + "\n\n" + SCHOOL_DATA_CONTEXT,
      },
    });
  };

  const [chatSession] = useState(() => getChatSession());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: userMsg.text });
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: response.text || "عذرًا، لم أتمكن من استخراج إجابة.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: "حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[700px] bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-blue-50 overflow-hidden">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth bg-gradient-to-b from-white to-[#fcfdfe]" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in duration-1000">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 relative">
               <div className="absolute inset-0 bg-blue-400/10 rounded-full animate-ping"></div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#004b8d" className="w-10 h-10 relative z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <div className="max-w-xs">
              <p className="text-2xl font-bold text-gray-800 mb-2">أهلاً بك في المحادثة</p>
              <p className="text-gray-400 text-sm leading-relaxed">اكتب استفسارك وسأجيبك فوراً بكل ما يخص مدارس التكنولوجيا التطبيقية.</p>
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === MessageRole.USER ? 'items-start' : 'items-end'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`max-w-[80%] px-5 py-4 rounded-3xl shadow-sm relative group transition-all duration-300 hover:shadow-md ${
                msg.role === MessageRole.USER
                  ? 'bg-[#004b8d] text-white rounded-tr-none'
                  : 'bg-white text-[#1e293b] border border-blue-50 rounded-tl-none'
              }`}
            >
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap mb-1 font-medium">
                {msg.text}
              </div>
              <div 
                className={`text-[9px] font-bold flex justify-end mt-2 tracking-wider ${
                  msg.role === MessageRole.USER ? 'text-blue-200' : 'text-gray-400'
                }`}
              >
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex flex-col items-end animate-in fade-in duration-300">
            <div className="bg-white border border-blue-50 p-5 rounded-3xl rounded-tl-none shadow-sm">
              <div className="flex space-x-2 space-x-reverse">
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-[#004b8d] rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-50">
        <div className="flex items-center gap-4 bg-gray-50/50 p-2 rounded-[2rem] border border-gray-100 focus-within:border-blue-200 focus-within:ring-4 focus-within:ring-blue-50/50 transition-all duration-500">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اسأل عن أي مدرسة أو تخصص..."
            className="flex-1 bg-transparent px-6 py-3 text-[#1e293b] focus:outline-none text-[16px] font-medium placeholder:text-gray-400"
            dir="rtl"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-[#004b8d] hover:bg-[#003d74] disabled:bg-gray-200 text-white w-14 h-14 rounded-full shadow-lg shadow-blue-900/20 flex items-center justify-center transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 rotate-180">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
