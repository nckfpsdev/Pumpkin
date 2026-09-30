import React from 'react';

interface PumpkinLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const PumpkinLogo: React.FC<PumpkinLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizeClasses = {
    sm: 'w-6 h-6 rounded-lg',
    md: 'w-8 h-8 rounded-xl',
    lg: 'w-10 h-10 rounded-2xl',
  }[size];

  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Modern, minimalist, geometric 'P' logo mark */}
      <div
        className={`${iconSizeClasses} relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0`}
      >
        <img
          src="/pumpkin-p-logo.svg"
          alt="pumpkin logo"
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(255,122,0,0.35)]"
          draggable={false}
        />
      </div>

      {showText && (
        <div className={`flex items-baseline tracking-tight font-mono ${textSizeClasses}`}>
          <span className="font-extrabold text-[#F8F7F5]">pump</span>
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] via-[#FF8A1F] to-[#FFB347]">
            kin
          </span>
        </div>
      )}
    </div>
  );
};
