
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MasterHub from './components/MasterHub';
import ImageTool from './components/ImageTool';
import ChatTool from './components/ChatTool';
import EmailTool from './components/EmailTool';
import AdminPanel from './components/AdminPanel';
import WorkflowBuilder from './components/WorkflowBuilder';
import { AppMode, Language, LogEntry, GithubRepo } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HUB);
  const [routedPrompt, setRoutedPrompt] = useState<string>('');
  const [language, setLanguage] = useState<Language>('es'); 
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // State initialized from localStorage with fallback to default data
  const [repos, setRepos] = useState<GithubRepo[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_repos');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse repos from local storage");
        }
      }
    }
    // Default initial data if nothing is saved
    return [
      { id: '1', name: 'Nexus Core', url: 'https://github.com/nexus/core', connected: true },
      { id: '2', name: 'Gemini Utils', url: 'https://github.com/nexus/gemini-utils', connected: true },
    ];
  });

  // Effect to save repos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nexus_repos', JSON.stringify(repos));
  }, [repos]);

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

  // Repo Handlers
  const handleAddRepo = (repo: GithubRepo) => {
    setRepos(prev => [...prev, repo]);
    addLog({
      action: 'Add Repo',
      target: AppMode.ADMIN,
      details: `Linked repository: ${repo.name}`,
      status: 'success'
    });
  };

  const handleToggleRepo = (id: string) => {
    setRepos(prev => prev.map(r => r.id === id ? { ...r, connected: !r.connected } : r));
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.HUB:
        return <MasterHub onRoute={handleRoute} language={language} onLog={addLog} />;
      case AppMode.WORKFLOWS:
        return <WorkflowBuilder language={language} onLog={addLog} repos={repos} />;
      case AppMode.IMAGE:
        return <ImageTool initialPrompt={routedPrompt} key={routedPrompt} language={language} />;
      case AppMode.CHAT:
        return <ChatTool initialPrompt={routedPrompt} key={routedPrompt} language={language} />;
      case AppMode.EMAIL:
        return <EmailTool language={language} />;
      case AppMode.ADMIN:
        return (
          <AdminPanel 
            logs={logs} 
            language={language} 
            repos={repos} 
            onAddRepo={handleAddRepo} 
            onToggleRepo={handleToggleRepo} 
          />
        );
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
