'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Clock, Shield, AlertTriangle } from 'lucide-react';
import { GlassPanel } from '../common/GlassPanel';
import { StatusIndicator } from '../common/StatusIndicator';
import { cn } from '../../utils/cn';

interface TimelinePhase {
  id: string;
  name: string;
  timestamp: Date;
  duration: string;
  description: string;
  aiExplanation: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  mitreTechnique?: string;
  details: {
    source?: string;
    target?: string;
    technique?: string;
    indicators?: string[];
  };
}

interface IncidentTimelineProps {
  incidentId: string;
  title: string;
  phases: TimelinePhase[];
  className?: string;
}

export function IncidentTimeline({
  incidentId,
  title,
  phases,
  className,
}: IncidentTimelineProps) {
  const [activePhase, setActivePhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);

  // All severities use orange with different intensities
  const severityColors = {
    critical: 'bg-bsn-orange-600',
    high: 'bg-bsn-orange',
    medium: 'bg-bsn-orange-400',
    low: 'bg-gray-500',
    info: 'bg-gray-600',
  };

  const severityGlows = {
    critical: 'shadow-[0_0_12px_rgba(229,90,0,0.5)]',
    high: 'shadow-[0_0_12px_rgba(255,107,0,0.5)]',
    medium: 'shadow-[0_0_12px_rgba(251,146,60,0.5)]',
    low: 'shadow-[0_0_12px_rgba(115,115,115,0.3)]',
    info: '',
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (activePhase < phases.length - 1) {
      setActivePhase(activePhase + 1);
    }
  };

  const handlePrev = () => {
    if (activePhase > 0) {
      setActivePhase(activePhase - 1);
    }
  };

  React.useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      if (activePhase < phases.length - 1) {
        setActivePhase((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 3000 / playSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, activePhase, phases.length, playSpeed]);

  return (
    <GlassPanel className={cn('', className)} padding="lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-display font-semibold text-white">{title}</h3>
          <p className="text-xs text-gray-500">Incidente {incidentId}</p>
        </div>
        
        {/* Playback controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaySpeed(playSpeed === 1 ? 2 : playSpeed === 2 ? 4 : 1)}
            className="px-2 py-1 text-xs text-gray-500 bg-white/5 rounded hover:bg-white/10 transition-colors"
          >
            {playSpeed}x
          </button>
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={handlePrev}
              disabled={activePhase === 0}
              className="p-1.5 rounded hover:bg-white/10 transition-colors disabled:opacity-30"
            >
              <SkipBack size={14} className="text-white" />
            </button>
            <button
              onClick={handlePlay}
              className="p-1.5 rounded bg-bsn-orange hover:bg-bsn-orange-400 transition-colors"
            >
              {isPlaying ? (
                <Pause size={14} className="text-white" />
              ) : (
                <Play size={14} className="text-white" />
              )}
            </button>
            <button
              onClick={handleNext}
              disabled={activePhase === phases.length - 1}
              className="p-1.5 rounded hover:bg-white/10 transition-colors disabled:opacity-30"
            >
              <SkipForward size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Progress bar */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-bsn-orange to-bsn-orange-400"
            initial={{ width: '0%' }}
            animate={{ width: `${((activePhase + 1) / phases.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Phase nodes */}
        <div className="flex justify-between relative">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setActivePhase(index)}
              whileHover={{ scale: 1.05 }}
            >
              {/* Node */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300',
                  index <= activePhase
                    ? cn(severityColors[phase.severity], severityGlows[phase.severity])
                    : 'bg-white/10'
                )}
              >
                {index < activePhase ? (
                  <Shield size={16} className="text-white" />
                ) : index === activePhase ? (
                  <motion.div
                    className="w-3 h-3 rounded-full bg-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                ) : (
                  <span className="text-xs text-gray-600">{index + 1}</span>
                )}
              </div>
              
              {/* Label */}
              <div className="mt-3 text-center">
                <p className={cn(
                  'text-xs font-medium',
                  index <= activePhase ? 'text-white' : 'text-gray-600'
                )}>
                  {phase.name}
                </p>
                <p className="text-[10px] text-gray-600 mt-1">
                  {phase.timestamp.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Active phase detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePhase}
          className="mt-8 grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* Phase info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <StatusIndicator
                status={phases[activePhase].severity === 'critical' ? 'critical' : 
                        phases[activePhase].severity === 'high' ? 'warning' : 'active'}
                size="md"
              />
              <h4 className="text-sm font-semibold text-white">
                Fase {activePhase + 1}: {phases[activePhase].name}
              </h4>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed">
              {phases[activePhase].description}
            </p>

            <div className="space-y-2">
              {phases[activePhase].details.source && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">Origen:</span>
                  <span className="text-bsn-orange font-mono">{phases[activePhase].details.source}</span>
                </div>
              )}
              {phases[activePhase].details.target && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">Destino:</span>
                  <span className="text-bsn-orange-600 font-mono">{phases[activePhase].details.target}</span>
                </div>
              )}
              {phases[activePhase].mitreTechnique && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">MITRE:</span>
                  <span className="text-bsn-orange-400 font-mono">{phases[activePhase].mitreTechnique}</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Explanation */}
          <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-gradient-brand flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">AI</span>
              </div>
              <span className="text-xs font-medium text-gray-500">Explicación IA</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {phases[activePhase].aiExplanation}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </GlassPanel>
  );
}
