'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard, Shield, AlertTriangle, Server, Cloud,
  Zap, FileText, Settings, ChevronLeft, ChevronRight, Brain,
} from 'lucide-react';
import { cn } from '@bsn/ui';
import { useI18n } from '@/lib/i18n';

export function Sidebar() {
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: t('sidebar.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('sidebar.correlation'), href: '/correlation', icon: Brain },
    { name: t('sidebar.incidents'), href: '/incidents', icon: AlertTriangle },
    { name: t('sidebar.assets'), href: '/assets', icon: Server },
    { name: t('sidebar.digitalTwin'), href: '/digital-twin', icon: Cloud },
    { name: t('sidebar.threats'), href: '/threat-intel', icon: Shield },
    { name: t('sidebar.playbooks'), href: '/playbooks', icon: Zap },
    { name: t('sidebar.reports'), href: '/reports', icon: FileText },
    { name: t('sidebar.settings'), href: '/settings', icon: Settings },
  ];

  return (
    <motion.aside
      className={cn(
        'h-screen bg-[#0D0D0D] border-r border-white/5 flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
      initial={false}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/5">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src="/logo.png"
            alt="BlackSentinel"
            width={36}
            height={36}
            className="flex-shrink-0 rounded"
          />
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden min-w-0"
            >
              <div className="whitespace-nowrap leading-none">
                <span className="text-[15px] font-bold text-white tracking-tight">BLACK</span>
                <span className="text-[15px] font-bold text-[#FF6B00] tracking-tight">SENTINEL</span>
              </div>
              <div className="whitespace-nowrap leading-none mt-0.5">
                <span className="text-[11px] font-semibold text-[#FF6B00]">Nexus</span>
              </div>
              <div className="whitespace-nowrap leading-none mt-0.5">
                <span className="text-[8px] text-gray-500 uppercase tracking-[0.15em]">New Generation SIEM</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-[#FF6B00]/10 text-[#FF6B00]'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <motion.span
                  className="text-sm font-medium whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
              )}
              {isActive && !collapsed && (
                <motion.div
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF6B00]"
                  layoutId="activeIndicator"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-white/5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-xs">{t('sidebar.collapse')}</span>}
        </button>
      </div>
    </motion.aside>
  );
}
