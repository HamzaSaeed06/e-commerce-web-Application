import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Image as ImageIcon } from 'lucide-react';
import { getOrCreateChat, sendMessage, subscribeToMessages, markMessagesAsRead } from '../../services/chatService';
import { useAuthStore } from '../../store/authStore';
import type { ChatMessage } from '../../types';

const getGuestId = (): string => {
  let id = localStorage.getItem('guestId');
  if (!id) {
    id = 'g_' + Math.random().toString(36).slice(2);
    localStorage.setItem('guestId', id);
  }
  return id;
};

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chatId, setChatId] = useState<string>('');
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      const id = await getOrCreateChat(
        user?.uid || null,
        getGuestId(),
        user?.displayName || 'Guest'
      );
      setChatId(id);
    };
    initChat();
  }, [user]);

  useEffect(() => {
    if (!chatId) return;
    
    const unsubscribe = subscribeToMessages(chatId, (msgs) => {
      setMessages(msgs);
      markMessagesAsRead(chatId, 'user');
    });
    
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !chatId) return;
    
    const senderId = user?.uid || getGuestId();
    await sendMessage(chatId, senderId, 'user', inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--brand-500)] text-white rounded-full shadow-lg hover:bg-[var(--brand-600)] transition-all hover:scale-110 z-40 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] h-[450px] bg-white rounded-2xl shadow-xl border border-[var(--border-default)] overflow-hidden z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--brand-500)] text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="font-medium">Customer Support</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-[var(--text-muted)] py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-[var(--border-default)]" />
                <p className="text-sm">How can we help you today?</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderRole === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      msg.senderRole === 'user'
                        ? 'bg-[var(--brand-500)] text-white rounded-br-md'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[var(--border-default)]">
            <div className="flex items-center gap-2">
              <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <ImageIcon className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-[var(--bg-secondary)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-200)]"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="p-2 bg-[var(--brand-500)] text-white rounded-lg hover:bg-[var(--brand-600)] disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
