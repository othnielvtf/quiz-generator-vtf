import React, { useState } from 'react';
import { Quiz, QuizAttempt } from '../types';
import { storage } from '../utils/storage';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

interface QuizTakerProps {
  quiz: Quiz;
  onComplete: () => void;
  onBack: () => void;
}

const QuizTaker: React.FC<QuizTakerProps> = ({ quiz, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      const score = answers.reduce((acc, answer, index) => {
        return acc + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
      }, 0);

      const attempt: QuizAttempt = {
        id: crypto.randomUUID(),
        quizId: quiz.id,
        answers,
        score,
        completedAt: new Date().toISOString()
      };

      storage.addAttempt(attempt);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (showResults) {
    const score = answers.reduce((acc, answer, index) => {
      return acc + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);

    return (
      <div className="min-h-screen bg-[#1a1a1a] p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#2a2a2a] p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h1>
            <div className="text-6xl font-bold text-white mb-4">
              {score}/{quiz.questions.length}
            </div>
            <p className="text-gray-400 mb-8">
              {Math.round((score / quiz.questions.length) * 100)}% Correct
            </p>

            <div className="space-y-4 mb-8 text-left">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="bg-[#1a1a1a] p-4">
                  <div className="flex items-start gap-3 mb-2">
                    {answers[index] === question.correctAnswer ? (
                      <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
                    ) : (
                      <XCircle className="text-red-400 mt-1 flex-shrink-0" size={20} />
                    )}
                    <div>
                      <h3 className="text-white font-medium mb-2">{question.question}</h3>
                      <p className="text-gray-400 text-sm mb-1">
                        Your answer: {question.options[answers[index]]}
                      </p>
                      {answers[index] !== question.correctAnswer && (
                        <p className="text-green-400 text-sm mb-2">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-gray-300 text-sm">{question.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onComplete}
              className="bg-white text-[#1a1a1a] py-3 px-6 font-medium hover:bg-gray-200 transition-colors"
            >
              View All Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-white">{quiz.subject}</h1>
          </div>
          <div className="text-white">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
        </div>

        <div className="bg-[#2a2a2a] p-8">
          <div className="mb-6">
            <div className="w-full bg-[#1a1a1a] h-2 mb-4">
              <div 
                className="h-2 bg-white transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-6">{question.question}</h2>

          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left border transition-colors ${
                  selectedAnswer === index
                    ? 'bg-white text-[#1a1a1a] border-white'
                    : 'bg-[#1a1a1a] text-white border-gray-600 hover:border-white'
                }`}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-transparent text-white border border-gray-600 hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={selectedAnswer === undefined}
              className="px-6 py-2 bg-white text-[#1a1a1a] hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === quiz.questions.length - 1 ? 'Complete Quiz' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaker;