
import React from 'react';
import type { Scenario } from '../types';
import ChoiceButton from './ChoiceButton';
import LoadingSpinner from './LoadingSpinner';
import { girlfriendImage } from '../assets/girlfriend';

interface GameScreenProps {
  scenario: Scenario;
  onChoice: (choice: string, isFinal: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

const GameScreen: React.FC<GameScreenProps> = ({ scenario, onChoice, isLoading, error }) => {
  return (
    <div dir="rtl" className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 flex flex-col items-center transition-opacity duration-500">
       <div className="w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-purple-200 mb-6">
        <img src={girlfriendImage} alt="My Inspiration" className="w-full h-full object-cover" />
      </div>

      <div className="w-full text-center mb-8 min-h-[120px]">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <p className="text-2xl text-gray-700 leading-relaxed animate-fade-in">{scenario.storyText}</p>
        )}
      </div>

      {!isLoading && (
        <div className="w-full flex flex-col items-center space-y-4 animate-fade-in-up">
          {scenario.choices.map((choice, index) => (
            <ChoiceButton
              key={index}
              text={choice}
              onClick={() => onChoice(choice, choice.includes("النهائية"))}
            />
          ))}
        </div>
      )}

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default GameScreen;
