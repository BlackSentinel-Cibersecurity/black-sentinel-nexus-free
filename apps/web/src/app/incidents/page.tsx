'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight, Filter, Plus, RefreshCw, X } from 'lucide-react';
import { GlassPanel, StatusIndicator, cn } from '@bsn/ui';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api';
import { useRealtime } from '@/lib/use-realtime';
import { PageLoader } from '@/components/PageLoader';
import { useI18n } from '@/lib/i18n';

export default function IncidentsPage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newIncident, setNewIncident] = useState({ title: '', severity: 'medium', source: 'manual', description: '' });
  const [statusError, setStatusError] = useState('');

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await api.incidents.list();
      setIncidents(data.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchIncidents();
  }, []);

  useRealtime('incidents', {
    'incident.new': (incident) => {
      setIncidents((prev: any[]) => [incident, ...prev]);
    },
    'incident.updated': (incident) => {
      setIncidents((prev: any[]) => prev.map((i: any) => i.id === incident.id ? incident : i));
      setSelectedIncident((prev: any) => prev?.id === incident.id ? incident : prev);
    },
  });

  if (!mounted) return <PageLoader />;

  const filtered = filter === 'all' ? incidents : incidents.filter(i => i.severity === filter);

  const severityColors: Record<string, string> = {
    critical: 'bg-bsn-orange-600', high: 'bg-bsn-orange', medium: 'bg-bsn-orange-400', low: 'bg-gray-500',
  };

  const statusColors: Record<string, string> = {
    new: 'text-bsn-orange', triaged: 'text-bsn-orange-400', investigating: 'text-bsn-orange',
    contained: 'text-gray-400', eradicated: 'text-gray-500', recovered: 'text-gray-400', closed: 'text-gray-600',
  };

  const handleCreate = async () => {
    try {
      await api.incidents.create(newIncident);
      setShowCreate(false);
      setNewIncident({ title: '', severity: 'medium', source: 'manual', description: '' });
      fetchIncidents();
    } catch {
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.incidents.updateStatus(id, status);
      fetchIncidents();
      if (selectedIncident?.id === id) {
        setSelectedIncident({ ...selectedIncident, status });
      }
    } catch (err: any) {
      setStatusError(err.message || t('incidents.error.update'));
      setTimeout(() => setStatusError(''), 5000);
    }
  };

  return (
    <div className="flex h-screen bg-bsn-bg-primary">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6 space-y-6">
          <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">{t('incidents.title')}</h1>
              <p className="text-sm text-gray-500 mt-1">{t('incidents.subtitle')}</p>
            </div>
            <div className="flex items-center gap-3">
              {statusError && (
                <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{statusError}</div>
              )}
              <button onClick={fetchIncidents} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors">
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bsn-orange text-white hover:bg-bsn-orange-400 transition-colors">
                <Plus size={16} /><span className="text-sm">{t('incidents.new')}</span>
              </button>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <Filter size={16} className="text-gray-500" />
            {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filter === f ? 'bg-bsn-orange/20 text-bsn-orange' : 'bg-white/5 text-gray-500 hover:text-white')}>
                {f === 'all' ? t('incidents.all') : f === 'critical' ? t('incidents.form.critical') : f === 'high' ? t('incidents.form.high') : f === 'medium' ? t('incidents.form.medium') : t('incidents.form.low')}
              </button>
            ))}
          </div>

          {showCreate && (
            <GlassPanel padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{t('incidents.new')}</h3>
                <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder={t('incidents.form.title')} value={newIncident.title} onChange={e => setNewIncident({ ...newIncident, title: e.target.value })} className="bg-white/5 border border-bsn-border-primary rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-bsn-orange/50" />
                <select value={newIncident.severity} onChange={e => setNewIncident({ ...newIncident, severity: e.target.value })} className="bg-white/5 border border-bsn-border-primary rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-bsn-orange/50">
                  <option value="critical">{t('incidents.form.critical')}</option><option value="high">{t('incidents.form.high')}</option><option value="medium">{t('incidents.form.medium')}</option><option value="low">{t('incidents.form.low')}</option>
                </select>
                <input placeholder={t('incidents.form.source')} value={newIncident.source} onChange={e => setNewIncident({ ...newIncident, source: e.target.value })} className="bg-white/5 border border-bsn-border-primary rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-bsn-orange/50" />
                <input placeholder={t('incidents.form.description')} value={newIncident.description} onChange={e => setNewIncident({ ...newIncident, description: e.target.value })} className="bg-white/5 border border-bsn-border-primary rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-bsn-orange/50" />
              </div>
              <button onClick={handleCreate} disabled={!newIncident.title} className="mt-4 px-4 py-2 rounded-lg bg-bsn-orange text-white text-sm hover:bg-bsn-orange-400 transition-colors disabled:opacity-50">{t('incidents.form.create')}</button>
            </GlassPanel>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {filtered.map((incident, i) => (
                <motion.div key={incident.id} className={cn('glass-panel p-4 cursor-pointer transition-all duration-200 hover:border-white/10', selectedIncident?.id === incident.id && 'border-bsn-orange/50')}
                  onClick={() => setSelectedIncident(incident)} whileHover={{ scale: 1.01, x: 4 }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn('w-2 h-2 rounded-full mt-2', severityColors[incident.severity])} />
                      <div>
                        <p className="text-sm font-medium text-white">{incident.title}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-600 font-mono">{incident.code}</span>
                          <span className="text-xs text-gray-500">{incident.source}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn('text-xs font-medium capitalize', statusColors[incident.status])}>{incident.status}</span>
                      <ChevronRight size={16} className="text-gray-600" />
                    </div>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && <p className="text-sm text-gray-600 text-center py-8">{t('incidents.empty')}</p>}
            </div>

            <div className="lg:col-span-1">
              {selectedIncident ? (
                <GlassPanel className="sticky top-6" padding="lg">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">{selectedIncident.title}</h3>
                    <p className="text-xs text-gray-600 font-mono">{selectedIncident.code}</p>
                    {[
                      [t('incidents.detail.severity'), selectedIncident.severity],
                      [t('incidents.detail.status'), selectedIncident.status],
                      [t('incidents.detail.source'), selectedIncident.source],
                      [t('incidents.detail.created'), new Date(selectedIncident.createdAt).toLocaleString('es-ES')],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-gray-500">{label}</span>
                        <span className="text-white capitalize">{value}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-white/5">
                      <p className="text-xs text-gray-500 mb-2">{t('incidents.detail.changeStatus')}</p>
                      <div className="flex flex-wrap gap-2">
                        {['triaged', 'investigating', 'contained', 'eradicated', 'recovered', 'closed'].map((s) => (
                          <button key={s} onClick={() => handleStatusChange(selectedIncident.id, s)}
                            className={cn('px-2 py-1 rounded text-xs transition-colors', selectedIncident.status === s ? 'bg-bsn-orange text-white' : 'bg-white/5 text-gray-500 hover:text-white')}>
                            {t(`incidents.status.${s}`)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              ) : (
                <GlassPanel className="sticky top-6" padding="lg">
                  <div className="text-center py-12">
                    <AlertTriangle size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-sm text-gray-500">{t('incidents.selectOne')}</p>
                  </div>
                </GlassPanel>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
