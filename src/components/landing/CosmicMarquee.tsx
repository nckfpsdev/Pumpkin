import React from 'react';

const MARQUEE_ITEMS = [
  'VOICE CHANNELS',
  'WEBRTC MESH',
  '1080P 60 FPS',
  'OPUS 48KHZ',
  'REALTIME WEBSOCKET',
  'LOW LATENCY',
  'WINDOWS NSIS',
  'ANDROID MEDIAPROJECTION',
  'ZERO SIGNUP',
  'HARDWARE ACCELERATED',
];

export const CosmicMarquee: React.FC = () => {
  return (
    <div
      className="py-6 border-y border-white/[0.04] bg-[#080808]/70 overflow-hidden select-none relative"
      aria-hidden="true"
    >
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-10" />

      <div className="animate-marquee items-center gap-12 font-mono text-xs tracking-[0.25em] text-[#77716B]/60 uppercase font-semibold">
        {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, idx) => (
          <div key={idx} className="flex items-center gap-12 shrink-0">
            <span className="hover:text-[#B7B2AC] transition-colors">{item}</span>
            <span className="text-[#FF7A00]/50 text-xs">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
};
