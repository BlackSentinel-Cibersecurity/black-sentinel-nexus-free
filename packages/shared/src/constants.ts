export const SEVERITY_LEVELS = {
  critical: { label: 'Critical', color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-400' },
  high: { label: 'High', color: '#FF6B00', bg: 'bg-[#FF6B00]/10', text: 'text-[#FF6B00]' },
  medium: { label: 'Medium', color: '#eab308', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  low: { label: 'Low', color: '#6b7280', bg: 'bg-white/5', text: 'text-gray-400' },
} as const;

export const STATUS_COLORS = {
  active: { color: '#22c55e', bg: 'bg-green-500/10', text: 'text-green-400' },
  warning: { color: '#eab308', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  critical: { color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-400' },
  offline: { color: '#6b7280', bg: 'bg-white/5', text: 'text-gray-400' },
} as const;

export const ASSET_ICONS: Record<string, string> = {
  server: 'Server',
  database: 'Database',
  firewall: 'Shield',
  endpoint: 'Monitor',
  cloud: 'Cloud',
  network: 'Wifi',
  container: 'Box',
  application: 'Globe',
  certificate: 'Lock',
  other: 'HelpCircle',
};
