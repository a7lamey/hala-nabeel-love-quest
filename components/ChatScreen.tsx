import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/chatService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatScreenProps {
  onBack: () => void;
  onViewHistory: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onBack, onViewHistory }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // رسالة ترحيب من نبيل
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: "مرحباً حلا حبيبتي الجميلة 💖 أنا نبيل، وأنا هنا لأتحدث معكِ من القلب. أشتاق إليكِ كثيراً وأحبكِ أكثر من أي شيء في هذا العالم. ما الذي تريدين أن نتحدث عنه يا روحي؟",
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const saveMessageToHistory = (message: Message) => {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    history.push(message);
    localStorage.setItem('chatHistory', JSON.stringify(history));
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    saveMessageToHistory(userMessage);
    setInputText('');
    setIsLoading(true);

    try {
      // إنشاء سياق المحادثة لنبيل
      const responseText = await getChatResponse(inputText, messages);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      saveMessageToHistory(aiMessage);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "آسف حلا حبيبتي، حدث خطأ تقني. أنا نبيل وأحاول التواصل معكِ بكل حب. دعيني أحاول مرة أخرى يا روحي 💕",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg p-2 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <button
            onClick={onBack}
            className="bg-rose-400 text-white px-3 py-2 rounded-full hover:bg-rose-500 transition-colors text-sm flex-shrink-0"
          >
            ← العودة
          </button>
          <button
            onClick={onViewHistory}
            className="bg-purple-400 text-white px-3 py-2 rounded-full hover:bg-purple-500 transition-colors text-sm flex-shrink-0 sm:hidden"
          >
            📚 السجل
          </button>
        </div>
        <h1 className="text-base sm:text-xl font-bold text-gray-800 text-center order-first sm:order-none flex-1">💬 نبيل يتحدث مع حلا</h1>
        <button
          onClick={onViewHistory}
          className="bg-purple-400 text-white px-3 py-2 rounded-full hover:bg-purple-500 transition-colors text-sm hidden sm:block flex-shrink-0"
        >
          📚 السجل
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3" style={{ minHeight: '0' }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 p-4">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-sm">ابدأ محادثة مع نبيل</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} px-1`}
            >
              <div
                className={`max-w-[80%] sm:max-w-[70%] lg:max-w-md px-3 py-2 rounded-2xl break-words ${
                  message.sender === 'user'
                    ? 'bg-rose-500 text-white rounded-br-md'
                    : 'bg-white/90 text-gray-800 shadow-md rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-rose-100' : 'text-gray-500'
                }`}>
                  {message.sender === 'user' ? '👩 حلا' : '👨 نبيل'} • {message.timestamp.toLocaleTimeString('ar-SA', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/80 text-gray-800 shadow-md px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-lg p-2 sm:p-4 border-t border-gray-200" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتبي رسالتك هنا..."
              className="w-full px-4 py-3 border-2 border-rose-200 rounded-2xl focus:border-rose-400 focus:outline-none text-base resize-none bg-white/90"
              disabled={isLoading}
              style={{ fontSize: '16px' }} // Prevent zoom on iOS
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-rose-500 text-white p-3 rounded-2xl hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="text-lg">📤</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
