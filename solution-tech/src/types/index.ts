// types/index.ts

export type MessageRole = 'user' | 'assistant' | 'system';

export type FileType = 'image' | 'video' | 'pdf' | 'other';

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: FileType;
  mimeType: string;
  url: string;
  uploadedAt: Date;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  attachments?: FileAttachment[];
  isError?: boolean;
  isLoading?: boolean;
  chatId?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
}

export interface CompanyInfo {
  name: string;
  mission: string;
  vision: string;
  values: string[];
  departments: Department[];
  projects: Project[];
  contact: ContactInfo;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  employees: number;
  subDepartments?: Department[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate: Date;
  endDate?: Date;
  team: string[];
  technologies: string[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  website: string;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface ChatRequest {
  message: string;
  chatId?: string;
  attachments?: File[];
}

export interface ChatResponse {
  message: Message;
  suggestedQuestions?: string[];
}

export interface SearchResult {
  chatId: string;
  messageId: string;
  content: string;
  timestamp: Date;
  relevance: number;
}