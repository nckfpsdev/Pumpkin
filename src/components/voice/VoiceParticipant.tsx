import React from 'react';
import { User } from '../../types';
import { MicOff, VolumeX, Monitor } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

interface VoiceParticipantProps {
  user: User;
  isCurrentUser?: boolean;
}

export const VoiceParticipant: React.FC<VoiceParticipantProps> = ({ user, isCurrentUser }) => {
  const isSpeaking = user.isSpeaking && !user.isMuted && !user.isDeafened;

  return (
    <div className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-xs">
      <div className="flex items-center gap-2 min-w-0">
        {/* Avatar with speaking indicator */}
        <div className="relative shrink-0">
          <div
            style={{ backgroundColor: user.avatarColor }}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-slate-950 font-bold text-[10px] transition-all duration-150 ${
              isSpeaking ? 'ring-2 ring-[#FF7A00] shadow-sm shadow-[#FF7A00]/40' : ''
            }`}
          >
            {getInitials(user.displayName)}
          </div>
          {/* Speaking indicator dot */}
          {isSpeaking && (
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF7A00] ring-1 ring-[#0C0A08]" />
          )}
        </div>

        {/* Display name */}
        <span
          className={`truncate font-medium transition-colors ${
            isSpeaking ? 'text-[#FF8A1F]' : 'text-slate-300 group-hover:text-white'
          }`}
        >
          {user.displayName}
          {isCurrentUser && <span className="text-[10px] text-slate-500 ml-1">(você)</span>}
        </span>
      </div>

      {/* Status icons */}
      <div className="flex items-center gap-1 shrink-0 text-slate-500">
        {user.isScreenSharing && (
          <span title="Compartilhando tela" className="text-[#FF7A00]">
            <Monitor className="w-3.5 h-3.5" />
          </span>
        )}
        {user.isMuted && !user.isDeafened && (
          <span title="Microfone silenciado" className="text-rose-400">
            <MicOff className="w-3.5 h-3.5" />
          </span>
        )}
        {user.isDeafened && (
          <span title="Áudio ensurdecido" className="text-rose-400">
            <VolumeX className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  );
};
