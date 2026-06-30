'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, AlertTriangle, Shield, Activity, RefreshCw, Maximize2 } from 'lucide-react';
import { GlassPanel, StatusIndicator, cn } from '@bsn/ui';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api';
import { PageLoader } from '@/components/PageLoader';
import { useI18n } from '@/lib/i18n';
import { useRealtime } from '@/lib/use-realtime';

interface NeuralNode {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'core' | 'input' | 'processing' | 'output' | 'memory';
  active: boolean;
  pulsePhase: number;
}

interface NeuralConnection {
  from: string;
  to: string;
  active: boolean;
  signalStrength: number;
  signalProgress: number;
}

interface CorrelationAlert {
  id: string;
  ruleName: string;
  severity: string;
  sourceIp: string;
  message: string;
  timestamp: string;
  eventsCount: number;
  status: string;
}

function NeuralBrain({ alerts, onNodeClick }: { alerts: CorrelationAlert[]; onNodeClick: (alert: CorrelationAlert) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const nodesRef = useRef<NeuralNode[]>([]);
  const connectionsRef = useRef<NeuralConnection[]>([]);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener('resize', resize);

    // Create brain structure
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const cx = w / 2;
    const cy = h / 2;

    // Generate neural nodes in brain shape
    const nodes: NeuralNode[] = [];
    const nodeCount = 45;

    // Central core (processing center)
    nodes.push({ id: 'core', x: cx, y: cy, label: 'AI Core', type: 'processing', active: true, pulsePhase: 0 });

    // Inner ring - processing nodes
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const r = 60;
      nodes.push({
        id: `proc-${i}`,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        label: `P${i + 1}`,
        type: 'processing',
        active: Math.random() > 0.3,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Middle ring - memory nodes
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = 120 + Math.sin(angle * 3) * 20;
      nodes.push({
        id: `mem-${i}`,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        label: `M${i + 1}`,
        type: 'memory',
        active: Math.random() > 0.4,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Outer ring - input/output nodes (sensor-like)
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const r = 180 + Math.sin(angle * 5) * 15;
      const type = i % 3 === 0 ? 'input' : i % 3 === 1 ? 'output' : 'processing';
      nodes.push({
        id: `io-${i}`,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        label: type === 'input' ? `IN${i}` : type === 'output' ? `OUT${i}` : `N${i}`,
        type,
        active: Math.random() > 0.2,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Peripheral nodes
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const r = 220;
      nodes.push({
        id: `per-${i}`,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        label: `S${i + 1}`,
        type: 'input',
        active: Math.random() > 0.5,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Create connections
    const connections: NeuralConnection[] = [];

    // Core to inner ring
    for (let i = 0; i < 8; i++) {
      connections.push({ from: 'core', to: `proc-${i}`, active: true, signalStrength: 0.8, signalProgress: 0 });
    }

    // Inner to middle ring
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 3; j++) {
        const targetIdx = (i * 3 + j) % 12;
        connections.push({ from: `proc-${i}`, to: `mem-${targetIdx}`, active: Math.random() > 0.3, signalStrength: 0.6, signalProgress: Math.random() });
      }
    }

    // Middle to outer ring
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 2; j++) {
        const targetIdx = (i * 2 + j) % 16;
        connections.push({ from: `mem-${i}`, to: `io-${targetIdx}`, active: Math.random() > 0.4, signalStrength: 0.5, signalProgress: Math.random() });
      }
    }

    // Outer to peripheral
    for (let i = 0; i < 8; i++) {
      connections.push({ from: `io-${i * 2}`, to: `per-${i}`, active: Math.random() > 0.3, signalStrength: 0.4, signalProgress: Math.random() });
    }

    // Cross connections (neural pathways)
    for (let i = 0; i < 10; i++) {
      const fromIdx = Math.floor(Math.random() * nodes.length);
      const toIdx = Math.floor(Math.random() * nodes.length);
      if (fromIdx !== toIdx) {
        connections.push({ from: nodes[fromIdx].id, to: nodes[toIdx].id, active: Math.random() > 0.6, signalStrength: 0.3, signalProgress: Math.random() });
      }
    }

    nodesRef.current = nodes;
    connectionsRef.current = connections;

    // Animation loop
    const animate = () => {
      timeRef.current += 0.016;
      const time = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Draw background glow
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 250);
      gradient.addColorStop(0, 'rgba(255, 107, 0, 0.05)');
      gradient.addColorStop(0.5, 'rgba(255, 107, 0, 0.02)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Draw connections
      connectionsRef.current.forEach((conn) => {
        const fromNode = nodesRef.current.find(n => n.id === conn.from);
        const toNode = nodesRef.current.find(n => n.id === conn.to);
        if (!fromNode || !toNode) return;

        // Update signal progress
        if (conn.active) {
          conn.signalProgress += 0.008 * conn.signalStrength;
          if (conn.signalProgress > 1) conn.signalProgress = 0;
        }

        // Draw connection line
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);

        // Curved connections
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const cpx = midX - dy * 0.15;
        const cpy = midY + dx * 0.15;

        ctx.quadraticCurveTo(cpx, cpy, toNode.x, toNode.y);

        ctx.strokeStyle = conn.active ? 'rgba(255, 107, 0, 0.15)' : 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = conn.active ? 1 : 0.5;
        ctx.stroke();

        // Draw signal pulse
        if (conn.active) {
          const t = conn.signalProgress;
          const tx = (1 - t) * (1 - t) * fromNode.x + 2 * (1 - t) * t * cpx + t * t * toNode.x;
          const ty = (1 - t) * (1 - t) * fromNode.y + 2 * (1 - t) * t * cpy + t * t * toNode.y;

          ctx.beginPath();
          ctx.arc(tx, ty, 2 + conn.signalStrength * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 107, 0, ${0.4 + conn.signalStrength * 0.4})`;
          ctx.fill();

          // Signal trail
          const trailT = Math.max(0, t - 0.05);
          const trailX = (1 - trailT) * (1 - trailT) * fromNode.x + 2 * (1 - trailT) * trailT * cpx + trailT * trailT * toNode.x;
          const trailY = (1 - trailT) * (1 - trailT) * fromNode.y + 2 * (1 - trailT) * trailT * cpy + trailT * trailT * toNode.y;

          ctx.beginPath();
          ctx.moveTo(trailX, trailY);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle = `rgba(255, 107, 0, ${0.2 + conn.signalStrength * 0.2})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw nodes
      nodesRef.current.forEach((node) => {
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.3 + 0.7;
        const baseSize = node.type === 'core' ? 12 : node.type === 'processing' ? 7 : node.type === 'memory' ? 6 : node.type === 'input' ? 5 : 5;
        const size = baseSize * (node.active ? pulse : 0.6);

        // Glow
        if (node.active) {
          const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 3);
          glowGrad.addColorStop(0, `rgba(255, 107, 0, ${0.15 * pulse})`);
          glowGrad.addColorStop(1, 'rgba(255, 107, 0, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node body
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);

        if (node.type === 'core') {
          const coreGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size);
          coreGrad.addColorStop(0, '#FF8A30');
          coreGrad.addColorStop(1, '#FF6B00');
          ctx.fillStyle = coreGrad;
        } else if (node.type === 'processing') {
          ctx.fillStyle = node.active ? '#FF6B00' : 'rgba(255, 107, 0, 0.3)';
        } else if (node.type === 'memory') {
          ctx.fillStyle = node.active ? 'rgba(255, 107, 0, 0.7)' : 'rgba(255, 107, 0, 0.2)';
        } else {
          ctx.fillStyle = node.active ? 'rgba(255, 107, 0, 0.5)' : 'rgba(255, 107, 0, 0.15)';
        }
        ctx.fill();

        // Node border
        ctx.strokeStyle = node.active ? 'rgba(255, 107, 0, 0.8)' : 'rgba(255, 107, 0, 0.2)';
        ctx.lineWidth = node.type === 'core' ? 2 : 1;
        ctx.stroke();

        // Core label
        if (node.type === 'core') {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 8px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('AI', node.x, node.y);
        }
      });

      // Draw rotating outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, 240, time * 0.2, time * 0.2 + Math.PI * 1.5);
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 245, -time * 0.15, -time * 0.15 + Math.PI);
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.05)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Update node activity based on alerts
  useEffect(() => {
    const activeCount = Math.min(alerts.length, 20);
    nodesRef.current.forEach((node, i) => {
      node.active = i < activeCount || Math.random() > 0.4;
    });
  }, [alerts]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find closest node
    let closest: NeuralNode | null = null;
    let minDist = 30;
    nodesRef.current.forEach((node) => {
      const dist = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      if (dist < minDist) {
        minDist = dist;
        closest = node;
      }
    });

    if (closest && alerts.length > 0) {
      onNodeClick(alerts[0]);
    }
  }, [alerts, onNodeClick]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair"
      onClick={handleCanvasClick}
      onMouseMove={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }}
    />
  );
}

export default function CorrelationPage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [alerts, setAlerts] = useState<CorrelationAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<CorrelationAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, medium: 0, low: 0 });

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await api.events.stats().catch(() => null);
      // Generate demo correlation alerts from event data
      const demoAlerts: CorrelationAlert[] = [
        { id: '1', ruleName: 'Brute Force Detection', severity: 'critical', sourceIp: '192.168.1.105', message: '5+ failed login attempts from same IP in 5 minutes', timestamp: new Date().toISOString(), eventsCount: 12, status: 'open' },
        { id: '2', ruleName: 'Port Scan Detected', severity: 'high', sourceIp: '10.0.0.42', message: '15 connections to different ports from single source', timestamp: new Date(Date.now() - 300000).toISOString(), eventsCount: 15, status: 'open' },
        { id: '3', ruleName: 'Data Exfiltration Attempt', severity: 'critical', sourceIp: '172.16.0.88', message: 'Unusual outbound data transfer pattern detected', timestamp: new Date(Date.now() - 600000).toISOString(), eventsCount: 8, status: 'investigating' },
        { id: '4', ruleName: 'Privilege Escalation', severity: 'critical', sourceIp: '192.168.1.200', message: 'Admin privilege escalation from standard user account', timestamp: new Date(Date.now() - 900000).toISOString(), eventsCount: 3, status: 'open' },
        { id: '5', ruleName: 'Malware Activity', severity: 'critical', sourceIp: '10.0.0.15', message: 'Known malware signature detected in network traffic', timestamp: new Date(Date.now() - 1200000).toISOString(), eventsCount: 6, status: 'contained' },
        { id: '6', ruleName: 'Anomalous Login Pattern', severity: 'high', sourceIp: '203.0.113.50', message: 'Login from unusual geographic location', timestamp: new Date(Date.now() - 1500000).toISOString(), eventsCount: 2, status: 'open' },
        { id: '7', ruleName: 'Lateral Movement', severity: 'high', sourceIp: '192.168.1.110', message: 'Sequential access to multiple internal servers', timestamp: new Date(Date.now() - 1800000).toISOString(), eventsCount: 4, status: 'investigating' },
        { id: '8', ruleName: 'DNS Tunneling', severity: 'medium', sourceIp: '10.0.0.77', message: 'Suspicious DNS query patterns detected', timestamp: new Date(Date.now() - 2100000).toISOString(), eventsCount: 20, status: 'open' },
      ];
      setAlerts(demoAlerts);
      setStats({
        total: demoAlerts.length,
        critical: demoAlerts.filter(a => a.severity === 'critical').length,
        high: demoAlerts.filter(a => a.severity === 'high').length,
        medium: demoAlerts.filter(a => a.severity === 'medium').length,
        low: demoAlerts.filter(a => a.severity === 'low').length,
      });
    } catch { } finally { setLoading(false); }
  };

  useRealtime('dashboard', {
    'alert.new': (alert: CorrelationAlert) => {
      setAlerts(prev => [alert, ...prev]);
      setStats(prev => ({ ...prev, total: prev.total + 1, [alert.severity]: (prev[alert.severity as keyof typeof prev] || 0) + 1 }));
    },
    'alert.updated': (alert: CorrelationAlert) => {
      setAlerts(prev => prev.map(a => a.id === alert.id ? alert : a));
    },
  });

  useEffect(() => { setMounted(true); fetchAlerts(); }, []);
  if (!mounted) return <PageLoader />;

  const severityColor = (s: string) => {
    switch (s) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-[#FF6B00] bg-[#FF6B00]/10 border-[#FF6B00]/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-gray-400 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="flex h-screen bg-bsn-bg-primary">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6 space-y-6">
          <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center">
                <Brain size={24} className="text-[#FF6B00]" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white">{t('correlation.title')}</h1>
                <p className="text-sm text-gray-500">{t('correlation.subtitle')}</p>
              </div>
            </div>
            <button onClick={fetchAlerts} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span className="text-sm">{t('common.refresh')}</span>
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div className="grid grid-cols-5 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {[
              { label: t('correlation.totalAlerts'), value: stats.total, icon: <AlertTriangle size={18} />, color: 'text-white' },
              { label: t('correlation.critical'), value: stats.critical, icon: <Zap size={18} />, color: 'text-red-400' },
              { label: t('correlation.high'), value: stats.high, icon: <AlertTriangle size={18} />, color: 'text-[#FF6B00]' },
              { label: t('correlation.medium'), value: stats.medium, icon: <Activity size={18} />, color: 'text-yellow-400' },
              { label: t('correlation.low'), value: stats.low, icon: <Shield size={18} />, color: 'text-gray-400' },
            ].map((stat, i) => (
              <GlassPanel key={i} padding="md">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stat.color.replace('text-', 'bg-').replace('400', '500/10').replace('white', 'white/5'))}>
                    <span className={stat.color}>{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Neural Brain Visualization */}
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <GlassPanel className="h-[500px] overflow-hidden" padding="none">
                <div className="relative w-full h-full">
                  <NeuralBrain alerts={alerts} onNodeClick={setSelectedAlert} />
                  {/* Overlay labels */}
                  <div className="absolute top-4 left-4 space-y-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D0D0D]/80 backdrop-blur-sm border border-white/5">
                      <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
                      <span className="text-xs text-gray-400">{t('correlation.neuralActive')}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D0D0D]/80 backdrop-blur-sm border border-white/5">
                      <Brain size={12} className="text-[#FF6B00]" />
                      <span className="text-xs text-gray-400">{alerts.length} {t('correlation.activeCorrelations')}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D0D0D]/80 backdrop-blur-sm border border-white/5">
                    <span className="text-xs text-gray-600">{t('correlation.clickNode')}</span>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>

            {/* Alerts Panel */}
            <motion.div className="lg:col-span-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <GlassPanel className="h-[500px] flex flex-col" padding="none">
                <div className="px-4 py-3 border-b border-white/5">
                  <h3 className="text-sm font-semibold text-white">{t('correlation.activeAlerts')}</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  <AnimatePresence>
                    {alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn('p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.01]', severityColor(alert.severity), selectedAlert?.id === alert.id && 'ring-1 ring-[#FF6B00]/50')}
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{alert.ruleName}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{alert.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] text-gray-600">{alert.sourceIp}</span>
                              <span className="text-[10px] text-gray-700">•</span>
                              <span className="text-[10px] text-gray-600">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                          <StatusIndicator status={alert.severity === 'critical' ? 'critical' : alert.severity === 'high' ? 'warning' : 'active'} size="sm" pulse />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </GlassPanel>
            </motion.div>
          </div>

          {/* Detail Panel */}
          <AnimatePresence>
            {selectedAlert && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                <GlassPanel padding="lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <StatusIndicator status={selectedAlert.severity === 'critical' ? 'critical' : selectedAlert.severity === 'high' ? 'warning' : 'active'} size="md" pulse />
                        <div>
                          <h3 className="text-lg font-semibold text-white">{selectedAlert.ruleName}</h3>
                          <p className="text-sm text-gray-500">{selectedAlert.message}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 pt-2">
                        {[
                          [t('correlation.severity'), selectedAlert.severity],
                          [t('correlation.sourceIp'), selectedAlert.sourceIp],
                          [t('correlation.eventsCount'), String(selectedAlert.eventsCount)],
                          [t('correlation.status'), selectedAlert.status],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <p className="text-xs text-gray-500">{label}</p>
                            <p className="text-sm text-white mt-0.5">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => setSelectedAlert(null)} className="text-gray-500 hover:text-white text-sm">{t('common.close')}</button>
                  </div>
                </GlassPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
