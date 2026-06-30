'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      {/* Background neural network pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B00]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6B00]/3 rounded-full blur-3xl" />
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-[#FF6B00]/30 rounded-full animate-float"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 4}s` }} />
        ))}
      </div>

      <div className="w-full max-w-md p-8 bg-[#0D0D0D]/80 backdrop-blur-xl rounded-2xl border border-white/5 relative z-10 shadow-2xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center mb-4">
            <svg viewBox="0 0 48 48" className="w-12 h-12">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#FF6B00" strokeWidth="2" opacity="0.3" />
              <circle cx="24" cy="24" r="12" fill="none" stroke="#FF6B00" strokeWidth="2" />
              <circle cx="24" cy="24" r="4" fill="#FF6B00" />
              <line x1="24" y1="4" x2="24" y2="12" stroke="#FF6B00" strokeWidth="1.5" />
              <line x1="24" y1="36" x2="24" y2="44" stroke="#FF6B00" strokeWidth="1.5" />
              <line x1="4" y1="24" x2="12" y2="24" stroke="#FF6B00" strokeWidth="1.5" />
              <line x1="36" y1="24" x2="44" y2="24" stroke="#FF6B00" strokeWidth="1.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-white">
            <span className="text-white">BLACK</span>
            <span className="text-[#FF6B00]">SENTINEL</span>
          </h1>
          <p className="text-[#FF6B00] text-xs font-medium tracking-widest mt-1">NEXUS</p>
          <p className="text-gray-600 text-xs mt-2">NEW GENERATION SIEM</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">{t('login.email')}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]/20 transition-all placeholder:text-gray-600"
              placeholder="admin@blacksentinel.io" autoFocus />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">{t('login.password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]/20 transition-all placeholder:text-gray-600"
              placeholder="••••••••" />
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          <button type="submit" disabled={loading || !email || !password}
            className="w-full py-3 bg-[#FF6B00] text-white font-medium rounded-lg hover:bg-[#FF6B00]/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#FF6B00]/20 hover:shadow-[#FF6B00]/30">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('login.loading')}
              </span>
            ) : t('login.submit')}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-700">BlackSentinel Nexus v1.0 — Security Operations Platform</p>
        </div>
      </div>
    </div>
  );
}
