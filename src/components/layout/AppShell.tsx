import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ServerSidebar } from './ServerSidebar';
import { MemberList } from './MemberList';
import { ChatView } from '../chat/ChatView';
import { ScreenShareView } from '../stream/ScreenShareView';
import { SettingsModal } from '../settings/SettingsModal';
import { ToastContainer } from '../common/ToastContainer';
import { Menu, Users, X } from 'lucide-react';
import { Link } from '../../router';
import { PumpkinLogo } from '../common/PumpkinLogo';

export const AppShell: React.FC = () => {
  const {
    activeScreenShare,
    toggleMute,
    toggleDeafen,
    currentVoiceChannel,
    audioSettings,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMembersOpen, setMobileMembersOpen] = useState(false);

  // Global hotkeys (M for mute, D for deafen) - strictly disabled in inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (currentVoiceChannel) {
          e.preventDefault();
          toggleMute();
        }
      } else if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (currentVoiceChannel) {
          e.preventDefault();
          toggleDeafen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVoiceChannel, toggleMute, toggleDeafen]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#07090c] text-slate-100 overflow-hidden select-none font-sans">
      {/* Mobile Top Navbar */}
      <div className="md:hidden h-12 bg-[#0C0A08] border-b border-white/[0.08] px-3 flex items-center justify-between shrink-0 z-20">
        <button
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Abrir canais"
          className="p-2 text-[#B7B2AC] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center">
          <PumpkinLogo size="sm" />
        </Link>

        <button
          onClick={() => setMobileMembersOpen(true)}
          aria-label="Abrir lista de membros"
          className="p-2 text-[#B7B2AC] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
        >
          <Users className="w-5 h-5" />
        </button>
      </div>

      {/* Main 3-Column Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex h-full">
          <ServerSidebar />
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 h-full z-50 bg-[#0c0f16] flex flex-col shadow-2xl animate-slideRight">
              <div className="p-3 flex justify-end border-b border-white/5">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ServerSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Center Main Stage (Screen Share + Chat) */}
        <div className="flex-1 flex flex-col h-full min-w-0 bg-[#090b0e] overflow-hidden">
          {/* Real Screen Share View if active */}
          {activeScreenShare && <ScreenShareView />}

          {/* Real-Time Chat View */}
          <ChatView />
        </div>

        {/* Desktop Member List */}
        <div className="hidden lg:flex h-full">
          <MemberList />
        </div>

        {/* Mobile Member List Drawer */}
        {mobileMembersOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex justify-end">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMembersOpen(false)}
            />
            <div className="relative w-64 h-full z-50 bg-[#0c0f16] flex flex-col shadow-2xl animate-slideLeft">
              <div className="p-3 flex justify-between items-center border-b border-white/5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Participantes
                </span>
                <button
                  onClick={() => setMobileMembersOpen(false)}
                  aria-label="Fechar lista de membros"
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <MemberList />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Modals and Notifications */}
      <SettingsModal />
      <ToastContainer />
    </div>
  );
};
