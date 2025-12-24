import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language } from '../types';
import { sendChatMessage } from '../services/geminiService';

interface ChatToolProps {
  initialPrompt?: string;
  language: Language;
}

const ChatTool: React.FC<ChatToolProps> = ({ initialPrompt = '', language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const hasHandledInitial = useRef(false);

  const texts = {
    es: {
      title: 'Chat Global',
      subtitle: 'Potenciado por Gemini 3 Pro Preview',
      placeholder: 'Pregunta lo que sea...',
      empty: 'Inicia una conversación...'
    },
    en: {
      title: 'Omni Chat',
      subtitle: 'Powered by Gemini 3 Pro Preview',
      placeholder: 'Ask anything...',
      empty: 'Start a conversation...'
    }
  };

  const t = texts[language];

  useEffect(() => {
    if (initialPrompt && !hasHandledInitial.current) {
        hasHandledInitial.current = true;
        const autoSend = async () => {
             const userMsg: ChatMessage = {
                id: Date.now().toString(),
                role: 'user',
                text: initialPrompt,
                timestamp: new Date()
              };
              setMessages([userMsg]);
              setIsLoading(true);
              
              const historyForApi = [];
              const responseText = await sendChatMessage(initialPrompt, historyForApi);
              
              setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: responseText,
                timestamp: new Date()
              }]);
              setIsLoading(false);
        };
        autoSend();
    }
  }, [initialPrompt]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const historyForApi = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const responseText = await sendChatMessage(userText, historyForApi);

    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    }]);

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-4">
       {/* Header */}
       <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-800">
        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{t.title}</h2>
          <p className="text-slate-400 text-xs">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
        {messages.length === 0 && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <p>{t.empty}</p>
            </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] rounded-2xl p-4 shadow-sm
              ${msg.role === 'user' 
                ? 'bg-cyan-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 rounded-bl-none'
              }
            `}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
             <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl p-4 rounded-bl-none flex space-x-2">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 px-4 py-3"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-3 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatTool;