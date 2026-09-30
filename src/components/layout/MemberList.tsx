import React from 'react';
import { useApp } from '../../context/AppContext';
import { getInitials } from '../../utils/helpers';
import { Monitor, Mic, Volume2 } from 'lucide-react';

export const MemberList: React.FC = () => {
  const { users, currentUser } = useApp();

  return (
    <div className="w-56 h-full bg-[#0c0f16] border-l border-white/10 flex flex-col shrink-0 select-none overflow-hidden">
      {/* Header */}
      <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Participantes &bull; {users.length}
        </span>
      </div>

      {/* Member list scroll */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {users.map((user) => {
          const isCurrent = user.id === currentUser?.id;
          const isInVoice = Boolean(user.voiceChannelId);
          const isSpeaking = user.isSpeaking && !user.isMuted && !user.isDeafened;

          return (
            <div
              key={user.id}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Avatar with speaking glow */}
                <div className="relative shrink-0">
                  <div
                    style={{ backgroundColor: user.avatarColor }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-slate-950 font-bold text-xs transition-all duration-150 ${
                      isSpeaking ? 'ring-2 ring-[#00e5ff] shadow-sm shadow-[#00e5ff]/50' : ''
                    }`}
                  >
                    {getInitials(user.displayName)}
                  </div>
                  {/* Status dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0c0f16]" />
                </div>

                {/* Name */}
                <div className="truncate">
                  <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate flex items-center gap-1">
                    <span className="truncate">{user.displayName}</span>
                    {isCurrent && <span className="text-[10px] text-[#00e5ff] shrink-0">(você)</span>}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {isInVoice ? (
                      <span className="text-[#00e5ff] flex items-center gap-1">
                        <Volume2 className="w-2.5 h-2.5" />
                        <span>Em chamada</span>
                      </span>
                    ) : (
                      'Disponível'
                    )}
                  </div>
                </div>
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1 shrink-0 text-slate-500">
                {user.isScreenSharing && (
                  <span title="Transmitindo tela" className="text-[#00e5ff]">
                    <Monitor className="w-3.5 h-3.5" />
                  </span>
                )}
                {isSpeaking && (
                  <span title="Falando agora" className="text-emerald-400">
                    <Mic className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
