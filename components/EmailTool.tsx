import React from 'react';
import { Language } from '../types';

interface EmailToolProps {
  language: Language;
}

const EmailTool: React.FC<EmailToolProps> = ({ language }) => {
  
  const texts = {
    es: {
      title: 'Agente de Correo',
      subtitle: 'Este módulo demuestra que el Hub Maestro puede enrutarte aquí.',
      pending: 'Implementación de función pendiente'
    },
    en: {
      title: 'Email Agent',
      subtitle: 'This module demonstrates that the Master Hub can route you here.',
      pending: 'Feature Implementation Pending'
    }
  };

  const t = texts[language];

  return (
    <div className="flex items-center justify-center h-full text-slate-400">
      <div className="text-center p-8 border border-slate-800 rounded-2xl bg-slate-900/50">
        <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        <h2 className="text-xl font-bold text-white mb-2">{t.title}</h2>
        <p>{t.subtitle}</p>
        <p className="text-xs mt-4 opacity-50">{t.pending}</p>
      </div>
    </div>
  );
};

export default EmailTool;