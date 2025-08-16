
import React from 'react';

interface ChoiceButtonProps {
  text: string;
  onClick: () => void;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full max-w-sm bg-white text-purple-600 font-semibold text-lg py-3 px-6 rounded-full border-2 border-purple-300 shadow-md hover:bg-purple-100 hover:border-purple-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
    >
      {text}
    </button>
  );
};

export default ChoiceButton;
