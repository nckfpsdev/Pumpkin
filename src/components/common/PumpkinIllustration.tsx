import React from 'react';

interface PumpkinIllustrationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'geometric-p' | 'pumpkin';
  className?: string;
  glow?: boolean;
  animated?: boolean;
}

export const PumpkinIllustration: React.FC<PumpkinIllustrationProps> = ({
  size = 'md',
  variant = 'geometric-p',
  className = '',
  glow = true,
  animated = true,
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-52 h-52 sm:w-64 sm:h-64',
    hero: 'w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96',
  }[size];

  const imageSrc = variant === 'geometric-p' ? '/pumpkin-p-logo.svg' : '/pumpkin.svg';
  const altText = variant === 'geometric-p' ? 'pumpkin logo mark' : 'Abóbora pumpkin';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        animated ? 'transition-transform duration-500 hover:scale-105' : ''
      } ${className}`}
    >
      {/* Dynamic warm aura behind the mark */}
      {glow && (
        <div
          className="absolute inset-0 bg-gradient-to-tr from-[#FF6A00]/25 via-[#FF8A1F]/15 to-transparent rounded-full blur-2xl pointer-events-none transform -translate-y-2 scale-90"
          aria-hidden="true"
        />
      )}

      {/* High-fidelity geometric logo / mark */}
      <img
        src={imageSrc}
        alt={altText}
        className={`${sizeClasses} relative z-10 object-contain drop-shadow-[0_12px_24px_rgba(255,122,0,0.28)]`}
        loading="lazy"
        draggable={false}
      />
    </div>
  );
};
