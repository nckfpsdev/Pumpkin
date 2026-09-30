import React from 'react';
import { ChatMessage } from '../../types';
import { getInitials, formatTime } from '../../utils/helpers';

interface ChatMessageItemProps {
  message: ChatMessage;
  isCurrentUser?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, isCurrentUser }) => {
  return (
    <div className="group flex items-start gap-3 px-4 py-2 hover:bg-white/[0.02] transition-colors rounded-xl">
      {/* Avatar */}
      <div
        style={{ backgroundColor: message.avatarColor }}
        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-950 font-bold text-xs shrink-0 select-none shadow-sm shadow-black/40 mt-0.5"
      >
        {getInitials(message.displayName)}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {/* Header: Clean unboxed metadata with typographic dot separators (Zero-pill discipline) */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-white truncate">
            {message.displayName}
          </span>
          {isCurrentUser && (
            <span className="text-[10px] text-[#00e5ff] font-medium">(você)</span>
          )}
          <span className="text-slate-600 text-[10px]" aria-hidden="true">&bull;</span>
          <span className="text-[11px] text-slate-500 font-mono">
            {formatTime(message.createdAt)}
          </span>
        </div>

        {/* Content */}
        <div className="text-sm text-slate-200 leading-relaxed break-words whitespace-pre-wrap selection:bg-[#00e5ff]/20">
          {message.content}
        </div>
      </div>
    </div>
  );
};
