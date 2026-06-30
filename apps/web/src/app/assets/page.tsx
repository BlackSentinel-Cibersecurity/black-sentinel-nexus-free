'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Shield, Wifi, Cloud, Monitor, RefreshCw } from 'lucide-react';
import { GlassPanel, RiskScore, StatusIndicator, cn } from '@bsn/ui';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api';
import { PageLoader } from '@/components/PageLoader';
import { useI18n } from '@/lib/i18n';

const typeIcons: Record<string, React.ReactNode> = {
  server: <Server size={20} className="text-bsn-orange" />, database: <Database size={20} className="text-bsn-orange" />,
  firewall: <Shield size={20} className="text-bsn-orange" />, endpoint: <Monitor size={20} className="text-bsn-orange" />,
  cloud: <Cloud size={20} className="text-bsn-orange" />, network: <Wifi size={20} className="text-bsn-orange" />,
};

export default function AssetsPage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.assets.list();
      setAssets(data.data || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { setMounted(true); fetchData(); }, []);
  if (!mounted) return <PageLoader />;

  const filtered = filter === 'all' ? assets : assets.filter(a => a.type === filter);

  return (
    <div className="flex h-screen bg-bsn-bg-primary">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6 space-y-6">
          <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div><h1 className="text-2xl font-display font-bold text-white">{t('assets.title')}</h1><p className="text-sm text-gray-500 mt-1">{t('assets.subtitle')}</p></div>
            <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
          </motion.div>
          <div className="flex items-center gap-4">
            {['all', 'server', 'database', 'firewall', 'endpoint', 'cloud'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filter === f ? 'bg-bsn-orange/20 text-bsn-orange' : 'bg-white/5 text-gray-500 hover:text-white')}>
                {f === 'all' ? t('assets.all') : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {filtered.map((asset, i) => (
                <motion.div key={asset.id} className={cn('glass-panel p-4 cursor-pointer hover:border-white/10 transition-all', selected?.id === asset.id && 'border-bsn-orange/50')}
                  onClick={() => setSelected(asset)} whileHover={{ scale: 1.01, x: 4 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.03 }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">{typeIcons[asset.type] || <Server size={20} className="text-bsn-orange" />}</div>
                      <div><p className="text-sm font-medium text-white">{asset.name}</p><p className="text-xs text-gray-600 font-mono">{asset.ip || t('common.na')}</p></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusIndicator status={asset.status === 'active' ? 'active' : asset.status === 'warning' ? 'warning' : asset.status === 'critical' ? 'critical' : 'offline'} size="sm" />
                      <RiskScore score={asset.riskScore} level={asset.riskLevel} size="sm" showLabel={false} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="lg:col-span-1">
              {selected ? (
                <GlassPanel className="sticky top-6" padding="lg">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">{selected.name}</h3>
                    {[[t('assets.detail.ip'), selected.ip], [t('assets.detail.type'), selected.type], [t('assets.detail.os'), selected.os], [t('assets.detail.location'), selected.location], [t('assets.detail.risk'), `${selected.riskScore}/100`]].map(([l, v]) => (
                      <div key={l} className="flex justify-between text-sm"><span className="text-gray-500">{l}</span><span className="text-white">{v || t('common.na')}</span></div>
                    ))}
                  </div>
                </GlassPanel>
              ) : (
                <GlassPanel className="sticky top-6" padding="lg"><div className="text-center py-12"><Server size={48} className="mx-auto text-gray-600 mb-4" /><p className="text-sm text-gray-500">{t('assets.selectOne')}</p></div></GlassPanel>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
