'use client';
import React from 'react';

interface BlackSentinelLogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

export function BlackSentinelLogo({
  size = 48,
  showText = true,
  variant = 'full',
  className = '',
}: BlackSentinelLogoProps) {
  const iconSize = size;
  const textSize = size * 0.25;

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle gradient */}
          <defs>
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B00" />
              <stop offset="50%" stopColor="#333333" />
              <stop offset="100%" stopColor="#FF6B00" />
            </linearGradient>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#CC4D00" />
            </linearGradient>
            <linearGradient id="darkSide" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1A1A1A" />
              <stop offset="100%" stopColor="#333333" />
            </linearGradient>
          </defs>
          
          {/* Outer ring */}
          <circle cx="100" cy="100" r="95" stroke="url(#circleGradient)" strokeWidth="4" fill="none" />
          
          {/* Shield base - dark side */}
          <path
            d="M100 30 L145 55 L145 110 C145 140 125 160 100 170 C75 160 55 140 55 110 L55 55 Z"
            fill="url(#darkSide)"
            stroke="#333333"
            strokeWidth="2"
          />
          
          {/* Shield - orange side */}
          <path
            d="M100 30 L145 55 L145 110 C145 140 125 160 100 170 L100 30 Z"
            fill="url(#shieldGradient)"
          />
          
          {/* Helmet visor - dark side */}
          <path
            d="M65 85 L95 75 L95 120 L70 130 L60 110 Z"
            fill="#0A0A0A"
          />
          
          {/* Helmet visor - orange side */}
          <path
            d="M135 85 L105 75 L105 120 L130 130 L140 110 Z"
            fill="#FF6B00"
          />
          
          {/* Eye slit - left (white) */}
          <path
            d="M70 95 L90 88 L90 100 L70 107 Z"
            fill="#FFFFFF"
          />
          
          {/* Eye slit - right (dark) */}
          <path
            d="M130 95 L110 88 L110 100 L130 107 Z"
            fill="#0A0A0A"
          />
          
          {/* Center line */}
          <line x1="100" y1="30" x2="100" y2="170" stroke="#0A0A0A" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <span
          style={{ fontSize: textSize }}
          className="font-display font-bold tracking-tight"
        >
          <span className="text-white">BLACK</span>
          <span className="text-bsn-orange">SENTINEL</span>
        </span>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="circleGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="50%" stopColor="#333333" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
          <linearGradient id="shieldGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#CC4D00" />
          </linearGradient>
          <linearGradient id="darkSideFull" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1A1A1A" />
            <stop offset="100%" stopColor="#333333" />
          </linearGradient>
        </defs>
        
        <circle cx="100" cy="100" r="95" stroke="url(#circleGradientFull)" strokeWidth="4" fill="none" />
        <path
          d="M100 30 L145 55 L145 110 C145 140 125 160 100 170 C75 160 55 140 55 110 L55 55 Z"
          fill="url(#darkSideFull)"
          stroke="#333333"
          strokeWidth="2"
        />
        <path
          d="M100 30 L145 55 L145 110 C145 140 125 160 100 170 L100 30 Z"
          fill="url(#shieldGradientFull)"
        />
        <path
          d="M65 85 L95 75 L95 120 L70 130 L60 110 Z"
          fill="#0A0A0A"
        />
        <path
          d="M135 85 L105 75 L105 120 L130 130 L140 110 Z"
          fill="#FF6B00"
        />
        <path
          d="M70 95 L90 88 L90 100 L70 107 Z"
          fill="#FFFFFF"
        />
        <path
          d="M130 95 L110 88 L110 100 L130 107 Z"
          fill="#0A0A0A"
        />
        <line x1="100" y1="30" x2="100" y2="170" stroke="#0A0A0A" strokeWidth="2" />
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span
            style={{ fontSize: textSize * 1.2 }}
            className="font-display font-bold tracking-tight leading-none"
          >
            <span className="text-white">BLACK</span>
            <span className="text-bsn-orange">SENTINEL</span>
          </span>
          <span
            style={{ fontSize: textSize * 0.6 }}
            className="font-display font-medium tracking-[0.3em] text-gray-500 leading-none mt-1"
          >
            NEXUS
          </span>
        </div>
      )}
    </div>
  );
}
