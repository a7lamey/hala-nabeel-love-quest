
import React from 'react';
import { girlfriendImage } from '../assets/girlfriend';
import LoadingSpinner from './LoadingSpinner';

interface StartScreenProps {
  onStart: () => void;
  onChat: () => void;
  isLoading: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onChat, isLoading }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center p-3 sm:p-4">
      <div className="text-center max-w-sm sm:max-w-md mx-auto">
        <div className="mb-6 sm:mb-8">
          <img 
            src={girlfriendImage} 
            alt="حبيبتي" 
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 sm:mb-6 shadow-2xl border-4 border-white object-cover object-top scale-150"
          />
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            مرحباً بحبيبتي الغالية 💕
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            لعبة خاصة مصممة لك بكل الحب
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={onStart}
            disabled={isLoading}
            className="w-full bg-rose-500 text-white text-lg sm:text-xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-lg hover:bg-rose-600 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'جاري التحضير...' : 'ابدأ اللعبة 🎮'}
          </button>

          <button
            onClick={onChat}
            className="w-full bg-purple-500 text-white text-lg sm:text-xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-lg hover:bg-purple-600 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            تحدثي مع نبيل 💬
          </button>
        </div>

        <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500">
          <p>🌹 صُنعت بحب خاص لك 🌹</p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
