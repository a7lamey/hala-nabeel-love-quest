
import React from 'react';
import { girlfriendImage } from '../assets/girlfriend';

interface EndScreenProps {
  onRestart: () => void;
}

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);


const EndScreen: React.FC<EndScreenProps> = ({ onRestart }) => {
  return (
    <div dir="rtl" className="w-full max-w-lg mx-auto bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center flex flex-col items-center animate-fade-in-up relative overflow-hidden">
        <HeartIcon className="absolute -top-4 -left-4 w-24 h-24 text-rose-200/50 opacity-50 transform rotate-12" />
        <HeartIcon className="absolute -bottom-8 -right-4 w-32 h-32 text-purple-200/50 opacity-50 transform -rotate-12" />
        
        <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-rose-200 mb-6 z-10">
            <img src={girlfriendImage} alt="My Love" className="w-full h-full object-cover" />
        </div>

        <h1 className="font-great-vibes text-6xl text-rose-500 mb-4 z-10">إليكِ يا حبيبتي حلا</h1>
        <p className="text-xl text-gray-700 mb-6 leading-relaxed z-10">
            هذه مجرد لعبة صغيرة، لكنها تحمل في طياتها كل حبي وتقديري لكِ. أنتِ مغامرتي الأجمل، وقصتي المفضلة، ونهايتي السعيدة. كل يوم معكِ هو كنز.
        </p>
        <p className="text-3xl font-bold text-purple-600 mb-8 z-10">أحبكِ جداً.</p>

        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold text-xl py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out z-10"
        >
          نلعب مرة أخرى؟
        </button>
    </div>
  );
};

export default EndScreen;
