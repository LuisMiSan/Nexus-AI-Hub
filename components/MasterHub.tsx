import React, { useState, useRef, useEffect } from 'react';
import { AppMode, ChatMessage, Language, LogEntry } from '../types';
import { routeUserIntent } from '../services/geminiService';

interface MasterHubProps {
  onRoute: (mode: AppMode, initialPrompt: string) => void;
  language: Language;
  onLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const MasterHub: React.FC<MasterHubProps> = ({ onRoute, language, onLog }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const texts = {
    es: {
      welcome: 'Bienvenido a Nexus. Soy el Agente Maestro. Describe tu tarea y activaré el módulo neuronal correcto (Imagen, Chat o Correo).',
      analyzing: 'Analizando intención...',
      routing: (target: string, reason: string) => `Enrutando a ${target}... \nRazonamiento: ${reason}`,
      failed: 'Error al enrutar la solicitud. Por favor intenta de nuevo.',
      user: 'Tú',
      agent: 'Agente Maestro',
      placeholder: 'Describe tu tarea (ej. "Genera una ciudad neón" o "Ayúdame con este código")...',
      send: 'Enviar',
      processing: 'Procesando...'
    },
    en: {
      welcome: 'Welcome to Nexus. I am the Master Agent. Describe your task, and I will activate the correct neural module (Image, Chat, or Email).',
      analyzing: 'Analyzing intent...',
      routing: (target: string, reason: string) => `Routing to ${target}... \nReasoning: ${reason}`,
      failed: 'Failed to route request. Please try again.',
      user: 'You',
      agent: 'Master Agent',
      placeholder: 'Describe your task (e.g., "Generate a neon city" or "Help me debug this code")...',
      send: 'Send',
      processing: 'Routing...'
    }
  };

  const t = texts[language];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'system',
      text: t.welcome,
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update welcome message when language changes if it's the only message
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome') {
      setMessages([{
        id: 'welcome',
        role: 'system',
        text: t.welcome,
        timestamp: new Date()
      }]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    // Simulate "Thinking"
    const thinkingMsgId = 'thinking-' + Date.now();
    setMessages(prev => [...prev, {
      id: thinkingMsgId,
      role: 'model',
      text: t.analyzing,
      timestamp: new Date(),
      isRouting: true
    }]);

    try {
      const routingResult = await routeUserIntent(userMsg.text);
      
      // Update the thinking message with the decision
      setMessages(prev => prev.map(msg => 
        msg.id === thinkingMsgId 
          ? { 
              ...msg, 
              text: t.routing(routingResult.targetApp, routingResult.reasoning),
              isRouting: false 
            }
          : msg
      ));

      // Log success
      onLog({
        action: 'Route Intent',
        target: routingResult.targetApp,
        details: `Prompt: "${userMsg.text}" -> Reason: ${routingResult.reasoning}`,
        status: 'success'
      });

      // Small delay for effect before switching
      setTimeout(() => {
        onRoute(routingResult.targetApp, routingResult.refinedPrompt);
      }, 1500);

    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === thinkingMsgId 
          ? { ...msg, text: t.failed, isRouting: false }
          : msg
      ));

       // Log failure
       onLog({
        action: 'Route Intent',
        target: AppMode.HUB,
        details: `Failed to route: "${userMsg.text}"`,
        status: 'failed'
      });

    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[80%] rounded-2xl p-4 shadow-lg backdrop-blur-sm
              ${msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
              }
              ${msg.isRouting ? 'animate-pulse' : ''}
            `}>
              <div className="text-sm font-semibold mb-1 opacity-75">
                {msg.role === 'user' ? t.user : t.agent}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800/50 p-2 rounded-2xl border border-slate-700 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 px-4 py-3"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-600/30"
          >
            {isProcessing ? t.processing : t.send}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MasterHub;