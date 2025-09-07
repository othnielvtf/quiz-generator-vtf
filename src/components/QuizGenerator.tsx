import React, { useState } from 'react';
import { Settings, Quiz } from '../types';
import { generateQuiz } from '../utils/api';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

interface QuizGeneratorProps {
  settings: Settings;
  onQuizGenerated: (quiz: Quiz) => void;
  onBack: () => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ settings, onQuizGenerated, onBack }) => {
  const [subject, setSubject] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setIsGenerating(true);
    setError(null);

    const result = await generateQuiz(subject.trim(), settings);
    
    if (result.success && result.data) {
      onQuizGenerated(result.data);
    } else {
      setError(result.error || 'Failed to generate quiz');
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-white">Generate Quiz</h1>
        </div>

        <div className="bg-[#2a2a2a] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-white text-sm font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] text-white border border-gray-600 focus:border-white focus:outline-none"
                placeholder="e.g., Mathematics, History, Science"
                required
                disabled={isGenerating}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-[#1a1a1a] p-4">
              <h3 className="text-white font-medium mb-2">Current Settings</h3>
              <div className="text-gray-400 text-sm space-y-1">
                <p>AI Source: {settings.aiSource === 'ollama' ? 'Local Ollama' : 'OpenRouter API'}</p>
                <p>Model: {settings.model}</p>
                {settings.aiSource === 'ollama' && <p>URL: {settings.ollamaUrl}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !subject.trim()}
              className="w-full bg-white text-[#1a1a1a] py-3 px-6 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating Quiz...
                </>
              ) : (
                'Generate Quiz'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;