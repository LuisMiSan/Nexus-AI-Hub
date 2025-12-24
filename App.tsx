
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MasterHub from './components/MasterHub';
import ImageTool from './components/ImageTool';
import ChatTool from './components/ChatTool';
import EmailTool from './components/EmailTool';
import AdminPanel from './components/AdminPanel';
import WorkflowBuilder from './components/WorkflowBuilder';
import { AppMode, Language, LogEntry } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HUB);
  const [routedPrompt, setRoutedPrompt] = useState<string>('');
  const [language, setLanguage] = useState<Language>('es'); 
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      id: Date.now().toString() + Math.random().toString().slice(2),
      timestamp: new Date(),
      ...entry
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleRoute = (targetMode: AppMode, refinedPrompt: string) => {
    setRoutedPrompt(refinedPrompt);
    setMode(targetMode);
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.HUB:
        return <MasterHub onRoute={handleRoute} language={language} onLog={addLog} />;
      case AppMode.WORKFLOWS:
        return <WorkflowBuilder language={language} onLog={addLog} />;
      case AppMode.IMAGE:
        return <ImageTool initialPrompt={routedPrompt} key={routedPrompt} language={language} />;
      case AppMode.CHAT:
        return <ChatTool initialPrompt={routedPrompt} key={routedPrompt} language={language} />;
      case AppMode.EMAIL:
        return <EmailTool language={language} />;
      case AppMode.ADMIN:
        return <AdminPanel logs={logs} language={language} />;
      default:
        return <MasterHub onRoute={handleRoute} language={language} onLog={addLog} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <Sidebar 
        currentMode={mode} 
        setMode={setMode} 
        language={language} 
        toggleLanguage={toggleLanguage} 
      />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top bar mobile only */}
        <div className="md:hidden p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
            <span className="font-bold text-indigo-400">Nexus AI</span>
            <button onClick={toggleLanguage} className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">
               {language === 'es' ? '🇪🇸' : '🇺🇸'}
            </button>
        </div>

        <div className="flex-1 relative overflow-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
