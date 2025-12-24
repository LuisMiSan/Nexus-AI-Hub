
import React, { useState, useEffect } from 'react';
import { Language, NodeType, WorkflowNode, LogEntry, AppMode } from '../types';

interface WorkflowBuilderProps {
  language: Language;
  onLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ language, onLog }) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: '1', type: 'trigger', label: 'Inicio de Prompt', position: { x: 50, y: 50 }, config: { input: '' } }
  ]);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'loaded'>('idle');

  const texts = {
    es: {
      title: 'Constructor de Flujos',
      toolbox: 'Herramientas',
      run: 'Ejecutar Flujo',
      running: 'Procesando Nodos...',
      addNode: 'Añadir Nodo',
      config: 'Configuración de Nodo',
      placeholder: 'Configura este nodo...',
      save: 'Guardar Flujo',
      load: 'Cargar Flujo',
      saved: '¡Guardado!',
      loaded: '¡Cargado!',
      types: {
        trigger: 'Disparador (Manual)',
        gemini: 'Cerebro Gemini',
        gemini_logic: 'Lógica Gemini',
        image: 'Generador Imagen',
        github: 'Acción GitHub',
        email: 'Enviar Email',
        logic: 'Filtro Lógico'
      },
      labels: {
        model: 'Modelo Inteligente',
        systemInstruction: 'Instrucción de Sistema',
        prompt: 'Prompt de Usuario',
        repo: 'Repositorio GitHub'
      }
    },
    en: {
      title: 'Workflow Builder',
      toolbox: 'Toolbox',
      run: 'Run Workflow',
      running: 'Processing Nodes...',
      addNode: 'Add Node',
      config: 'Node Settings',
      placeholder: 'Configure this node...',
      save: 'Save Workflow',
      load: 'Load Workflow',
      saved: 'Saved!',
      loaded: 'Loaded!',
      types: {
        trigger: 'Trigger (Manual)',
        gemini: 'Gemini Brain',
        gemini_logic: 'Gemini Logic',
        image: 'Image Gen',
        github: 'GitHub Action',
        email: 'Send Email',
        logic: 'Logical Filter'
      },
      labels: {
        model: 'AI Model',
        systemInstruction: 'System Instruction',
        prompt: 'User Prompt',
        repo: 'GitHub Repository'
      }
    }
  };

  const t = texts[language];

  useEffect(() => {
    if (saveStatus !== 'idle') {
      const timer = setTimeout(() => setSaveStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const addNode = (type: NodeType) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type,
      label: t.types[type as keyof typeof t.types],
      position: { x: 50, y: nodes.length * 120 + 50 },
      config: type === 'gemini_logic' ? { model: 'gemini-3-flash-preview', systemInstruction: '', input: '' } : {}
    };
    setNodes([...nodes, newNode]);
    onLog({
      action: 'Add Node',
      target: AppMode.WORKFLOWS,
      details: `Added ${type} node to workflow.`,
      status: 'success'
    });
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    if (activeNode === id) setActiveNode(null);
  };

  const saveWorkflow = () => {
    try {
      const data = JSON.stringify(nodes);
      localStorage.setItem('nexus_workflow_default', data);
      setSaveStatus('saved');
      onLog({
        action: 'Save Workflow',
        target: AppMode.WORKFLOWS,
        details: 'Workflow saved to local storage.',
        status: 'success'
      });
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const loadWorkflow = () => {
    try {
      const data = localStorage.getItem('nexus_workflow_default');
      if (data) {
        const parsedNodes = JSON.parse(data);
        setNodes(parsedNodes);
        setSaveStatus('loaded');
        setActiveNode(null);
        onLog({
          action: 'Load Workflow',
          target: AppMode.WORKFLOWS,
          details: 'Workflow loaded from local storage.',
          status: 'success'
        });
      }
    } catch (error) {
      console.error("Load error:", error);
    }
  };

  const runWorkflow = async () => {
    setIsRunning(true);
    for (const node of nodes) {
        console.log(`Ejecutando nodo: ${node.type}`);
        await new Promise(r => setTimeout(r, 800));
    }
    setIsRunning(false);
    onLog({
      action: 'Execute Workflow',
      target: AppMode.WORKFLOWS,
      details: `Full workflow with ${nodes.length} nodes executed successfully.`,
      status: 'success'
    });
  };

  const updateNodeConfig = (id: string, config: any) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, config } : n));
  };

  const activeNodeData = nodes.find(n => n.id === activeNode);

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-950">
      
      {/* Toolbox */}
      <div className="w-64 border-r border-slate-800 p-6 flex flex-col gap-4 bg-slate-900/50 backdrop-blur-md">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.toolbox}</h3>
        {(['gemini', 'gemini_logic', 'image', 'github', 'email', 'logic'] as NodeType[]).map(type => (
          <button
            key={type}
            onClick={() => addNode(type)}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700 hover:scale-105 active:scale-95 group"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${type === 'gemini_logic' ? 'bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white' : 'bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white'}`}>
              {type === 'gemini' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              {type === 'gemini_logic' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
              {type === 'image' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              {type === 'github' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>}
              {type === 'email' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              {type === 'logic' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
            </div>
            <span className="text-sm font-medium">{t.types[type as keyof typeof t.types]}</span>
          </button>
        ))}

        <div className="mt-auto space-y-2 pt-6 border-t border-slate-800">
          <button
            onClick={saveWorkflow}
            className="w-full p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            {saveStatus === 'saved' ? t.saved : t.save}
          </button>
          
          <button
            onClick={loadWorkflow}
            className="w-full p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            {saveStatus === 'loaded' ? t.loaded : t.load}
          </button>

          <button
            onClick={runWorkflow}
            disabled={isRunning || nodes.length < 2}
            className={`w-full p-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg transition-all ${isRunning ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 active:scale-95'}`}
          >
            {isRunning ? (
              <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            )}
            {isRunning ? t.running : t.run}
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-slate-950 overflow-auto custom-scrollbar pattern-grid">
        <style>{`
          .pattern-grid {
            background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0);
            background-size: 30px 30px;
          }
        `}</style>
        
        <div className="absolute inset-0 p-12">
           <div className="flex flex-col items-center gap-12 relative">
              {nodes.map((node, index) => (
                <React.Fragment key={node.id}>
                  <div 
                    onClick={() => setActiveNode(node.id)}
                    className={`
                      relative w-64 p-4 rounded-2xl border-2 transition-all cursor-pointer group
                      ${activeNode === node.id ? 'border-indigo-500 bg-slate-800 shadow-xl scale-105' : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 shadow-md'}
                      ${isRunning && index <= nodes.length / 2 ? 'ring-2 ring-emerald-500 ring-offset-4 ring-offset-slate-950' : ''}
                      ${node.type === 'gemini_logic' ? 'shadow-cyan-500/10' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between mb-3">
                       <span className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded ${node.type === 'trigger' ? 'bg-amber-500/20 text-amber-500' : node.type === 'gemini_logic' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                         {node.type}
                       </span>
                       <button onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }} className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </div>
                    <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                       {node.type === 'gemini_logic' && <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                       {node.label}
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-1000 ${isRunning ? 'w-full bg-indigo-500' : 'w-0'}`}></div>
                    </div>

                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-2 border-slate-700 rounded-full z-10"></div>
                    {index > 0 && <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-2 border-slate-700 rounded-full z-10"></div>}
                  </div>
                  
                  {index < nodes.length - 1 && (
                    <div className="h-12 w-0.5 bg-slate-800 relative">
                       <div className="absolute top-0 bottom-0 left-0 right-0 animate-pulse bg-gradient-to-b from-indigo-500 to-transparent"></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
           </div>
        </div>
      </div>

      {/* Config Panel */}
      <div className={`w-80 border-l border-slate-800 bg-slate-900/50 backdrop-blur-md p-6 transition-all transform ${activeNode ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'}`}>
        {activeNode && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                 <h3 className="font-bold text-slate-200">{t.config}</h3>
                 <span className="text-[10px] text-slate-500 font-mono">#{activeNode.slice(-4)}</span>
              </div>
              <button onClick={() => setActiveNode(null)} className="text-slate-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              
              {/* Gemini Logic Specific Config */}
              {activeNodeData?.type === 'gemini_logic' && (
                <>
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t.labels.model}</label>
                    <select 
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                      value={activeNodeData.config?.model || 'gemini-3-flash-preview'}
                      onChange={(e) => updateNodeConfig(activeNode, { ...activeNodeData.config, model: e.target.value })}
                    >
                      <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
                      <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
                      <option value="gemini-flash-lite-latest">Gemini Flash Lite</option>
                    </select>
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t.labels.systemInstruction}</label>
                    <textarea 
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:ring-1 focus:ring-cyan-500 outline-none h-24 resize-none transition-all"
                      placeholder="You are a data analyzer..."
                      value={activeNodeData.config?.systemInstruction || ''}
                      onChange={(e) => updateNodeConfig(activeNode, { ...activeNodeData.config, systemInstruction: e.target.value })}
                    />
                  </div>
                </>
              )}

              {/* Standard Prompt / Data Field */}
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t.labels.prompt}</label>
                <textarea 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none h-32 resize-none transition-all"
                  placeholder={t.placeholder}
                  value={activeNodeData?.config?.input || ''}
                  onChange={(e) => updateNodeConfig(activeNode, { ...activeNodeData?.config, input: e.target.value })}
                />
              </div>

              {activeNodeData?.type === 'github' && (
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t.labels.repo}</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
                    value={activeNodeData.config?.repo || ''}
                    onChange={(e) => updateNodeConfig(activeNode, { ...activeNodeData.config, repo: e.target.value })}
                  >
                    <option value="">Select Repository</option>
                    <option value="Nexus Core">Nexus Core</option>
                    <option value="Gemini Utils">Gemini Utils</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;
