import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface PasswordScreenProps {
  onPasswordCorrect: () => void;
}

const PasswordScreen: React.FC<PasswordScreenProps> = ({ onPasswordCorrect }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  // كلمة المرور المشفرة (يمكنك تغييرها)
  const correctPasswordHash = 'my_secret_password_2024'; // غير هذا إلى كلمة المرور التي تريدها

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // محاكاة تأخير للأمان
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (password === correctPasswordHash) {
      // حفظ كلمة المرور في localStorage للجلسة
      localStorage.setItem('gameAccess', 'granted');
      localStorage.setItem('accessTime', Date.now().toString());
      onPasswordCorrect();
    } else {
      setAttempts(prev => prev + 1);
      setError('كلمة المرور غير صحيحة. حاول مرة أخرى.');
      setPassword('');
      
      // حماية إضافية: تأخير متزايد بعد محاولات فاشلة
      if (attempts >= 2) {
        setError('محاولات كثيرة خاطئة. انتظر قليلاً...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔐</div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">دخول خاص</h1>
          <p className="text-sm sm:text-base text-gray-600">أدخل كلمة المرور للوصول للعبة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none text-center text-sm sm:text-base"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center text-sm sm:text-base">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full bg-rose-500 text-white py-2 sm:py-3 rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-sm sm:text-base"
          >
            {isLoading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
          <p>🌹 مخصص لحبيبتي الغالية 🌹</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordScreen;
