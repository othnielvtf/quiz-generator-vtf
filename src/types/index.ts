export interface User {
  name: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  subject: string;
  questions: Question[];
  createdAt: string;
  aiSource: 'ollama' | 'openrouter';
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  answers: number[];
  score: number;
  completedAt: string;
}

export interface Settings {
  aiSource: 'ollama' | 'openrouter';
  ollamaUrl: string;
  openrouterApiKey: string;
  model: string;
}

export interface APIResponse {
  success: boolean;
  data?: Quiz;
  error?: string;
}