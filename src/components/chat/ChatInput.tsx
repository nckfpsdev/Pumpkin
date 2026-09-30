import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Send } from 'lucide-react';

export const ChatInput: React.FC = () => {
  const { currentTextChannel, sendMessage } = useApp();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  };

  return (
    <div className="p-3 bg-[#0a0c10] border-t border-white/5">
      <div className="relative flex items-end gap-2 bg-[#12161f] border border-white/10 rounded-xl px-3 py-2 focus-within:border-[#00e5ff]/60 focus-within:ring-1 focus-within:ring-[#00e5ff]/30 transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={`Conversar em #${currentTextChannel.name}... (Enter para enviar)`}
          maxLength={2000}
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 resize-none focus:outline-none max-h-32 min-h-[24px] py-0.5 leading-snug"
        />

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            {text.length > 0 ? `${text.length}/2000` : ''}
          </span>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            aria-label="Enviar mensagem"
            className="p-1.5 rounded-lg bg-[#00e5ff] text-slate-950 hover:bg-[#38bdf8] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
          >
            <Send className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
