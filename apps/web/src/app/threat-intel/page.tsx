'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, RefreshCw } from 'lucide-react';
import { GlassPanel, StatusIndicator, cn } from '@bsn/ui';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api';
import { PageLoader } from '@/components/PageLoader';
import { useI18n } from '@/lib/i18n';

export default function ThreatIntelPage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [threats, setThreats] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try { setLoading(true); const data = await api.threats.list(); setThreats(data.data || []); } catch { } finally { setLoading(false); }
  };

  useEffect(() => { setMounted(true); fetchData(); }, []);
  if (!mounted) return <PageLoader />;

  const filtered = filter === 'all' ? threats : threats.filter((threat) => threat.threatType === filter);

  return (
    <div className="flex h-screen bg-bsn-bg-primary">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6 space-y-6">
          <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div><h1 className="text-2xl font-display font-bold text-white">{t('threats.title')}</h1></div>
            <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
          </motion.div>
          <div className="flex items-center gap-4">
            {['all', 'ioc', 'apt', 'malware', 'vulnerability'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filter === f ? 'bg-bsn-orange/20 text-bsn-orange' : 'bg-white/5 text-gray-500 hover:text-white')}>
                {f === 'all' ? t('threats.all') : f.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {filtered.map((threat, i) => (
                <motion.div key={threat.id} className={cn('glass-panel p-4 cursor-pointer hover:border-white/10 transition-all', selected?.id === threat.id && 'border-bsn-orange/50')}
                  onClick={() => setSelected(threat)} whileHover={{ scale: 1.01, x: 4 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <StatusIndicator status={threat.severity === 'critical' ? 'critical' : threat.severity === 'high' ? 'warning' : 'active'} size="md" />
                      <div>
                        <p className="text-sm font-medium text-white">{threat.name || threat.value}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-bsn-orange/10 text-bsn-orange">{threat.threatType}</span>
                          <span className="text-xs text-gray-500">{t('threats.confidence')} {threat.confidence}%</span>
                          <span className="text-xs text-gray-600">{threat.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="lg:col-span-1">
              {selected ? (
                <GlassPanel className="sticky top-6" padding="lg">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">{selected.name || selected.value}</h3>
                    {[[t('threats.detail.type'), selected.threatType], [t('threats.detail.severity'), selected.severity], [t('threats.detail.confidence'), `${selected.confidence}%`], [t('threats.detail.source'), selected.source], [t('threats.detail.value'), selected.value]].map(([l, v]) => (
                      <div key={l} className="flex justify-between text-sm"><span className="text-gray-500">{l}</span><span className="text-white">{v || t('common.na')}</span></div>
                    ))}
                    {selected.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">{selected.tags.map((tag: string) => <span key={tag} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">#{tag}</span>)}</div>
                    )}
                  </div>
                </GlassPanel>
              ) : <GlassPanel className="sticky top-6" padding="lg"><div className="text-center py-12"><Shield size={48} className="mx-auto text-gray-600 mb-4" /><p className="text-sm text-gray-500">{t('threats.selectOne')}</p></div></GlassPanel>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
