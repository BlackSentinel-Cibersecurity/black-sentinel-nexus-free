'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle, RefreshCw, Shield } from 'lucide-react';
import { GlassPanel } from '../common/GlassPanel';
import { cn } from '../../utils/cn';

interface Action {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  icon: 'alert' | 'refresh' | 'shield' | 'custom';
  onClick?: () => void;
}

interface RecommendedActionsProps {
  actions: Action[];
  className?: string;
}

export function RecommendedActions({ actions, className }: RecommendedActionsProps) {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'alert':
        return <AlertCircle size={16} />;
      case 'refresh':
        return <RefreshCw size={16} />;
      case 'shield':
        return <Shield size={16} />;
      default:
        return <ArrowRight size={16} />;
    }
  };

  // All priorities use orange with different intensities
  const priorityStyles = {
    critical: 'border-l-bsn-orange-600 text-bsn-orange-600',
    high: 'border-l-bsn-orange text-bsn-orange',
    medium: 'border-l-bsn-orange-400 text-bsn-orange-400',
    low: 'border-l-gray-500 text-gray-500',
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.6,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <GlassPanel className={cn('', className)} padding="lg">
      <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-4">
        Acciones Recomendadas
      </h3>
      <motion.div
        className="space-y-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {actions.map((action) => (
          <motion.div
            key={action.id}
            variants={item}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border-l-2 bg-white/[0.02] hover:bg-bsn-orange/5 cursor-pointer transition-all duration-200',
              priorityStyles[action.priority]
            )}
            whileHover={{ x: 4 }}
            onClick={action.onClick}
          >
            <div className={cn('flex-shrink-0', priorityStyles[action.priority].split(' ')[1])}>
              {getIcon(action.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{action.title}</p>
              <p className="text-xs text-gray-500 truncate">{action.description}</p>
            </div>
            <ArrowRight size={14} className="text-gray-600 flex-shrink-0" />
          </motion.div>
        ))}
      </motion.div>
    </GlassPanel>
  );
}
