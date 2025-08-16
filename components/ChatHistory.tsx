import React, { useState, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatHistoryProps {
  onBack: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const parsedHistory = history.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
    setMessages(parsedHistory);
  };

  const clearHistory = () => {
    localStorage.removeItem('chatHistory');
    setMessages([]);
    setShowConfirmClear(false);
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredMessages = messages.filter(message =>
    message.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach(message => {
      const dateKey = message.timestamp.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(filteredMessages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-3 sm:p-4 mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <button
              onClick={onBack}
              className="bg-rose-400 text-white px-3 py-2 sm:px-4 rounded-full hover:bg-rose-500 transition-colors text-sm sm:text-base order-1 sm:order-none"
            >
              ← العودة للشات
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center order-2 sm:order-none">📚 سجل المحادثات السري</h1>
            <div className="flex space-x-2 rtl:space-x-reverse gap-2 order-3 sm:order-none">
              <button
                onClick={exportHistory}
                className="bg-blue-400 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-full hover:bg-blue-500 transition-colors text-xs sm:text-sm"
                disabled={messages.length === 0}
              >
                📥 تصدير
              </button>
              <button
                onClick={() => setShowConfirmClear(true)}
                className="bg-red-400 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-full hover:bg-red-500 transition-colors text-xs sm:text-sm"
                disabled={messages.length === 0}
              >
                🗑️ مسح
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث في المحادثات..."
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-purple-200 rounded-full focus:border-purple-400 focus:outline-none text-sm sm:text-base"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center mt-4">
            <div className="bg-rose-100 rounded-lg p-2 sm:p-3">
              <div className="text-lg sm:text-2xl font-bold text-rose-600">{messages.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">إجمالي الرسائل</div>
            </div>
            <div className="bg-purple-100 rounded-lg p-2 sm:p-3">
              <div className="text-lg sm:text-2xl font-bold text-purple-600">{Object.keys(messageGroups).length}</div>
              <div className="text-xs sm:text-sm text-gray-600">أيام المحادثة</div>
            </div>
            <div className="bg-pink-100 rounded-lg p-2 sm:p-3">
              <div className="text-lg sm:text-2xl font-bold text-pink-600">{filteredMessages.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">نتائج البحث</div>
            </div>
          </div>
        </div>

        {/* Messages by Date */}
        <div className="space-y-4 sm:space-y-6">
          {Object.keys(messageGroups).length === 0 ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 sm:p-8 text-center">
              <div className="text-4xl sm:text-6xl mb-4">📭</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-600 mb-2">لا توجد محادثات</h3>
              <p className="text-sm sm:text-base text-gray-500">ابدأ محادثة جديدة لترى السجل هنا</p>
            </div>
          ) : (
            Object.entries(messageGroups)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, dayMessages]) => (
                <div key={date} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-3 sm:mb-4 border-b pb-2">
                    📅 {new Date(date).toLocaleDateString('ar-SA', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  
                  <div className="space-y-2 sm:space-y-3">
                    {dayMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-rose-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm sm:text-base mb-1 leading-relaxed">{message.text}</p>
                          <p className={`text-xs ${
                            message.sender === 'user' ? 'text-rose-100' : 'text-gray-500'
                          }`}>
                            {message.sender === 'user' ? '👩 حلا' : '👨 نبيل'} • {' '}
                            {message.timestamp.toLocaleTimeString('ar-SA', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Confirm Clear Dialog */}
        {showConfirmClear && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm w-full">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">⚠️ تأكيد المسح</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                هل أنت متأكد من مسح جميع المحادثات؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex space-x-3 rtl:space-x-reverse gap-2">
                <button
                  onClick={clearHistory}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
                >
                  نعم، امسح الكل
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
