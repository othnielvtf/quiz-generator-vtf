import React, { useState } from 'react';
import { Settings as SettingsType, Difficulty } from '../types';
import { X, Settings } from 'lucide-react';

interface SettingsProps {
  settings: SettingsType;
  onSettingsChange: (settings: SettingsType) => void;
  onClose: () => void;
}

const SettingsComponent: React.FC<SettingsProps> = ({ settings, onSettingsChange, onClose }) => {
  const [localSettings, setLocalSettings] = useState<SettingsType>(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleAISourceChange = (source: 'ollama' | 'openrouter') => {
    setLocalSettings(prev => ({
      ...prev,
      aiSource: source,
      model: source === 'ollama' ? 'llama3.2' : 'meta-llama/llama-3.2-3b-instruct:free'
    }));
  };
  
  const handleDifficultyChange = (difficulty: Difficulty) => {
    setLocalSettings(prev => ({
      ...prev,
      difficulty
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#2a2a2a] p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Settings className="text-white" size={24} />
            <h2 className="text-xl font-bold text-white">Settings</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              AI Source
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="aiSource"
                  value="ollama"
                  checked={localSettings.aiSource === 'ollama'}
                  onChange={() => handleAISourceChange('ollama')}
                  className="mr-2"
                />
                <span className="text-white">Local Ollama</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="aiSource"
                  value="openrouter"
                  checked={localSettings.aiSource === 'openrouter'}
                  onChange={() => handleAISourceChange('openrouter')}
                  className="mr-2"
                />
                <span className="text-white">OpenRouter API</span>
              </label>
            </div>
          </div>

          {localSettings.aiSource === 'ollama' && (
            <div>
              <label htmlFor="ollamaUrl" className="block text-white text-sm font-medium mb-2">
                Ollama URL
              </label>
              <input
                type="text"
                id="ollamaUrl"
                value={localSettings.ollamaUrl}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, ollamaUrl: e.target.value }))}
                className="w-full px-4 py-2 bg-[#1a1a1a] text-white border border-gray-600 focus:border-white focus:outline-none"
                placeholder="http://localhost:11434"
              />
            </div>
          )}

          {localSettings.aiSource === 'openrouter' && (
            <div>
              <label htmlFor="openrouterKey" className="block text-white text-sm font-medium mb-2">
                OpenRouter API Key
              </label>
              <input
                type="password"
                id="openrouterKey"
                value={localSettings.openrouterApiKey}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, openrouterApiKey: e.target.value }))}
                className="w-full px-4 py-2 bg-[#1a1a1a] text-white border border-gray-600 focus:border-white focus:outline-none"
                placeholder="Enter your OpenRouter API key"
              />
            </div>
          )}

          <div>
            <label htmlFor="model" className="block text-white text-sm font-medium mb-2">
              Model
            </label>
            <input
              type="text"
              id="model"
              value={localSettings.model}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, model: e.target.value }))}
              className="w-full px-4 py-2 bg-[#1a1a1a] text-white border border-gray-600 focus:border-white focus:outline-none"
              placeholder={localSettings.aiSource === 'ollama' ? 'llama3.2' : 'meta-llama/llama-3.2-3b-instruct:free'}
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Default Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleDifficultyChange(level as Difficulty)}
                  className={`py-2 px-4 text-center border ${localSettings.difficulty === level 
                    ? 'bg-white text-[#1a1a1a] border-white' 
                    : 'bg-transparent text-white border-gray-600 hover:border-white'} 
                    transition-colors capitalize`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-white text-[#1a1a1a] py-2 px-4 font-medium hover:bg-gray-200 transition-colors"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-transparent text-white border border-gray-600 py-2 px-4 font-medium hover:border-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;