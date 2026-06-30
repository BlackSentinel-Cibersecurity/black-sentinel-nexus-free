'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Settings, ChevronDown, Sparkles, X, AlertTriangle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { useSocket } from '@/lib/socket';
import { useI18n } from '@/lib/i18n';
import { cn } from '@bsn/ui';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { socket, connected } = useSocket();
  const { t, locale } = useI18n();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.notifications.list().catch(() => ({ data: [] }));
        setNotifications(data.data || []);
      } catch { /* ignore */ }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    };
    socket.on('notification', handler);
    return () => { socket.off('notification', handler); };
  }, [socket]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      await api.notifications.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch { /* ignore */ }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={14} className="text-[#FF6B00]" />;
      case 'incident': return <AlertTriangle size={14} className="text-red-400" />;
      default: return <Info size={14} className="text-blue-400" />;
    }
  };

  const dateLocale = locale === 'en' ? 'en-US' : 'es-ES';

  return (
    <header className="h-16 border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder={t('header.search')}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FF6B00]/50 focus:ring-1 focus:ring-[#FF6B00]/20 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] text-gray-600 bg-white/5 rounded font-mono">Ctrl</kbd>
              <kbd className="px-1.5 py-0.5 text-[10px] text-gray-600 bg-white/5 rounded font-mono">K</kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FF6B00]/10">
            <Sparkles size={14} className="text-[#FF6B00]" />
            <span className="text-xs font-medium text-[#FF6B00]">{t('header.aiActive')}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-600'}`} />
            <span className="text-[10px] text-gray-600">{connected ? t('header.live') : t('header.off')}</span>
          </div>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
              className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Bell size={20} className="text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF6B00]" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-[#0D0D0D] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <h3 className="text-sm font-semibold text-white">{t('header.notifications')}</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-gray-600 hover:text-white">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center">
                        <Bell size={32} className="mx-auto text-gray-700 mb-2" />
                        <p className="text-xs text-gray-600">{t('notifications.empty') || 'No notifications'}</p>
                      </div>
                    ) : (
                      notifications.slice(0, 10).map(n => (
                        <div
                          key={n.id}
                          className={cn(
                            'px-4 py-3 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors',
                            !n.isRead && 'bg-[#FF6B00]/5'
                          )}
                          onClick={() => markAsRead(n.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">{getNotifIcon(n.type)}</div>
                            <div className="flex-1 min-w-0">
                              <p className={cn('text-sm', n.isRead ? 'text-gray-400' : 'text-white font-medium')}>{n.title}</p>
                              <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-gray-700 mt-1">{new Date(n.createdAt).toLocaleString(dateLocale)}</p>
                            </div>
                            {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#FF6B00] flex-shrink-0 mt-1" />}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-white/5 text-center">
                      <button className="text-xs text-[#FF6B00] hover:underline">{t('notifications.viewAll') || 'View all'}</button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => router.push('/settings')}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Settings size={20} className="text-gray-500" />
          </button>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center">
                <span className="text-xs font-bold text-white">{user?.name?.[0] || 'A'}</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-gray-500">{user?.role || 'admin'}</p>
              </div>
              <ChevronDown size={14} className="text-gray-600" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-[#0D0D0D] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <button
                    onClick={() => router.push('/settings')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {t('header.settings')}
                  </button>
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5"
                  >
                    {t('header.logout')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
