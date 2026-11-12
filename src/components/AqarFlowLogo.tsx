import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const AqarFlowLogo: React.FC<LogoProps> = ({
  className = '',
  variant = 'light',
  size = 'md',
}) => {
  const isDark = variant === 'dark';
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 font-sans select-none ${className}`}>
      {/* Golden/Amber House outline logo matching screenshot */}
      <div className={`relative ${iconSize} flex items-center justify-center shrink-0`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Outer golden house roof & frame */}
          <path
            d="M20 5L6 16.5V34C6 35.1046 6.89543 36 8 36H32C33.1046 36 34 35.1046 34 34V16.5L20 5Z"
            stroke="#D97706"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Inner roof chevron */}
          <path
            d="M20 13L13 18.5V28H27V18.5L20 13Z"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inner door */}
          <path
            d="M17 28V22C17 20.3431 18.3431 19 20 19C21.6569 19 23 20.3431 23 22V28"
            stroke="#D97706"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <span className={`font-black tracking-wider uppercase ${titleSize} ${isDark ? 'text-white' : 'text-slate-900'}`}>
        AQARFLOW
      </span>
    </div>
  );
};
