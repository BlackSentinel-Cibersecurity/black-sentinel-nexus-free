'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, Loader2 } from 'lucide-react';
import { GlassPanel } from '../common/GlassPanel';
import { cn } from '../../utils/cn';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CopilotProps {
  className?: string;
}

export function Copilot({ className }: CopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Soy BlackSentinel Copilot. Puedo ayudarte a analizar incidentes, buscar amenazas, generar reglas y responder cualquier pregunta sobre tu entorno de seguridad. ¿En qué puedo asistirte?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    const response = await generateAIResponse(input);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const generateAIResponse = async (query: string): Promise<string> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = typeof window !== 'undefined' ? localStorage.getItem('bsn_token') : null;
      
      const res = await fetch(`${apiUrl}/api/v1/ai/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ query }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.response || data.answer || data.result || JSON.stringify(data);
      }
    } catch {
      // Fall back to simulated response
    }

    // Simulated responses when API is unavailable
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('incidente') || lowerQuery.includes('incident')) {
      return 'He detectado 3 incidentes activos en los últimos 60 minutos. El más crítico es un intento de movimiento lateral desde el servidor WEB-PROD-03 hacia la base de datos principal. Recomiendo aislar inmediatamente el endpoint afectado. ¿Deseas que ejecute el playbook de contención?';
    }
    
    if (lowerQuery.includes('vulnerabil') || lowerQuery.includes('vulnerability')) {
      return 'Encontré 47 vulnerabilidades activas en tu infraestructura. 12 son críticas (CVSS > 9.0). Las más urgentes incluyen CVE-2024-3094 en los servidores de producción y CVE-2024-21762 en los firewalls Fortinet. ¿Genero un plan de remediación priorizado?';
    }
    
    if (lowerQuery.includes('amenaza') || lowerQuery.includes('threat')) {
      return 'Las amenazas más activas en tu entorno son: 1) Activity associated with APT29 targeting credential harvest (3 IPs activas), 2) Ransomware variant detected in sandbox analysis, 3) Phishing campaign targeting finance department. ¿Quieres que deep-dive en alguna de estas amenazas?';
    }

    if (lowerQuery.includes('regla') || lowerQuery.includes('rule') || lowerQuery.includes('sigma')) {
      return 'Puedo generar reglas Sigma, YARA o consultas KQL/SPL. Describe el comportamiento que quieres detectar y crearé la regla optimizada con falsos positivos minimizados.';
    }

    return `Analizando tu consulta: "${query}". Basado en los datos actuales de tu entorno, puedo proporcionarte un análisis detallado. ¿Necesitas que ejecute una consulta específica, genere un informe o tome alguna acción automatizada?`;
  };

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full',
          'bg-gradient-brand',
          'flex items-center justify-center',
          'shadow-glow',
          'hover:shadow-glow-lg',
          'transition-all duration-300'
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles size={24} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Copilot panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              'fixed bottom-24 right-6 z-50 w-[400px] h-[500px]',
              className
            )}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <GlassPanel className="h-full flex flex-col" padding="none">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-bsn-orange/10">
                <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">BlackSentinel Copilot</h3>
                  <p className="text-xs text-gray-500">Asistente de IA siempre activo</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-xl px-4 py-3',
                        message.role === 'user'
                          ? 'bg-bsn-orange/20 text-white'
                          : 'bg-white/5 text-gray-300'
                      )}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className="text-[10px] text-gray-600 mt-2">
                        {message.timestamp.toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="bg-white/5 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 size={14} className="text-bsn-orange animate-spin" />
                        <span className="text-xs text-gray-500">Analizando...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-bsn-orange/10">
                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Pregúntale a BlackSentinel..."
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className={cn(
                      'p-2 rounded-lg transition-all duration-200',
                      input.trim() && !isTyping
                        ? 'bg-gradient-brand text-white hover:shadow-glow'
                        : 'text-gray-600 cursor-not-allowed'
                    )}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
