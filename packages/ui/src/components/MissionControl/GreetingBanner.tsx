'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface GreetingBannerProps {
  userName: string;
  securityScore: number;
  breachStatus: 'clear' | 'active' | 'investigating';
  className?: string;
}

export function GreetingBanner({
  userName,
  securityScore,
  breachStatus,
  className,
}: GreetingBannerProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getStatusMessage = () => {
    switch (breachStatus) {
      case 'clear':
        return 'No se detectan brechas activas.';
      case 'active':
        return 'Brecha activa detectada.';
      case 'investigating':
        return 'Investigación en curso.';
    }
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="space-y-3">
        <motion.h1
          className="text-4xl font-display font-bold text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {getGreeting()}, {userName}.
        </motion.h1>
        <motion.p
          className="text-lg font-medium text-bsn-orange"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {getStatusMessage()}
        </motion.p>
      </div>

      <motion.div
        className="flex items-center gap-4 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Estado general de seguridad:</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg width="32" height="32" className="transform -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  fill="none"
                  stroke="rgba(255, 107, 0, 0.1)"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="16"
                  cy="16"
                  r="12"
                  fill="none"
                  stroke="#FF6B00"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 12}
                  initial={{ strokeDashoffset: 2 * Math.PI * 12 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 12 * (1 - securityScore / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{securityScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
