'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Shield, Bell, Key, Save, Plus, Trash2, X, Loader2, Pencil, Users, Plug, Power, PowerOff, RefreshCw, ChevronDown
} from 'lucide-react';
import { PageLoader } from '@/components/PageLoader';
import { GlassPanel, cn } from '@bsn/ui';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api';
import { useI18n, LOCALES } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';

const settingsSections = [
  { id: 'general', iconKey: 'settings.general' },
  { id: 'integrations', iconKey: 'settings.integrations' },
  { id: 'security', iconKey: 'settings.security' },
  { id: 'notifications', iconKey: 'settings.notifications' },
  { id: 'users', iconKey: 'settings.users' },
];

const timezones = [
  'America/New_York', 'America/Mexico_City', 'America/Bogota', 'America/Lima',
  'Europe/Madrid', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai',
];

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Settings state
  const [orgName, setOrgName] = useState('BlackSentinel Security');
  const [timezone, setTimezone] = useState('America/New_York');
  const [notifSettings, setNotifSettings] = useState({ criticalIncidents: true, weeklyReports: true, threatAlerts: false });
  const [secSettings, setSecSettings] = useState({ mfaEnabled: false, sessionTimeout: 30, ipWhitelist: [] as string[] });

  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'analyst' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ userId: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetForm, setResetForm] = useState({ userId: '', newPassword: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // Integrations state
  const [connectors, setConnectors] = useState<any[]>([]);
  const [connectorTemplates, setConnectorTemplates] = useState<Record<string, any[]>>({});
  const [connectorsLoading, setConnectorsLoading] = useState(false);
  const [showConnectorModal, setShowConnectorModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [connectorForm, setConnectorForm] = useState<Record<string, string>>({});
  const [connectorName, setConnectorName] = useState('');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [connectorFilter, setConnectorFilter] = useState('all');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Load settings
  useEffect(() => {
    setMounted(true);
    loadSettings();
    loadUsers();
    loadConnectors();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.settings.get();
      if (data.language) setLocale(data.language as any);
      if (data.timezone) setTimezone(data.timezone);
      if (data.notifications) setNotifSettings(data.notifications);
      if (data.security) setSecSettings(data.security);
    } catch {}
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await api.users.list();
      setUsers(data || []);
    } catch {} finally {
      setUsersLoading(false);
    }
  };

  const loadConnectors = async () => {
    try {
      setConnectorsLoading(true);
      const [list, templates] = await Promise.all([
        api.connectors.list().catch(() => []),
        api.connectors.definitionsByCategory().catch(() => ({})),
      ]);
      setConnectors(list || []);
      setConnectorTemplates(templates || {});
    } catch {} finally {
      setConnectorsLoading(false);
    }
  };

  if (!mounted) return <PageLoader />;

  const handleSaveGeneral = async () => {
    try {
      setSaving(true);
      await api.settings.update({ language: locale, timezone, theme: 'dark' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      await api.settings.updateNotifications(notifSettings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {} finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      setSaving(true);
      await api.settings.updateSecurity(secSettings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {} finally {
      setSaving(false);
    }
  };

  // User CRUD
  const handleCreateUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.password) return;
    try {
      await api.users.create(userForm);
      setShowUserModal(false);
      setUserForm({ name: '', email: '', password: '', role: 'analyst' });
      loadUsers();
    } catch (err: any) {
      setFormError(err.message || 'Error creating user');
      setTimeout(() => setFormError(''), 5000);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      await api.users.update(editingUser.id, { name: userForm.name, email: userForm.email, role: userForm.role as any });
      setShowUserModal(false);
      setEditingUser(null);
      setUserForm({ name: '', email: '', password: '', role: 'analyst' });
      loadUsers();
    } catch (err: any) {
      setFormError(err.message || 'Error updating user');
      setTimeout(() => setFormError(''), 5000);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await api.users.delete(id);
      setDeleteConfirm(null);
      loadUsers();
    } catch (err: any) {
      setFormError(err.message || 'Error deleting user');
      setTimeout(() => setFormError(''), 5000);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setFormError('Passwords do not match');
      setTimeout(() => setFormError(''), 5000);
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setFormError('Password must be at least 8 characters');
      setTimeout(() => setFormError(''), 5000);
      return;
    }
    try {
      await api.users.changePassword(user?.id || '', passwordForm.currentPassword, passwordForm.newPassword);
      setShowPasswordModal(false);
      setPasswordForm({ userId: '', currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setFormError(err.message || 'Error changing password');
      setTimeout(() => setFormError(''), 5000);
    }
  };

  const handleResetPassword = async () => {
    if (resetForm.newPassword.length < 8) {
      setFormError('Password must be at least 8 characters');
      setTimeout(() => setFormError(''), 5000);
      return;
    }
    try {
      await api.users.resetPassword(resetForm.userId, resetForm.newPassword);
      setShowResetModal(false);
      setResetForm({ userId: '', newPassword: '' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setFormError(err.message || 'Error resetting password');
      setTimeout(() => setFormError(''), 5000);
    }
  };

  const openEditUser = (user: any) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, password: '', role: user.role });
    setShowUserModal(true);
  };

  // Connector handlers
  const handleAddConnector = (template: any) => {
    setSelectedTemplate(template);
    setConnectorName(template.name);
    setConnectorForm({});
    setShowConnectorModal(true);
  };

  const handleCreateConnector = async () => {
    if (!selectedTemplate || !connectorName) return;
    try {
      await api.connectors.create({
        name: connectorName,
        type: selectedTemplate.type,
        category: selectedTemplate.category,
        description: selectedTemplate.description,
        icon: selectedTemplate.icon,
        vendor: selectedTemplate.vendor,
        config: connectorForm,
        configSchema: selectedTemplate.configSchema,
        status: 'inactive',
        isEnabled: false,
      });
      setShowConnectorModal(false);
      setSelectedTemplate(null);
      loadConnectors();
    } catch (err: any) {
      setFormError(err.message || 'Error creating connector');
      setTimeout(() => setFormError(''), 5000);
    }
  };

  const handleToggleConnector = async (id: string) => {
    try {
      await api.connectors.toggle(id);
      loadConnectors();
    } catch (err: any) {
      setFormError(err.message || 'Error toggling connector');
      setTimeout(() => setFormError(''), 5000);
    }
  };

  const handleTestConnector = async (id: string) => {
    try {
      setTestingId(id);
      const result = await api.connectors.test(id);
      loadConnectors();
      setFormError(result.success ? '' : result.message);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
      setTimeout(() => setFormError(''), 5000);
    } catch (err: any) {
      setFormError(err.message || 'Connection test failed');
      setTimeout(() => setFormError(''), 5000);
    } finally {
      setTestingId(null);
    }
  };

  const handleDeleteConnector = async (id: string) => {
    try {
      await api.connectors.delete(id);
      loadConnectors();
    } catch (err: any) {
      setFormError(err.message || 'Error deleting connector');
      setTimeout(() => setFormError(''), 5000);
    }
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={cn('w-10 h-6 rounded-full transition-colors', enabled ? 'bg-[#FF6B00]' : 'bg-gray-700')}>
      <div className={cn('w-4 h-4 rounded-full bg-white transition-transform mt-1', enabled ? 'translate-x-5' : 'translate-x-1')} />
    </button>
  );

  return (
    <div className="flex h-screen bg-[#050505]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-white">{t('settings.title')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('settings.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-4 gap-6">
            {/* Sidebar nav */}
            <motion.div className="col-span-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <GlassPanel padding="md">
                <nav className="space-y-1">
                  {settingsSections.map((section) => {
                    const Icon = section.id === 'general' ? Settings : section.id === 'integrations' ? Plug : section.id === 'security' ? Shield : section.id === 'notifications' ? Bell : Users;
                    return (
                      <button key={section.id} onClick={() => setActiveSection(section.id)}
                        className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                          activeSection === section.id ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'text-gray-500 hover:text-white hover:bg-white/5')}>
                        <Icon size={18} />{t(section.iconKey)}
                      </button>
                    );
                  })}
                </nav>
              </GlassPanel>
            </motion.div>

            {/* Content */}
            <motion.div className="col-span-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <GlassPanel padding="lg">
                {formError && (
                  <div className="mb-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{formError}</div>
                )}
                {/* GENERAL */}
                {activeSection === 'general' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">{t('settings.general')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">{t('general.orgName')}</label>
                        <input value={orgName} onChange={e => setOrgName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]/50" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-500 mb-1 block">{t('general.language')}</label>
                          <select value={locale} onChange={e => { setLocale(e.target.value as any); }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]/50">
                            {LOCALES.map(l => (
                              <option key={l.value} value={l.value}>{l.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500 mb-1 block">{t('general.timezone')}</label>
                          <select value={timezone} onChange={e => setTimezone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]/50">
                            {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button onClick={handleSaveGeneral} disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B00] text-white text-sm hover:bg-[#FF6B00]/90 transition-colors disabled:opacity-50">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        {saved ? t('settings.saved') : t('settings.save')}
                      </button>
                    </div>
                  </div>
                )}

                {/* INTEGRATIONS */}
                {activeSection === 'integrations' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{t('integrations.title')}</h3>
                        <p className="text-xs text-gray-500 mt-1">Connect to cloud platforms, EDR, SIEM, network devices, and more</p>
                      </div>
                    </div>

                    {/* Active connectors */}
                    {connectors.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('integrations.activeConnections')}</h4>
                        {connectors.filter(c => c.isEnabled).map((c) => (
                          <div key={c.id} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-3">
                              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', c.status === 'active' ? 'bg-[#FF6B00]/10' : c.status === 'error' ? 'bg-red-500/10' : 'bg-white/5')}>
                                <Plug size={18} className={cn(c.status === 'active' ? 'text-[#FF6B00]' : c.status === 'error' ? 'text-red-400' : 'text-gray-500')} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{c.name}</p>
                                <p className="text-xs text-gray-500">{c.vendor} • {c.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {c.eventsReceived > 0 && <span className="text-xs text-gray-600">{(c.eventsReceived / 1000).toFixed(1)}K {t('integrations.eventsReceived')}</span>}
                              <span className={cn('text-xs px-2 py-1 rounded', c.status === 'active' ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : c.status === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-gray-500')}>
                                {c.status === 'active' ? t('integrations.connected') : c.status === 'error' ? t('integrations.error') : t('integrations.inactive')}
                              </span>
                              <button onClick={() => handleTestConnector(c.id)} disabled={testingId === c.id}
                                className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors disabled:opacity-50">
                                {testingId === c.id ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                              </button>
                              <button onClick={() => handleToggleConnector(c.id)}
                                className={cn('p-1.5 rounded transition-colors', c.isEnabled ? 'hover:bg-red-500/10 text-[#FF6B00] hover:text-red-400' : 'hover:bg-white/10 text-gray-500 hover:text-white')}>
                                {c.isEnabled ? <PowerOff size={14} /> : <Power size={14} />}
                              </button>
                              <button onClick={() => handleDeleteConnector(c.id)}
                                className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Available connectors by category */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('integrations.available')}</h4>
                      {Object.entries(connectorTemplates).map(([category, templates]) => {
                        const configuredNames = connectors.map(c => c.name);
                        const available = templates.filter((tmpl: any) => !configuredNames.includes(tmpl.name));
                        if (available.length === 0) return null;
                        const isExpanded = expandedCategory === category || connectorFilter === category;
                        return (
                          <div key={category} className="border border-white/5 rounded-lg overflow-hidden">
                            <button onClick={() => setExpandedCategory(isExpanded ? null : category)}
                              className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                              <span className="text-sm font-medium text-white capitalize">{category.replace(/_/g, ' ')}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">{t('integrations.availableCount', { count: available.length })}</span>
                                <ChevronDown size={14} className={cn('text-gray-600 transition-transform', isExpanded && 'rotate-180')} />
                              </div>
                            </button>
                            {isExpanded && (
                              <div className="p-3 grid grid-cols-2 gap-2">
                                {available.map((t: any) => (
                                  <button key={t.name} onClick={() => handleAddConnector(t)}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-[#FF6B00]/30 transition-all text-left">
                                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center flex-shrink-0">
                                      <Plug size={14} className="text-[#FF6B00]" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium text-white truncate">{t.name}</p>
                                      <p className="text-[10px] text-gray-600 truncate">{t.vendor}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SECURITY */}
                {activeSection === 'security' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">{t('security.title')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02]">
                        <div><p className="text-sm font-medium text-white">{t('security.mfa')}</p><p className="text-xs text-gray-500">{t('security.mfa.desc')}</p></div>
                        <Toggle enabled={secSettings.mfaEnabled} onToggle={() => setSecSettings(s => ({ ...s, mfaEnabled: !s.mfaEnabled }))} />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02]">
                        <div><p className="text-sm font-medium text-white">{t('security.session')}</p><p className="text-xs text-gray-500">{t('security.session.desc')}</p></div>
                        <Toggle enabled={secSettings.sessionTimeout > 0} onToggle={() => setSecSettings(s => ({ ...s, sessionTimeout: s.sessionTimeout > 0 ? 0 : 30 }))} />
                      </div>
                    </div>

                    {/* Change Password */}
                    <div className="pt-4 border-t border-white/5">
                      <h4 className="text-sm font-semibold text-white mb-3">{t('security.changePassword')}</h4>
                      <div className="space-y-3 max-w-md">
                        <input type="password" placeholder={t('security.currentPassword')} value={passwordForm.currentPassword}
                          onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]/50" />
                        <input type="password" placeholder={t('security.newPassword')} value={passwordForm.newPassword}
                          onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]/50" />
                        <input type="password" placeholder={t('security.confirmPassword')} value={passwordForm.confirmPassword}
                          onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]/50" />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button onClick={() => { handleSaveSecurity(); if (passwordForm.currentPassword && passwordForm.newPassword) handleChangePassword(); }}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B00] text-white text-sm hover:bg-[#FF6B00]/90 transition-colors disabled:opacity-50">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        {saved ? t('settings.saved') : t('settings.save')}
                      </button>
                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS */}
                {activeSection === 'notifications' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">{t('notifications.title')}</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'criticalIncidents', label: t('notifications.critical'), desc: t('notifications.critical.desc') },
                        { key: 'weeklyReports', label: t('notifications.weekly'), desc: t('notifications.weekly.desc') },
                        { key: 'threatAlerts', label: t('notifications.threats'), desc: t('notifications.threats.desc') },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02]">
                          <div><p className="text-sm font-medium text-white">{item.label}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
                          <Toggle enabled={notifSettings[item.key as keyof typeof notifSettings]}
                            onToggle={() => setNotifSettings(s => ({ ...s, [item.key]: !s[item.key as keyof typeof s] }))} />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button onClick={handleSaveNotifications} disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B00] text-white text-sm hover:bg-[#FF6B00]/90 transition-colors disabled:opacity-50">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        {saved ? t('settings.saved') : t('settings.save')}
                      </button>
                    </div>
                  </div>
                )}

                {/* USERS */}
                {activeSection === 'users' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{t('users.title')}</h3>
                      <button onClick={() => { setEditingUser(null); setUserForm({ name: '', email: '', password: '', role: 'analyst' }); setShowUserModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B00] text-white text-sm hover:bg-[#FF6B00]/90 transition-colors">
                        <Plus size={14} />{t('users.add')}
                      </button>
                    </div>

                    {usersLoading ? (
                      <div className="flex justify-center py-8"><Loader2 size={24} className="text-[#FF6B00] animate-spin" /></div>
                    ) : (
                      <div className="space-y-3">
                        {users.map((u) => (
                          <div key={u.id} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#FF6B00] flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{u.name?.[0] || '?'}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{u.name}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 capitalize">{u.role}</span>
                              <span className={cn('text-xs', u.isActive ? 'text-[#FF6B00]' : 'text-gray-600')}>{u.isActive ? t('users.active') : t('users.inactive')}</span>
                              <div className="flex items-center gap-1">
                                <button onClick={() => openEditUser(u)} className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                                  <Pencil size={14} />
                                </button>
                                <button onClick={() => { setResetForm({ userId: u.id, newPassword: '' }); setShowResetModal(true); }}
                                  className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                                  <Key size={14} />
                                </button>
                                {deleteConfirm === u.id ? (
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => handleDeleteUser(u.id)} className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30">{t('common.delete')}</button>
                                    <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded text-xs bg-white/5 text-gray-500">{t('common.cancel')}</button>
                                  </div>
                                ) : (
                                  <button onClick={() => setDeleteConfirm(u.id)} className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors">
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {users.length === 0 && <p className="text-sm text-gray-600 text-center py-8">{t('common.noResults')}</p>}
                      </div>
                    )}
                  </div>
                )}
              </GlassPanel>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Create/Edit User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowUserModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{editingUser ? t('users.edit') : t('users.add')}</h3>
                <button onClick={() => setShowUserModal(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <input placeholder={t('users.name')} value={userForm.name} onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]/50" />
                <input placeholder={t('users.email')} type="email" value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]/50" />
                {!editingUser && (
                  <input placeholder={t('users.password')} type="password" value={userForm.password} onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]/50" />
                )}
                <select value={userForm.role} onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]/50">
                  <option value="admin">{t('users.admin')}</option>
                  <option value="analyst">{t('users.analyst')}</option>
                  <option value="viewer">{t('users.viewer')}</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowUserModal(false)} className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 text-sm hover:bg-white/10">{t('common.cancel')}</button>
                <button onClick={editingUser ? handleUpdateUser : handleCreateUser}
                  className="px-4 py-2 rounded-lg bg-[#FF6B00] text-white text-sm hover:bg-[#FF6B00]/90">
                  {editingUser ? t('common.update') : t('common.create')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowResetModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{t('users.resetPassword')}</h3>
                <button onClick={() => setShowResetModal(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <input placeholder={t('security.newPassword')} type="password" value={resetForm.newPassword}
                  onChange={e => setResetForm(f => ({ ...f, newPassword: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]/50" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowResetModal(false)} className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 text-sm hover:bg-white/10">{t('common.cancel')}</button>
                <button onClick={handleResetPassword} className="px-4 py-2 rounded-lg bg-[#FF6B00] text-white text-sm hover:bg-[#FF6B00]/90">{t('common.save')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connector Config Modal */}
      <AnimatePresence>
        {showConnectorModal && selectedTemplate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowConnectorModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedTemplate.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{selectedTemplate.vendor} • {selectedTemplate.description}</p>
                </div>
                <button onClick={() => setShowConnectorModal(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
              </div>
              {formError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                  <p className="text-xs text-red-400">{formError}</p>
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{t('integrations.connectionName')}</label>
                  <input placeholder="e.g. Production AWS" value={connectorName} onChange={e => setConnectorName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]/50" />
                </div>
                {selectedTemplate.configSchema && Object.entries(selectedTemplate.configSchema).map(([key, field]: [string, any]) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500 mb-1 block">{field.label || key.replace(/_/g, ' ')}</label>
                    <input
                      placeholder={field.placeholder || `Enter ${key.replace(/_/g, ' ')}`}
                      type={field.type === 'password' || key.toLowerCase().includes('secret') || key.toLowerCase().includes('key') ? 'password' : 'text'}
                      value={connectorForm[key] || ''}
                      onChange={e => setConnectorForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]/50"
                    />
                  </div>
                ))}
                {(!selectedTemplate.configSchema || Object.keys(selectedTemplate.configSchema).length === 0) && (
                  <p className="text-xs text-gray-600 text-center py-4">{t('integrations.noConfig')}</p>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowConnectorModal(false)} className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 text-sm hover:bg-white/10">{t('common.cancel')}</button>
                <button onClick={handleCreateConnector} disabled={!connectorName}
                  className="px-4 py-2 rounded-lg bg-[#FF6B00] text-white text-sm hover:bg-[#FF6B00]/90 disabled:opacity-40">
                  {t('integrations.connect')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
