import React from 'react';
import { Quiz } from '../types';
import { storage } from '../utils/storage';
import { ArrowLeft, Play } from 'lucide-react';

interface QuizHistoryProps {
  quizzes: Quiz[];
  onBack: () => void;
  onTakeQuiz: (quiz: Quiz) => void;
}

const QuizHistory: React.FC<QuizHistoryProps> = ({ quizzes, onBack, onTakeQuiz }) => {
  const attempts = storage.getAttempts();

  const getQuizStats = (quizId: string) => {
    const quizAttempts = attempts.filter(attempt => attempt.quizId === quizId);
    if (quizAttempts.length === 0) return null;

    const bestScore = Math.max(...quizAttempts.map(attempt => attempt.score));
    const lastAttempt = quizAttempts[quizAttempts.length - 1];
    const quiz = quizzes.find(q => q.id === quizId);
    const totalQuestions = quiz?.questions.length || 0;

    return {
      attempts: quizAttempts.length,
      bestScore,
      lastScore: lastAttempt.score,
      totalQuestions,
      lastAttemptDate: lastAttempt.completedAt
    };
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-white">Quiz History</h1>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-[#2a2a2a] p-8 text-center">
            <p className="text-gray-400 text-lg">No quizzes generated yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => {
              const stats = getQuizStats(quiz.id);
              return (
                <div key={quiz.id} className="bg-[#2a2a2a] p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{quiz.subject}</h3>
                      <p className="text-gray-400 text-sm">
                        {quiz.questions.length} questions • {quiz.aiSource}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Created: {new Date(quiz.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => onTakeQuiz(quiz)}
                      className="bg-white text-[#1a1a1a] p-2 hover:bg-gray-200 transition-colors"
                    >
                      <Play size={20} />
                    </button>
                  </div>

                  {stats ? (
                    <div className="bg-[#1a1a1a] p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Attempts:</span>
                        <span className="text-white">{stats.attempts}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Best Score:</span>
                        <span className="text-white">
                          {stats.bestScore}/{stats.totalQuestions} 
                          ({Math.round((stats.bestScore / stats.totalQuestions) * 100)}%)
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Score:</span>
                        <span className="text-white">
                          {stats.lastScore}/{stats.totalQuestions}
                          ({Math.round((stats.lastScore / stats.totalQuestions) * 100)}%)
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Taken:</span>
                        <span className="text-white">
                          {new Date(stats.lastAttemptDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#1a1a1a] p-4 text-center">
                      <span className="text-gray-400 text-sm">Not attempted yet</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;