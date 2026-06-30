'use client';
import React from 'react';
import { cn } from '../../utils/cn';

interface StatusIndicatorProps {
  status: 'active' | 'warning' | 'critical' | 'offline';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  label?: string;
}

export function StatusIndicator({
  status,
  size = 'md',
  pulse = true,
  label,
}: StatusIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  // All statuses use orange with different intensities
  const statusStyles = {
    active: {
      bg: 'bg-bsn-orange',
      glow: 'shadow-[0_0_8px_rgba(255,107,0,0.6)]',
      pulse: 'bg-bsn-orange',
    },
    warning: {
      bg: 'bg-bsn-orange-400',
      glow: 'shadow-[0_0_8px_rgba(251,146,60,0.6)]',
      pulse: 'bg-bsn-orange-400',
    },
    critical: {
      bg: 'bg-bsn-orange-600',
      glow: 'shadow-[0_0_10px_rgba(229,90,0,0.8)]',
      pulse: 'bg-bsn-orange-600',
    },
    offline: {
      bg: 'bg-gray-600',
      glow: '',
      pulse: 'bg-gray-600',
    },
  };

  const styles = statusStyles[status];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className={cn(
            'rounded-full',
            sizeClasses[size],
            styles.bg,
            styles.glow
          )}
        />
        {pulse && status !== 'offline' && (
          <div
            className={cn(
              'absolute inset-0 rounded-full animate-ping',
              styles.pulse,
              'opacity-50'
            )}
          />
        )}
      </div>
      {label && (
        <span className="text-xs text-gray-500 capitalize">{label}</span>
      )}
    </div>
  );
}
