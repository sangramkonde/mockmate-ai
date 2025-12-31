
export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export enum InterviewStyle {
  Formal = 'Formal',
  SemiFormal = 'Semi-formal',
  Casual = 'Casual/Friendly',
}

export enum Strictness {
  Supportive = 'Supportive',
  Balanced = 'Balanced',
  Tough = 'Tough',
}

export interface JobConfig {
  jobDescription: string;
  roleTitle: string;
  companyName?: string;
  difficulty: Difficulty;
  durationMinutes: number;
  style: InterviewStyle;
  strictness: Strictness;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface InterviewFeedback {
  strengths: string[];
  improvements: string[];
  scores: {
    communication: number;
    technical: number;
    problemSolving: number;
    culturalFit: number;
    overall: number;
  };
  summary: string;
  recommendations: string[];
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export type AppState = 'landing' | 'login' | 'signup' | 'verification' | 'dashboard' | 'setup' | 'interview' | 'feedback';
