
export enum AppMode {
  HUB = 'HUB',
  CHAT = 'CHAT',
  IMAGE = 'IMAGE',
  EMAIL = 'EMAIL',
  ADMIN = 'ADMIN',
  WORKFLOWS = 'WORKFLOWS'
}

export type Language = 'es' | 'en';

export type NodeType = 'trigger' | 'gemini' | 'image' | 'github' | 'email' | 'logic' | 'gemini_logic';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  config: any;
  position: { x: number; y: number };
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: { source: string; target: string }[];
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  action: string;
  target: AppMode;
  details: string;
  status: 'success' | 'failed' | 'pending';
}

export interface GithubRepo {
  id: string;
  name: string;
  url: string;
  connected: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
  imageUrl?: string; 
  isRouting?: boolean;
}

export interface RouterResponse {
  targetApp: AppMode;
  refinedPrompt: string;
  reasoning: string;
}

export enum ImageResolution {
  RES_1K = '1K',
  RES_2K = '2K',
  RES_4K = '4K'
}
