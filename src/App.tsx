import React, { useState, useEffect } from 'react';
import { User, Quiz, Settings } from './types';
import { storage } from './utils/storage';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [settings, setSettings] = useState<Settings>({
    aiSource: 'ollama',
    ollamaUrl: 'http://localhost:11434',
    openrouterApiKey: '',
    model: 'llama3.2'
  });

  useEffect(() => {
    const savedUser = storage.getUser();
    const savedQuizzes = storage.getQuizzes();
    const savedSettings = storage.getSettings();

    if (savedUser) setUser(savedUser);
    setQuizzes(savedQuizzes);
    setSettings(savedSettings);
  }, []);

  const handleUserSet = (newUser: User) => {
    storage.setUser(newUser);
    setUser(newUser);
  };

  const handleQuizGenerated = (quiz: Quiz) => {
    storage.addQuiz(quiz);
    setQuizzes(prev => [...prev, quiz]);
  };

  const handleSettingsChange = (newSettings: Settings) => {
    storage.setSettings(newSettings);
    setSettings(newSettings);
  };

  if (!user) {
    return <Welcome onUserSet={handleUserSet} />;
  }

  return (
    <Dashboard
      user={user}
      quizzes={quizzes}
      settings={settings}
      onQuizGenerated={handleQuizGenerated}
      onSettingsChange={handleSettingsChange}
    />
  );
}

export default App;