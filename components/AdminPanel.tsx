
import React, { useState } from 'react';
import { LogEntry, GithubRepo, Language } from '../types';

interface AdminPanelProps {
  logs: LogEntry[];
  language: Language;
  repos: GithubRepo[];
  onAddRepo: (repo: GithubRepo) => void;
  onToggleRepo: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ logs, language, repos, onAddRepo, onToggleRepo }) => {
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const texts = {
    es: {
      title: 'Panel de Administración',
      subtitle: 'Gestión de procesos y recursos del sistema',
      logsTitle: 'Historial de Ejecuciones',
      repoTitle: 'Repositorios Enlazados',
      addRepo: 'Añadir Repositorio',
      placeholderRepo: 'https://github.com/usuario/repo',
      tableTime: 'Hora',
      tableAction: 'Acción',
      tableTarget: 'Objetivo',
      tableStatus: 'Estado',
      connected: 'Conectado',
      connect: 'Conectar',
      disconnect: 'Desconectar',
      duplicate: 'Este repositorio ya existe',
      invalid: 'URL inválida'
    },
    en: {
      title: 'Admin Panel',
      subtitle: 'System process and resource management',
      logsTitle: 'Execution History',
      repoTitle: 'Linked Repositories',
      addRepo: 'Add Repository',
      placeholderRepo: 'https://github.com/user/repo',
      tableTime: 'Time',
      tableAction: 'Action',
      tableTarget: 'Target',
      tableStatus: 'Status',
      connected: 'Connected',
      connect: 'Connect',
      disconnect: 'Disconnect',
      duplicate: 'Repository already exists',
      invalid: 'Invalid URL'
    }
  };

  const t = texts[language];

  const handleAddRepoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUrl = newRepoUrl.trim().replace(/\/$/, ''); // Remove trailing slash
    
    if (!cleanUrl) return;
    
    // Simple validation
    if (!cleanUrl.includes('github.com')) {
        setError(t.invalid);
        return;
    }

    // Check for duplicates
    if (repos.some(r => r.url.toLowerCase() === cleanUrl.toLowerCase())) {
        setError(t.duplicate);
        return;
    }

    const name = cleanUrl.split('/').pop() || 'Unknown Repo';
    
    onAddRepo({
      id: Date.now().toString() + Math.random().toString().slice(2, 5), // Ensure unique ID
      name: name,
      url: cleanUrl,
      connected: true
    });
    
    setNewRepoUrl('');
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full p-4 md:p-8 space-y-8 overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 shadow-lg shadow-emerald-900/20">
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">{t.title}</h2>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Logs Section */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl flex flex-col max-h-[600px]">
          <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-lg text-slate-200">{t.logsTitle}</h3>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">{logs.length} events</span>
          </div>
          <div className="overflow-y-auto custom-scrollbar flex-1">
            <table className="w-full text-sm text-left text-slate-400">
              <thead className="text-xs uppercase bg-slate-900/50 text-slate-400 sticky top-0 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3">{t.tableTime}</th>
                  <th className="px-6 py-3">{t.tableAction}</th>
                  <th className="px-6 py-3">{t.tableTarget}</th>
                  <th className="px-6 py-3">{t.tableStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {[...logs].reverse().map((log) => (
                  <tr key={log.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{log.timestamp.toLocaleTimeString()}</td>
                    <td className="px-6 py-4">{log.action}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-700 text-white px-2 py-0.5 rounded text-xs border border-slate-600">
                        {log.target}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {log.status === 'success' ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Success
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                      No hay registros de actividad aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GitHub Repos Section */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl flex flex-col h-[500px]">
          <h3 className="font-semibold text-lg text-slate-200 mb-4 flex items-center gap-2 flex-shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path></svg>
            {t.repoTitle}
          </h3>
          
          <div className="space-y-3 mb-6 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {repos.map(repo => (
              <div key={repo.id} className="bg-slate-900 rounded-lg p-3 flex items-center justify-between border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="overflow-hidden min-w-0">
                  <div className="font-medium text-slate-200 truncate">{repo.name}</div>
                  <div className="text-xs text-slate-500 truncate">{repo.url}</div>
                </div>
                <button 
                  onClick={() => onToggleRepo(repo.id)}
                  className={`ml-2 px-3 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 ${repo.connected ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                >
                  {repo.connected ? t.connected : t.connect}
                </button>
              </div>
            ))}
            {repos.length === 0 && (
                <div className="text-center text-slate-600 text-sm py-8">No repositories linked.</div>
            )}
          </div>

          <form onSubmit={handleAddRepoSubmit} className="mt-auto pt-4 border-t border-slate-700">
            <label className="block text-xs font-medium text-slate-400 mb-2">{t.addRepo}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRepoUrl}
                onChange={(e) => {
                    setNewRepoUrl(e.target.value);
                    if (error) setError(null);
                }}
                className={`flex-1 bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors`}
                placeholder={t.placeholderRepo}
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-2 flex items-center justify-center transition-colors shadow-lg shadow-indigo-600/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
            {error && <p className="text-red-400 text-[10px] mt-1 ml-1">{error}</p>}
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
