'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

export function GlassPanel({
  children,
  className,
  hover = true,
  glow = false,
  padding = 'md',
  onClick,
}: GlassPanelProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  return (
    <motion.div
      className={cn(
        'glass-panel relative overflow-hidden',
        hover && 'card-hover',
        glow && 'glow-border',
        paddingClasses[padding],
        onClick && 'cursor-pointer',
        className
      )}
      whileHover={hover ? { scale: 1.005 } : undefined}
      whileTap={onClick ? { scale: 0.995 } : undefined}
      onClick={onClick}
    >
      {/* Orange glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-bsn-orange/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {children}
    </motion.div>
  );
}
