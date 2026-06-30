'use client';

import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="flex h-screen bg-[#050505] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-[#FF6B00] animate-spin" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
