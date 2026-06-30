'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, Activity, Zap,
  Server, RefreshCw
} from 'lucide-react';
import { PageLoader } from '@/components/PageLoader';
import { GlassPanel, MetricCard, RiskScore, Copilot, StatusIndicator, cn } from '@bsn/ui';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api';
import { useDashboardRealtime } from '@/lib/use-realtime';
import { useI18n } from '@/lib/i18n';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventStats, incidentStats, eventData, assetStats] = await Promise.all([
        api.events.stats().catch(() => null),
        api.incidents.stats().catch(() => null),
        api.events.list({ limit: 10, sortBy: 'timestamp', sortOrder: 'DESC' }).catch(() => ({ data: [] })),
        api.assets.stats().catch(() => null),
      ]);
      setStats({ events: eventStats, incidents: incidentStats, assets: assetStats });
      setRecentEvents(eventData.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useDashboardRealtime({
    onEventNew: (event) => {
      setRecentEvents(prev => [event, ...prev].slice(0, 10));
      setStats((prev: any) => prev ? {
        ...prev,
        events: { ...prev.events, total: (prev.events?.total || 0) + 1, last24h: (prev.events?.last24h || 0) + 1 }
      } : prev);
    },
    onIncidentNew: () => {
      fetchData();
    },
    onIncidentUpdated: () => {
      fetchData();
    },
    onMetricsUpdate: (data) => {
      setStats((prev: any) => prev ? { ...prev, events: data.events, incidents: data.incidents } : prev);
    },
  });

  useEffect(() => {
    setMounted(true);
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <PageLoader />;

  const eventStats = stats?.events;
  const incidentStats = stats?.incidents;
  const securityScore = incidentStats?.open ? Math.max(20, 100 - (incidentStats.open * 5)) : 96;

  return (
    <div className="flex h-screen bg-bsn-bg-primary">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6 space-y-6">
          <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="space-y-2">
              <h1 className="text-4xl font-display font-bold text-white">
                {t('dashboard.greeting')}
              </h1>
              <p className="text-lg text-bsn-orange font-medium">
                {incidentStats?.open ? t('dashboard.incidentsOpen', { count: incidentStats.open }) : t('dashboard.noBreaches')}
              </p>
            </div>
            <button onClick={fetchData} className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </motion.div>

          <motion.div className="flex items-center gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{t('dashboard.securityStatus')}</span>
              <div className="relative">
                <svg width="32" height="32" className="transform -rotate-90">
                  <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255, 107, 0, 0.1)" strokeWidth="3" />
                  <motion.circle cx="16" cy="16" r="12" fill="none" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round"
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
          </motion.div>

          <motion.div className="grid grid-cols-2 lg:grid-cols-5 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <MetricCard title={t('dashboard.events24h')} value={eventStats?.last24h || 0} icon={<Activity size={20} />} />
            <MetricCard title={t('dashboard.openIncidents')} value={incidentStats?.open || 0} icon={<AlertTriangle size={20} />} trend="up" trendValue={t('dashboard.requiresAttention')} />
            <MetricCard title={t('dashboard.activeIncidents')} value={incidentStats?.active || 0} icon={<Shield size={20} />} />
            <MetricCard title={t('dashboard.totalEvents')} value={eventStats?.total || 0} icon={<Zap size={20} />} />
            <MetricCard title={t('dashboard.assets')} value={stats?.assets?.total || 0} icon={<Server size={20} />} />
          </motion.div>

          <div className="grid grid-cols-3 gap-6">
            <motion.div className="col-span-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <GlassPanel className="h-full" padding="lg">
                <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-4">{t('dashboard.severityAlerts')}</h3>
                <div className="space-y-3">
                  {['critical', 'high', 'medium', 'low'].map((sev) => {
                    const count = eventStats?.bySeverity?.[sev] || 0;
                    return (
                      <div key={sev} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusIndicator status={sev === 'critical' ? 'critical' : sev === 'high' ? 'warning' : 'active'} size="sm" pulse={false} />
                          <span className="text-sm text-gray-400 capitalize">{t(`dashboard.${sev}`)}</span>
                        </div>
                        <span className="text-sm font-medium text-white">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </GlassPanel>
            </motion.div>

            <motion.div className="col-span-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <GlassPanel className="h-full" padding="lg">
                <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-4">{t('dashboard.recentActivity')}</h3>
                <div className="space-y-3">
                  {recentEvents.slice(0, 6).map((event, i) => (
                    <motion.div key={event.id || i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.02] transition-colors"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.05 }}>
                      <StatusIndicator status={event.severity === 'critical' ? 'critical' : event.severity === 'high' ? 'warning' : 'active'} size="sm" pulse={false} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{event.message}</p>
                        <p className="text-xs text-gray-600">{event.source} • {new Date(event.timestamp).toLocaleTimeString('es-ES')}</p>
                      </div>
                    </motion.div>
                  ))}
                  {recentEvents.length === 0 && (
                    <p className="text-sm text-gray-600 text-center py-4">{t('dashboard.noRecentEvents')}</p>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        </div>
      </main>
      <Copilot />
    </div>
  );
}
