
import React from 'react';
import { AppMode, Language } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  language: Language;
  toggleLanguage: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, language, toggleLanguage }) => {
  
  const texts = {
    es: {
      hub: 'Centro de Control',
      chat: 'Chat Global',
      image: 'Estudio Visual',
      email: 'Agente Correo',
      admin: 'Panel Admin',
      workflows: 'Flujos (n8n)',
      footer: 'Nexus OS v4.0'
    },
    en: {
      hub: 'Master Hub',
      chat: 'Omni Chat',
      image: 'Visual Studio',
      email: 'Email Agent',
      admin: 'Admin Panel',
      workflows: 'Workflows (n8n)',
      footer: 'Nexus OS v4.0'
    }
  };

  const t = texts[language];

  const navItems = [
    { mode: AppMode.HUB, label: t.hub, icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )},
    { mode: AppMode.WORKFLOWS, label: t.workflows, icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
    )},
    { mode: AppMode.CHAT, label: t.chat, icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
    )},
    { mode: AppMode.IMAGE, label: t.image, icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    )},
    { mode: AppMode.ADMIN, label: t.admin, icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full transition-all duration-300">
      <div className="p-6 flex items-center justify-center md:justify-start space-x-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/50">
          N
        </div>
        <span className="hidden md:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          Nexus
        </span>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setMode(item.mode)}
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group
              ${currentMode === item.mode 
                ? 'bg-slate-800 text-cyan-400 shadow-inner' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <div className={`transition-transform duration-300 ${currentMode === item.mode ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </div>
            <span className="hidden md:block ml-3 font-medium text-left text-sm">{item.label}</span>
            {currentMode === item.mode && (
              <div className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 flex flex-col gap-3">
         <button 
           onClick={toggleLanguage}
           className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-sm font-medium border border-slate-700"
         >
           {language === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}
         </button>
         
         <div className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">
           {t.footer}
         </div>
      </div>
    </div>
  );
};

export default Sidebar;
