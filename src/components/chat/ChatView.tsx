import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Hash, MessageSquare } from 'lucide-react';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatInput } from './ChatInput';

export const ChatView: React.FC = () => {
  const { currentTextChannel, messages, currentUser } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);

  // Handle scroll detection
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 80;
    userScrolledUpRef.current = !isAtBottom;
  };

  // Auto-scroll to bottom on new message unless user scrolled up
  useEffect(() => {
    if (!userScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090b0e] overflow-hidden">
      {/* Channel Header */}
      <div className="h-12 border-b border-white/5 px-4 flex items-center justify-between shrink-0 bg-[#090b0e]/95 backdrop-blur z-10">
        <div className="flex items-center gap-2 min-w-0">
          <Hash className="w-4 h-4 text-slate-400 shrink-0" />
          <h2 className="text-sm font-bold text-white tracking-tight truncate">
            {currentTextChannel.name}
          </h2>
          {currentTextChannel.description && (
            <>
              <span className="text-slate-600 text-xs hidden sm:inline" aria-hidden="true">&bull;</span>
              <span className="text-xs text-slate-400 truncate hidden sm:inline">
                {currentTextChannel.description}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-1 py-4 space-y-1"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">
              #{currentTextChannel.name}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Inicie a conversa. Envie uma mensagem para todos no servidor em tempo real.
            </p>
          </div>
        ) : (
          <>
            {/* Header info in chat */}
            <div className="px-4 py-3 mb-4 border-b border-white/5">
              <div className="flex items-center gap-2 text-white font-bold text-base mb-1">
                <Hash className="w-5 h-5 text-[#00e5ff]" />
                <span>Bem-vindo a #{currentTextChannel.name}!</span>
              </div>
              <p className="text-xs text-slate-400">
                Este é o início do histórico do canal #{currentTextChannel.name}.
              </p>
            </div>

            {messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                isCurrentUser={msg.userId === currentUser?.id}
              />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
};
