'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Zap, TrendingUp, Activity } from 'lucide-react';
import { MetricCard } from '../common/MetricCard';
import { cn } from '../../utils/cn';

interface SecurityMetricsProps {
  criticalIncidents: number;
  threatsNeutralized: number;
  riskPrediction: string;
  activeAlerts: number;
  assetsMonitored: number;
  className?: string;
}

export function SecurityMetrics({
  criticalIncidents,
  threatsNeutralized,
  riskPrediction,
  activeAlerts,
  assetsMonitored,
  className,
}: SecurityMetricsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={cn('grid grid-cols-2 lg:grid-cols-5 gap-4', className)}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <MetricCard
          title="Incidentes Críticos"
          value={criticalIncidents}
          icon={<AlertTriangle size={20} />}
          trend={criticalIncidents > 0 ? 'up' : 'stable'}
          trendValue={criticalIncidents > 0 ? 'Requiere atención' : 'Estable'}
        />
      </motion.div>

      <motion.div variants={item}>
        <MetricCard
          title="Amenazas Neutralizadas"
          value={threatsNeutralized}
          subtitle="Hoy"
          icon={<Shield size={20} />}
          trend="down"
          trendValue="-12% vs ayer"
        />
      </motion.div>

      <motion.div variants={item}>
        <MetricCard
          title="Predicción de Riesgo"
          value={riskPrediction}
          subtitle="Próximas 48h"
          icon={<TrendingUp size={20} />}
        />
      </motion.div>

      <motion.div variants={item}>
        <MetricCard
          title="Alertas Activas"
          value={activeAlerts}
          icon={<Activity size={20} />}
        />
      </motion.div>

      <motion.div variants={item}>
        <MetricCard
          title="Activos Monitoreados"
          value={assetsMonitored.toLocaleString()}
          icon={<Zap size={20} />}
        />
      </motion.div>
    </motion.div>
  );
}
