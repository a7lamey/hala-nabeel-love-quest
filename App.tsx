
import React, { useState, useCallback, useEffect } from 'react';
import type { Scenario } from './types';
import { GameState } from './types';
import { getNextScenario } from './services/geminiService';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';
import PasswordScreen from './components/PasswordScreen';
import ChatScreen from './components/ChatScreen';
import ChatHistory from './components/ChatHistory';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // فحص كلمة المرور عند تحميل الصفحة
  useEffect(() => {
    const checkAuth = () => {
      const access = localStorage.getItem('gameAccess');
      const accessTime = localStorage.getItem('accessTime');
      
      if (access === 'granted' && accessTime) {
        const timeDiff = Date.now() - parseInt(accessTime);
        // انتهاء صلاحية الجلسة بعد 24 ساعة
        if (timeDiff < 24 * 60 * 60 * 1000) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('gameAccess');
          localStorage.removeItem('accessTime');
        }
      }
    };
    
    checkAuth();
  }, []);

  const startGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const initialScenario = await getNextScenario([]);
      setScenario(initialScenario);
      setHistory([initialScenario.storyText]);
      setGameState(GameState.Playing);
    } catch (err) {
      setError('حدث خطأ أثناء بدء المغامرة. الرجاء المحاولة مرة أخرى.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChoice = useCallback(async (choice: string, isFinal: boolean) => {
    if (isFinal) {
      setGameState(GameState.End);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const currentHistory = [...history, `اختيارك: ${choice}`];

    try {
      const nextScenario = await getNextScenario(currentHistory);
      setScenario(nextScenario);
      setHistory([...currentHistory, nextScenario.storyText]);
    } catch (err) {
      setError('حدث خطأ في استحضار الفصل التالي من القصة. هل يمكنكِ إعادة المحاولة، يا ملكتي؟');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [history]);

  const restartGame = useCallback(() => {
    setGameState(GameState.Start);
    setScenario(null);
    setHistory([]);
    setError(null);
  }, []);

  const goToChat = useCallback(() => {
    setGameState(GameState.Chat);
  }, []);

  const goToChatHistory = useCallback(() => {
    setGameState(GameState.ChatHistory);
  }, []);

  const backToStart = useCallback(() => {
    setGameState(GameState.Start);
  }, []);

  const handlePasswordCorrect = useCallback(() => {
    setIsAuthenticated(true);
    // تغيير أيقونة المتصفح بعد إدخال كلمة المرور الصحيحة
    const favicon = document.getElementById('favicon') as HTMLLinkElement;
    if (favicon) {
      favicon.href = '/7la.jfif';
      favicon.type = 'image/jpeg';
    }
  }, []);

  const renderContent = () => {
    if (!isAuthenticated) {
      return <PasswordScreen onPasswordCorrect={handlePasswordCorrect} />;
    }

    switch (gameState) {
      case GameState.Start:
        return <StartScreen onStart={startGame} onChat={goToChat} isLoading={isLoading} />;
      case GameState.Playing:
        return scenario ? (
          <GameScreen
            scenario={scenario}
            onChoice={handleChoice}
            isLoading={isLoading}
            error={error}
          />
        ) : null;
      case GameState.End:
        return <EndScreen onRestart={restartGame} />;
      case GameState.Chat:
        return <ChatScreen onBack={backToStart} onViewHistory={goToChatHistory} />;
      case GameState.ChatHistory:
        return <ChatHistory onBack={goToChat} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 via-rose-100 to-amber-100 min-h-screen text-gray-800 flex items-center justify-center p-4">
      {renderContent()}
    </div>
  );
};

export default App;
