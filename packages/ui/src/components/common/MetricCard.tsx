'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { GlassPanel } from './GlassPanel';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  className,
}: MetricCardProps) {
  const trendStyles = {
    up: 'text-bsn-orange',
    down: 'text-gray-400',
    stable: 'text-gray-500',
  };

  return (
    <GlassPanel className={cn('relative group', className)} hover>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <motion.p
            className="text-3xl font-display font-bold text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-sm text-gray-400">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={cn('flex items-center gap-1 text-xs', trendStyles[trend])}>
              <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-bsn-orange/10 text-bsn-orange">
            {icon}
          </div>
        )}
      </div>

      {/* Subtle orange gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-bsn-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />
    </GlassPanel>
  );
}
