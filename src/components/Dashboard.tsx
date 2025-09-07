import React, { useState } from 'react';
import { User, Quiz, Settings as SettingsType } from '../types';
import { Plus, Settings, BookOpen, History } from 'lucide-react';
import QuizGenerator from './QuizGenerator';
import QuizTaker from './QuizTaker';
import QuizHistory from './QuizHistory';
import SettingsComponent from './Settings';

interface DashboardProps {
  user: User;
  quizzes: Quiz[];
  settings: SettingsType;
  onQuizGenerated: (quiz: Quiz) => void;
  onSettingsChange: (settings: SettingsType) => void;
}

type View = 'dashboard' | 'generate' | 'take' | 'history';

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  quizzes, 
  settings, 
  onQuizGenerated, 
  onSettingsChange 
}) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleTakeQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentView('take');
  };

  const handleQuizComplete = () => {
    setCurrentView('history');
    setSelectedQuiz(null);
  };

  if (currentView === 'generate') {
    return (
      <QuizGenerator
        settings={settings}
        onQuizGenerated={(quiz) => {
          onQuizGenerated(quiz);
          setCurrentView('dashboard');
        }}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'take' && selectedQuiz) {
    return (
      <QuizTaker
        quiz={selectedQuiz}
        onComplete={handleQuizComplete}
        onBack={() => {
          setCurrentView('dashboard');
          setSelectedQuiz(null);
        }}
      />
    );
  }

  if (currentView === 'history') {
    return (
      <QuizHistory
        quizzes={quizzes}
        onBack={() => setCurrentView('dashboard')}
        onTakeQuiz={handleTakeQuiz}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-6">
      {showSettings && (
        <SettingsComponent
          settings={settings}
          onSettingsChange={onSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user.name}
            </h1>
            <p className="text-gray-400">
              AI Source: {settings.aiSource === 'ollama' ? 'Local Ollama' : 'OpenRouter'}
            </p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="bg-[#2a2a2a] text-white p-3 hover:bg-[#3a3a3a] transition-colors"
          >
            <Settings size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setCurrentView('generate')}
            className="bg-[#2a2a2a] p-6 text-left hover:bg-[#3a3a3a] transition-colors group"
          >
            <Plus className="text-white mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">Generate Quiz</h3>
            <p className="text-gray-400">Create a new quiz on any subject</p>
          </button>

          <button
            onClick={() => setCurrentView('history')}
            className="bg-[#2a2a2a] p-6 text-left hover:bg-[#3a3a3a] transition-colors group"
          >
            <History className="text-white mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">Quiz History</h3>
            <p className="text-gray-400">View and retake your quizzes</p>
          </button>

          <div className="bg-[#2a2a2a] p-6">
            <BookOpen className="text-white mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">Statistics</h3>
            <p className="text-gray-400">Total Quizzes: {quizzes.length}</p>
          </div>
        </div>

        {quizzes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Quizzes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.slice(-6).reverse().map((quiz) => (
                <div key={quiz.id} className="bg-[#2a2a2a] p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{quiz.subject}</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {quiz.questions.length} questions • {quiz.aiSource}
                  </p>
                  <p className="text-gray-500 text-xs mb-4">
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleTakeQuiz(quiz)}
                    className="w-full bg-white text-[#1a1a1a] py-2 px-4 font-medium hover:bg-gray-200 transition-colors"
                  >
                    Take Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;