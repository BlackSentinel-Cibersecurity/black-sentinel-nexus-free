'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Play, Plus, Trash2, X, GripVertical, ChevronDown, ChevronUp, Clock, Loader2, RefreshCw } from 'lucide-react';
import { PageLoader } from '@/components/PageLoader';
import { GlassPanel, cn } from '@bsn/ui';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api';
import { useI18n } from '@/lib/i18n';

const emptyStep = { id: '', name: '', type: 'action' as const, config: {}, order: 0 };

interface FormData {
  name: string;
  description: string;
  trigger: string;
  status: string;
  steps: Array<{ id: string; name: string; type: string; config: Record<string, any>; order: number }>;
}

export default function PlaybooksPage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [playbooks, setPlaybooks] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [executing, setExecuting] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<FormData>({
    name: '', description: '', trigger: 'manual', status: 'draft', steps: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const stepTypes = [
    { value: 'action', label: t('playbooks.types.action'), color: 'text-[#FF6B00]' },
    { value: 'condition', label: t('playbooks.types.condition'), color: 'text-gray-400' },
    { value: 'notification', label: t('playbooks.types.notification'), color: 'text-[#FF6B00]/70' },
    { value: 'integration', label: t('playbooks.types.integration'), color: 'text-green-400' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [playbooksData, statsData] = await Promise.all([
        api.playbooks.list(),
        api.playbooks.stats().catch(() => null),
      ]);
      setPlaybooks(playbooksData || []);
      setStats(statsData);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { setMounted(true); fetchData(); }, []);
  if (!mounted) return <PageLoader />;

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', trigger: 'manual', status: 'draft', steps: [{ ...emptyStep, id: crypto.randomUUID().slice(0, 8) }] });
    setError('');
    setShowModal(true);
  };

  const openEdit = (playbook: any) => {
    setEditing(playbook);
    setForm({
      name: playbook.name,
      description: playbook.description || '',
      trigger: playbook.trigger || 'manual',
      status: playbook.status,
      steps: (playbook.steps || []).map((s: any) => ({ ...s, id: s.id || crypto.randomUUID().slice(0, 8) })),
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError(t('playbooks.error.nameRequired')); return; }
    if (form.steps.length === 0) { setError(t('playbooks.error.stepsRequired')); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        steps: form.steps.map((s, i) => ({ ...s, order: i + 1 })),
      };
      if (editing) {
        await api.playbooks.update(editing.id, payload);
      } else {
        await api.playbooks.create(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || t('playbooks.error.save'));
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('playbooks.delete.confirm'))) return;
    try { await api.playbooks.delete(id); setSelected(null); fetchData(); } catch { }
  };

  const handleExecute = async (id: string) => {
    try {
      setExecuting(id);
      await api.playbooks.execute(id);
      fetchData();
    } catch { } finally { setExecuting(null); }
  };

  const addStep = () => {
    setForm(f => ({
      ...f,
      steps: [...f.steps, { ...emptyStep, id: crypto.randomUUID().slice(0, 8), order: f.steps.length + 1 }],
    }));
  };

  const updateStep = (index: number, field: string, value: any) => {
    setForm(f => ({
      ...f,
      steps: f.steps.map((s, i) => i === index ? { ...s, [field]: value } : s),
    }));
  };

  const removeStep = (index: number) => {
    setForm(f => ({ ...f, steps: f.steps.filter((_, i) => i !== index) }));
  };

  const moveStep = (index: number, dir: number) => {
    setForm(f => {
      const newSteps = [...f.steps];
      const target = index + dir;
      if (target < 0 || target >= newSteps.length) return f;
      [newSteps[index], newSteps[target]] = [newSteps[target], newSteps[index]];
      return { ...f, steps: newSteps.map((s, i) => ({ ...s, order: i + 1 })) };
    });
  };

  return (
    <div className="flex h-screen bg-[#050505]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6 space-y-6">
          {/* Header */}
          <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <h1 className="text-2xl font-bold text-white">{t('playbooks.title')}</h1>
              <p className="text-sm text-gray-500 mt-1">{t('playbooks.subtitle')}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B00] text-white text-sm font-medium hover:bg-[#FF6B00]/90 transition-colors">
                <Plus size={16} /> {t('playbooks.new')}
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: t('playbooks.stats.total'), value: stats.total, icon: <Zap size={18} className="text-[#FF6B00]" /> },
                { label: t('playbooks.stats.active'), value: stats.active, icon: <Play size={18} className="text-green-400" /> },
                { label: t('playbooks.stats.executions'), value: stats.totalRuns, icon: <Clock size={18} className="text-[#FF6B00]/70" /> },
              ].map((s, i) => (
                <GlassPanel key={s.label} padding="sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">{s.icon}</div>
                    <div>
                      <p className="text-xs text-gray-500">{s.label}</p>
                      <p className="text-lg font-bold text-white">{s.value}</p>
                    </div>
                  </div>
                </GlassPanel>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {playbooks.length === 0 && !loading && (
                <GlassPanel padding="lg">
                  <div className="text-center py-8">
                    <Zap size={40} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-sm text-gray-500">{t('playbooks.empty')}</p>
                    <button onClick={openCreate} className="mt-3 text-sm text-[#FF6B00] hover:underline">{t('playbooks.createOne')}</button>
                  </div>
                </GlassPanel>
              )}
              {playbooks.map((p, i) => (
                <motion.div key={p.id} className={cn(
                  'rounded-xl border p-4 cursor-pointer transition-all',
                  selected?.id === p.id ? 'border-[#FF6B00]/50 bg-[#FF6B00]/5' : 'border-white/5 bg-[#0D0D0D] hover:border-white/10'
                )}
                  onClick={() => setSelected(p)} whileHover={{ scale: 1.005, x: 4 }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.03 }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/10 flex items-center justify-center">
                        <Zap size={20} className="text-[#FF6B00]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{p.name}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{p.description || t('playbooks.noDescription')}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={cn('text-xs px-2 py-0.5 rounded-full', p.status === 'active' ? 'bg-green-500/20 text-green-400' : p.status === 'draft' ? 'bg-white/10 text-gray-400' : 'bg-gray-600/30 text-gray-400')}>
                            {p.status}
                          </span>
                          <span className="text-xs text-gray-600">{p.steps?.length || 0} {t('playbooks.steps')}</span>
                          <span className="text-xs text-gray-600">{p.runsCount || 0} {t('playbooks.executions')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-1">
              {selected ? (
                <GlassPanel className="sticky top-6" padding="lg">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">{selected.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{selected.description || t('playbooks.noDescription')}</p>
                      </div>
                      <button onClick={() => setSelected(null)} className="text-gray-600 hover:text-white"><X size={16} /></button>
                    </div>

                    <div className="flex gap-2">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', selected.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400')}>
                        {selected.status}
                      </span>
                      <span className="text-xs text-gray-600">{t('playbooks.triggerLabel')} {selected.trigger}</span>
                    </div>

                    {/* Steps */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{t('playbooks.stepsLabel')} ({selected.steps?.length || 0})</p>
                      <div className="space-y-2">
                        {selected.steps?.map((step: any, i: number) => (
                          <div key={step.id || i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                            <span className="text-xs text-gray-600 w-5 text-center">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{step.name}</p>
                              <p className={cn('text-xs', stepTypes.find(st => st.value === step.type)?.color || 'text-gray-500')}>
                                {stepTypes.find(st => st.value === step.type)?.label || step.type}
                              </p>
                            </div>
                          </div>
                        ))}
                        {(!selected.steps || selected.steps.length === 0) && (
                          <p className="text-xs text-gray-600 text-center py-2">{t('playbooks.noSteps')}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleExecute(selected.id)}
                        disabled={executing === selected.id}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#FF6B00] text-white text-sm font-medium hover:bg-[#FF6B00]/90 transition-colors disabled:opacity-50"
                      >
                        {executing === selected.id ? <><Loader2 size={14} className="animate-spin" /> {t('playbooks.running')}</> : <><Play size={14} /> {t('playbooks.executeNow')}</>}
                      </button>
                      <div className="flex gap-2">
                        <button onClick={() => { openEdit(selected); }} className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-gray-400 text-sm hover:text-white hover:bg-white/10 transition-colors">
                          {t('playbooks.edit')}
                        </button>
                        <button onClick={() => handleDelete(selected.id)} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              ) : (
                <GlassPanel className="sticky top-6" padding="lg">
                  <div className="text-center py-12">
                    <Zap size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-sm text-gray-500">{t('playbooks.selectOne')}</p>
                  </div>
                </GlassPanel>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setShowModal(false); setEditing(null); }}>
            <motion.div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0D0D0D] rounded-2xl border border-white/10 shadow-2xl"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}>

              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">{editing ? t('playbooks.form.editTitle') : t('playbooks.form.newTitle')}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-5">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1.5">{t('playbooks.form.name')}</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder={t('playbooks.form.namePlaceholder')}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF6B00] transition-colors" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1.5">{t('playbooks.form.description')}</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder={t('playbooks.form.descriptionPlaceholder')}
                      rows={2}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF6B00] transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">{t('playbooks.form.trigger')}</label>
                    <input value={form.trigger} onChange={e => setForm(f => ({ ...f, trigger: e.target.value }))}
                      placeholder={t('playbooks.form.triggerPlaceholder')}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF6B00] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">{t('playbooks.form.status')}</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF6B00] transition-colors">
                      <option value="draft">{t('playbooks.form.draft')}</option>
                      <option value="active">{t('playbooks.form.active')}</option>
                      <option value="inactive">{t('playbooks.form.inactive')}</option>
                    </select>
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs text-gray-500 uppercase tracking-wider">{t('playbooks.stepsLabel')} ({form.steps.length})</label>
                    <button onClick={addStep} className="flex items-center gap-1 text-xs text-[#FF6B00] hover:underline">
                      <Plus size={12} /> {t('playbooks.addStep')}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.steps.map((step, i) => (
                      <div key={step.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
                        <div className="flex items-center gap-2">
                          <GripVertical size={14} className="text-gray-600 cursor-move" />
                          <span className="text-xs text-gray-600 w-4 text-center">{i + 1}</span>
                          <input value={step.name} onChange={e => updateStep(i, 'name', e.target.value)}
                            placeholder={t('playbooks.form.stepNamePlaceholder')}
                            className="flex-1 px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#FF6B00]" />
                          <select value={step.type} onChange={e => updateStep(i, 'type', e.target.value)}
                            className="px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#FF6B00]">
                            {stepTypes.map(st => <option key={st.value} value={st.value}>{st.label}</option>)}
                          </select>
                          <button onClick={() => moveStep(i, -1)} disabled={i === 0} className="text-gray-600 hover:text-white disabled:opacity-30"><ChevronUp size={14} /></button>
                          <button onClick={() => moveStep(i, 1)} disabled={i === form.steps.length - 1} className="text-gray-600 hover:text-white disabled:opacity-30"><ChevronDown size={14} /></button>
                          <button onClick={() => removeStep(i)} className="text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                    {form.steps.length === 0 && (
                      <button onClick={addStep} className="w-full py-4 border border-dashed border-white/10 rounded-lg text-sm text-gray-600 hover:text-[#FF6B00] hover:border-[#FF6B00]/30 transition-colors">
                        + {t('playbooks.addFirstStep')}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-5 border-t border-white/5">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 text-sm hover:text-white transition-colors">{t('playbooks.form.cancel')}</button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg bg-[#FF6B00] text-white text-sm font-medium hover:bg-[#FF6B00]/90 transition-colors disabled:opacity-50">
                  {saving ? t('playbooks.form.saving') : editing ? t('playbooks.form.saveChanges') : t('playbooks.form.create')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
