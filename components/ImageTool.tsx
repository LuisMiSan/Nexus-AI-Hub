import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageResolution, Language } from '../types';

interface ImageToolProps {
  initialPrompt?: string;
  language: Language;
}

const ImageTool: React.FC<ImageToolProps> = ({ initialPrompt = '', language }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [resolution, setResolution] = useState<ImageResolution>(ImageResolution.RES_1K);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const texts = {
    es: {
      title: 'Estudio Visual',
      subtitle: 'Potenciado por Gemini 3 Pro Image Preview',
      labelPrompt: 'Prompt de Imagen',
      labelResolution: 'Resolución',
      placeholder: 'Describe la imagen que quieres crear en detalle...',
      generate: 'Generar',
      generating: 'Soñando...',
      download: 'Descargar',
      emptyState: 'Tu creación aparecerá aquí',
      error: 'Error inesperado.'
    },
    en: {
      title: 'Visual Studio',
      subtitle: 'Powered by Gemini 3 Pro Image Preview',
      labelPrompt: 'Image Prompt',
      labelResolution: 'Resolution',
      placeholder: 'Describe the image you want to create in detail...',
      generate: 'Generate',
      generating: 'Dreaming...',
      download: 'Download',
      emptyState: 'Your creation will appear here',
      error: 'An unexpected error occurred.'
    }
  };

  const t = texts[language];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await generateImage(prompt, resolution);
      if (result.error) {
        setError(result.error);
      } else {
        setResultImage(result.imageUrl);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full h-full flex flex-col p-4 md:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{t.title}</h2>
          <p className="text-slate-400 text-sm">{t.subtitle}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t.labelPrompt}</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none h-24 resize-none"
              placeholder={t.placeholder}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-end">
             <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-slate-300 mb-2">{t.labelResolution}</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as ImageResolution)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none appearance-none"
              >
                <option value={ImageResolution.RES_1K}>1K (Standard)</option>
                <option value={ImageResolution.RES_2K}>2K (High Def)</option>
                <option value={ImageResolution.RES_4K}>4K (Ultra HD)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !prompt}
              className="w-full md:flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-pink-600/20 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.generating}
                </>
              ) : t.generate}
            </button>
          </div>
        </form>
      </div>

      {/* Output Area */}
      <div className="flex-1 flex flex-col min-h-[400px]">
        {error && (
           <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-4">
             Error: {error}
           </div>
        )}

        {resultImage ? (
          <div className="relative group rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-700 bg-black flex-1 flex items-center justify-center">
            <img 
              src={resultImage} 
              alt="Generated Result" 
              className="max-w-full max-h-[600px] object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <a 
                href={resultImage} 
                download={`nexus-gen-${Date.now()}.png`}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {t.download}
              </a>
            </div>
          </div>
        ) : (
          <div className="flex-1 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 bg-slate-900/50">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p>{t.emptyState}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageTool;