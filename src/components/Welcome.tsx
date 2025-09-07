import React, { useState } from 'react';
import { User } from '../types';

interface WelcomeProps {
  onUserSet: (user: User) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onUserSet }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const user: User = {
        name: name.trim(),
        createdAt: new Date().toISOString()
      };
      onUserSet(user);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-8">
      <div className="bg-[#2a2a2a] p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Quiz Generator
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
              Enter your name to get started
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] text-white border border-gray-600 focus:border-white focus:outline-none"
              placeholder="Your name"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-[#1a1a1a] py-3 px-6 font-medium hover:bg-gray-200 transition-colors"
          >
            Start Generating Quizzes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Welcome;