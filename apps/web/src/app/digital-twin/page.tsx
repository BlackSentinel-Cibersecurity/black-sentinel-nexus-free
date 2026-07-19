'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, RefreshCw } from 'lucide-react';
import dynamic from 'next/dynamic';
import { GlassPanel } from '@bsn/ui';
import { PageLoader } from '@/components/PageLoader';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api';
import { useI18n } from '@/lib/i18n';

interface TwinNode {
  id: string;
  type: string;
  label: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | 'minimal';
  x: number;
  y: number;
  z: number;
}

interface TwinEdge {
  source: string;
  target: string;
  status: 'active' | 'compromised';
}

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

export default function DigitalTwinPage() {
  const [mounted, setMounted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [nodes, setNodes] = useState<TwinNode[]>([]);
  const [edges, setEdges] = useState<TwinEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const fetchGraph = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.digitalTwin.graph();
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    } catch {
      setNodes([]);
      setEdges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { setMounted(true); fetchGraph(); }, [fetchGraph]);

  const handleSync = useCallback(async () => {
    setSyncing(true);
    await fetchGraph();
    setTimeout(() => setSyncing(false), 1000);
  }, [fetchGraph]);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const healthyCount = nodes.filter(n => n.status === 'healthy').length;
  const warningCount = nodes.filter(n => n.status === 'warning').length;
  const criticalCount = nodes.filter(n => n.status === 'critical').length;

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
            {loading ? (
              <DigitalTwinLoader />
            ) : (
              <DigitalTwin nodes={nodes} edges={edges} className="h-[600px]" />
            )}
          </motion.div>

          <motion.div className="grid grid-cols-4 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <GlassPanel padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#FF6B00]">{healthyCount}</span>
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
                  <span className="text-lg font-bold text-[#FF6B00]/80">{warningCount}</span>
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
                  <span className="text-lg font-bold text-[#FF6B00]">{criticalCount}</span>
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
                  <span className="text-lg font-bold text-gray-400">{nodes.length}</span>
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
