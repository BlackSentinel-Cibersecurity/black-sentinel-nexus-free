'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, RefreshCw } from 'lucide-react';
import dynamic from 'next/dynamic';
import { GlassPanel } from '@bsn/ui';
import { PageLoader } from '@/components/PageLoader';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useI18n } from '@/lib/i18n';

function DigitalTwinLoader() {
  const { t } = useI18n();
  return (
    <div className="h-[600px] flex items-center justify-center bg-[#0D0D0D] rounded-xl border border-white/5">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">{t('digitalTwin.loading')}</p>
      </div>
    </div>
  );
}

const DigitalTwin = dynamic(
  () => import('@bsn/ui/three').then(m => ({ default: m.DigitalTwin })),
  {
    ssr: false,
    loading: () => <DigitalTwinLoader />,
  }
);

const demoNodes = [
  { id: '1', type: 'Firewall', label: 'FW-NORTH', status: 'healthy' as const, riskLevel: 'low' as const, x: -3, y: 1, z: 0 },
  { id: '2', type: 'Server', label: 'WEB-PROD-01', status: 'critical' as const, riskLevel: 'critical' as const, x: 0, y: 2, z: -1 },
  { id: '3', type: 'Database', label: 'DB-PRIMARY', status: 'warning' as const, riskLevel: 'high' as const, x: 2, y: 1, z: 1 },
  { id: '4', type: 'Server', label: 'API-GW-01', status: 'healthy' as const, riskLevel: 'medium' as const, x: -1, y: 0, z: 2 },
  { id: '5', type: 'Cloud', label: 'Azure-VNet', status: 'healthy' as const, riskLevel: 'low' as const, x: 3, y: 0, z: -2 },
  { id: '6', type: 'Endpoint', label: 'WS-FINANCE-01', status: 'warning' as const, riskLevel: 'medium' as const, x: -2, y: -1, z: -2 },
  { id: '7', type: 'Container', label: 'K8S-Cluster', status: 'healthy' as const, riskLevel: 'low' as const, x: 1, y: -1, z: 0 },
  { id: '8', type: 'Server', label: 'AD-DC-01', status: 'healthy' as const, riskLevel: 'high' as const, x: 0, y: 3, z: 1 },
];

const demoEdges = [
  { source: '1', target: '2', status: 'active' as const },
  { source: '1', target: '4', status: 'active' as const },
  { source: '2', target: '3', status: 'active' as const },
  { source: '4', target: '3', status: 'active' as const },
  { source: '4', target: '5', status: 'active' as const },
  { source: '6', target: '2', status: 'compromised' as const },
  { source: '7', target: '3', status: 'active' as const },
  { source: '8', target: '2', status: 'active' as const },
];

export default function DigitalTwinPage() {
  const [mounted, setMounted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => { setMounted(true); }, []);

  const handleSync = useCallback(() => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  if (!mounted) return <PageLoader />;

  return (
    <div className="flex h-screen bg-bsn-bg-primary" ref={containerRef}>
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6 space-y-6">
          <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">{t('digitalTwin.title')}</h1>
              <p className="text-sm text-gray-500 mt-1">{t('digitalTwin.subtitle')}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleSync} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors">
                <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
                <span className="text-sm">{t('digitalTwin.sync')}</span>
              </button>
              <button onClick={handleFullscreen} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors">
                <Maximize2 size={16} />
                <span className="text-sm">{t('digitalTwin.fullscreen')}</span>
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <DigitalTwin nodes={demoNodes} edges={demoEdges} className="h-[600px]" />
          </motion.div>

          <motion.div className="grid grid-cols-4 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <GlassPanel padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#FF6B00]">6</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('digitalTwin.healthy')}</p>
                  <p className="text-sm font-medium text-white">{t('digitalTwin.operationalNodes')}</p>
                </div>
              </div>
            </GlassPanel>
            <GlassPanel padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/15 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#FF6B00]/80">2</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('digitalTwin.warning')}</p>
                  <p className="text-sm font-medium text-white">{t('digitalTwin.requiresAttention')}</p>
                </div>
              </div>
            </GlassPanel>
            <GlassPanel padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/25 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#FF6B00]">1</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('digitalTwin.criticalNodes')}</p>
                  <p className="text-sm font-medium text-white">{t('digitalTwin.highRisk')}</p>
                </div>
              </div>
            </GlassPanel>
            <GlassPanel padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-600/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-400">8</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('digitalTwin.totalNodes')}</p>
                  <p className="text-sm font-medium text-white">{t('digitalTwin.infrastructure')}</p>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
