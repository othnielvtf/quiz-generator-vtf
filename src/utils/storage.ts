import { User, Quiz, QuizAttempt, Settings } from '../types';

const STORAGE_KEYS = {
  USER: 'quiz-app-user',
  QUIZZES: 'quiz-app-quizzes',
  ATTEMPTS: 'quiz-app-attempts',
  SETTINGS: 'quiz-app-settings',
};

export const storage = {
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getQuizzes: (): Quiz[] => {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZZES);
    return data ? JSON.parse(data) : [];
  },

  addQuiz: (quiz: Quiz): void => {
    const quizzes = storage.getQuizzes();
    quizzes.push(quiz);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  },

  getAttempts: (): QuizAttempt[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    return data ? JSON.parse(data) : [];
  },

  addAttempt: (attempt: QuizAttempt): void => {
    const attempts = storage.getAttempts();
    attempts.push(attempt);
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
  },

  getSettings: (): Settings => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      aiSource: 'ollama',
      ollamaUrl: 'http://localhost:11434',
      openrouterApiKey: '',
      model: 'llama3.2',
      difficulty: 'medium'
    };
  },

  setSettings: (settings: Settings): void => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },
};