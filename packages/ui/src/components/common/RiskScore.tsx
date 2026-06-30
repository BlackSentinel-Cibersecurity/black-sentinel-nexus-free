'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface RiskScoreProps {
  score: number;
  level: 'critical' | 'high' | 'medium' | 'low' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function RiskScore({
  score,
  level,
  size = 'md',
  showLabel = true,
  className,
}: RiskScoreProps) {
  const sizeConfig = {
    sm: { ring: 48, stroke: 4, text: 'text-sm', radius: 20 },
    md: { ring: 72, stroke: 6, text: 'text-xl', radius: 30 },
    lg: { ring: 96, stroke: 8, text: 'text-3xl', radius: 40 },
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const progress = (score / 100) * circumference;

  // All levels use orange with different intensities
  const levelStyles = {
    critical: { stroke: '#FF6B00', glow: 'rgba(255, 107, 0, 0.4)', text: 'text-bsn-orange' },
    high: { stroke: '#FF8A30', glow: 'rgba(255, 138, 48, 0.3)', text: 'text-bsn-orange-400' },
    medium: { stroke: '#A33D00', glow: 'rgba(163, 61, 0, 0.3)', text: 'text-bsn-orange-700' },
    low: { stroke: '#737373', glow: 'rgba(115, 115, 115, 0.3)', text: 'text-gray-400' },
    minimal: { stroke: '#525252', glow: 'rgba(82, 82, 82, 0.3)', text: 'text-gray-500' },
  };

  const styles = levelStyles[level];

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className="relative" style={{ width: config.ring, height: config.ring }}>
        <svg
          width={config.ring}
          height={config.ring}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={config.radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={config.stroke}
          />
          {/* Progress circle */}
          <motion.circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={config.radius}
            fill="none"
            stroke={styles.stroke}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
            style={{
              filter: `drop-shadow(0 0 6px ${styles.glow})`,
            }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-display font-bold', config.text, styles.text)}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 capitalize">{level}</span>
      )}
    </div>
  );
}
