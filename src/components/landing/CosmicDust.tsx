import React, { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  blur: number;
}

export const CosmicDust: React.FC = () => {
  // Pre-generate deterministic cosmic dust particles to avoid hydration mismatches
  const particles = useMemo<Particle[]>(() => {
    const list: Particle[] = [];
    const count = 38;
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-random distribution
      const seed = (i * 9301 + 49297) % 233280;
      const seed2 = (seed * 9301 + 49297) % 233280;
      const seed3 = (seed2 * 9301 + 49297) % 233280;

      list.push({
        id: i,
        x: (seed / 233280) * 100,
        y: (seed2 / 233280) * 100,
        size: 0.8 + ((seed3 / 233280) * 1.6), // 0.8px to 2.4px
        opacity: 0.12 + ((seed / 233280) * 0.35), // 0.12 to 0.47
        blur: (i % 5 === 0) ? 1 : 0,
      });
    }
    return list;
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      <svg className="w-full h-full opacity-70" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="particle-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF1E6" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF8A1F" stopOpacity="0" />
          </radialGradient>
        </defs>
        {particles.map((p) => (
          <circle
            key={p.id}
            cx={`${p.x}%`}
            cy={`${p.y}%`}
            r={p.size}
            fill="#FFF1E6"
            opacity={p.opacity}
            style={p.blur ? { filter: 'blur(1px)' } : undefined}
          />
        ))}
      </svg>
    </div>
  );
};
