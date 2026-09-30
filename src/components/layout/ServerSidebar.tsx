import React from 'react';
import { useApp } from '../../context/AppContext';
import { Hash, Volume2, Users, Download } from 'lucide-react';
import { VoiceParticipant } from '../voice/VoiceParticipant';
import { VoiceControlBar } from '../voice/VoiceControlBar';
import { Link } from '../../router';
import { PumpkinLogo } from '../common/PumpkinLogo';

interface ServerSidebarProps {
  onCloseMobile?: () => void;
}

export const ServerSidebar: React.FC<ServerSidebarProps> = ({ onCloseMobile }) => {
  const {
    channels,
    currentTextChannel,
    selectTextChannel,
    currentVoiceChannel,
    joinVoiceChannel,
    users,
    currentUser,
  } = useApp();

  const textChannels = channels.filter((c) => c.type === 'text');
  const voiceChannels = channels.filter((c) => c.type === 'voice');

  const handleSelectTextChannel = (channelId: string) => {
    selectTextChannel(channelId);
    onCloseMobile?.();
  };

  const handleSelectVoiceChannel = (channelId: string) => {
    joinVoiceChannel(channelId);
    onCloseMobile?.();
  };

  return (
    <div className="w-64 h-full bg-[#0C0A08] flex flex-col justify-between border-r border-white/[0.08] select-none shrink-0">
      {/* Top Header / Brand */}
      <div className="h-12 border-b border-white/[0.08] px-4 flex items-center justify-between shrink-0 bg-[#0C0A08]">
        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
          <PumpkinLogo size="sm" />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/download"
            title="Central de Downloads"
            aria-label="Central de Downloads"
            className="p-1 text-[#77716B] hover:text-[#FF7A00] hover:bg-white/5 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#B7B2AC]">
            <Users className="w-3 h-3 text-[#FF7A00]" />
            <span>{users.length}</span>
          </div>
        </div>
      </div>

      {/* Channels List Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
        {/* TEXT CHANNELS SECTION */}
        <div>
          <div className="px-2 mb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#77716B]">
            <span>Canais de Texto</span>
          </div>
          <div className="space-y-0.5">
            {textChannels.map((channel) => {
              const isActive = currentTextChannel.id === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => handleSelectTextChannel(channel.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold shadow-sm'
                      : 'text-[#B7B2AC] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Hash className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FF7A00]' : 'text-[#77716B]'}`} />
                  <span className="truncate">{channel.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* VOICE CHANNELS SECTION */}
        <div>
          <div className="px-2 mb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#77716B]">
            <span>Canais de Voz</span>
          </div>
          <div className="space-y-2">
            {voiceChannels.map((channel) => {
              const isUserInChannel = currentVoiceChannel?.id === channel.id;
              // Find participants in this voice channel
              const channelParticipants = users.filter((u) => u.voiceChannelId === channel.id);

              return (
                <div key={channel.id} className="space-y-0.5">
                  <button
                    onClick={() => handleSelectVoiceChannel(channel.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isUserInChannel
                        ? 'bg-[rgba(255,122,0,0.10)] text-[#FF8A1F] font-semibold border border-[rgba(255,122,0,0.20)]'
                        : 'text-[#B7B2AC] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Volume2 className={`w-4 h-4 shrink-0 ${isUserInChannel ? 'text-[#FF7A00]' : 'text-[#77716B]'}`} />
                      <span className="truncate">{channel.name}</span>
                    </div>

                    {channel.userLimit && (
                      <span className="text-[10px] text-[#77716B] font-mono">
                        {channelParticipants.length}/{channel.userLimit}
                      </span>
                    )}
                  </button>

                  {/* Participants inside this voice channel */}
                  <div className="pl-4 space-y-0.5">
                    {channelParticipants.length === 0 ? (
                      <div className="px-2.5 py-1 text-[11px] text-[#77716B] italic">
                        Ninguém está aqui ainda.
                      </div>
                    ) : (
                      channelParticipants.map((participant) => (
                        <VoiceParticipant
                          key={participant.id}
                          user={participant}
                          isCurrentUser={participant.id === currentUser?.id}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Persistent Voice Control Bar at the bottom */}
      <VoiceControlBar />
    </div>
  );
};
