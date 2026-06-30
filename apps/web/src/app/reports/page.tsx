'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Filter,
  BarChart3, PieChart, TrendingUp, Plus, Loader2
} from 'lucide-react';
import { PageLoader } from '@/components/PageLoader';
import { GlassPanel, cn } from '@bsn/ui';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api';
import { useI18n } from '@/lib/i18n';

interface Report {
  id: string;
  title: string;
  type: string;
  generatedAt: string;
  status: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
}

export default function ReportsPage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const typeLabels: Record<string, string> = {
    executive: t('reports.types.executive'),
    technical: t('reports.types.technical'),
    compliance: t('reports.types.compliance'),
    incident: t('reports.types.incidents'),
    audit: t('reports.types.audit'),
    vulnerability: t('reports.types.vulnerabilities'),
  };

  const typeIcons: Record<string, React.ReactNode> = {
    executive: <BarChart3 size={20} className="text-[#FF6B00]" />,
    technical: <PieChart size={20} className="text-[#FF6B00]" />,
    compliance: <FileText size={20} className="text-[#FF6B00]" />,
    incident: <TrendingUp size={20} className="text-[#FF6B00]" />,
    audit: <FileText size={20} className="text-[#FF6B00]" />,
    vulnerability: <FileText size={20} className="text-[#FF6B00]" />,
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsData, templatesData] = await Promise.all([
        api.reports.list().catch(() => []),
        api.reports.templates().catch(() => []),
      ]);
      setReports(reportsData || []);
      setTemplates(templatesData || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  if (!mounted) return <PageLoader />;

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.type === filter);

  const handleDownloadPdf = async (type: string) => {
    try {
      setGenerating(type);
      const blob = await api.reports.generatePdf(type);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${typeLabels[type] || type}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setPdfError(t('reports.error.pdf'));
      setTimeout(() => setPdfError(''), 5000);
    } finally {
      setGenerating(null);
    }
  };

  const handleGenerateReport = async (type: string) => {
    try {
      setGenerating(type);
      await api.reports.generate(type);
      await fetchData();
      setShowGenerate(false);
    } catch {
    } finally {
      setGenerating(null);
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
              <h1 className="text-2xl font-display font-bold text-white">{t('reports.title')}</h1>
              <p className="text-sm text-gray-500 mt-1">{t('reports.subtitle')}</p>
            </div>
            <div className="flex items-center gap-3">
              {pdfError && (
                <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{pdfError}</div>
              )}
              <button onClick={() => setShowGenerate(!showGenerate)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B00] text-white hover:bg-[#FF6B00]/90 transition-colors">
                <Plus size={16} /><span className="text-sm">{t('reports.generate')}</span>
              </button>
            </div>
          </motion.div>

          {showGenerate && (
            <GlassPanel padding="lg">
              <h3 className="text-sm font-semibold text-white mb-3">{t('reports.selectType')}</h3>
              <div className="grid grid-cols-3 gap-3">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleGenerateReport(tmpl.id)}
                    disabled={generating === tmpl.id}
                    className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-[#FF6B00]/50 text-left transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {typeIcons[tmpl.id] || <FileText size={16} className="text-[#FF6B00]" />}
                      <span className="text-sm font-medium text-white">{tmpl.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">{tmpl.description}</p>
                  </button>
                ))}
              </div>
            </GlassPanel>
          )}

          <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm text-gray-500">{t('reports.type')}</span>
            </div>
            {['all', 'executive', 'technical', 'compliance', 'incident'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filter === f ? 'bg-[#FF6B00]/20 text-[#FF6B00]' : 'bg-white/5 text-gray-500 hover:text-white')}>
                {f === 'all' ? t('reports.all') : typeLabels[f]}
              </button>
            ))}
          </motion.div>

          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="text-[#FF6B00] animate-spin" />
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-700 mb-4" />
                <p className="text-sm text-gray-500">{t('reports.empty')}</p>
                <p className="text-xs text-gray-600 mt-1">{t('reports.emptyDesc')}</p>
              </div>
            ) : (
              filteredReports.map((report, i) => (
                <motion.div key={report.id} className="glass-panel p-4 hover:border-white/10 transition-all duration-200" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                        {typeIcons[report.type] || <FileText size={20} className="text-[#FF6B00]" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{report.title}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-[#FF6B00]/10 text-[#FF6B00]">{typeLabels[report.type] || report.type}</span>
                          <span className="text-xs text-gray-600">{new Date(report.generatedAt).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDownloadPdf(report.type)}
                        disabled={generating === report.type}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10 transition-colors disabled:opacity-50"
                      >
                        {generating === report.type ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}
                        {t('reports.downloadPdf')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
