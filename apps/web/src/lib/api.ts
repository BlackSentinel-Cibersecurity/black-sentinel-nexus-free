const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('bsn_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bsn_token');
      localStorage.removeItem('bsn_user');
      window.location.href = '/login';
    }
    throw new Error('No autorizado');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error en la solicitud');
  return data;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchAPI('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    profile: () => fetchAPI('/api/v1/auth/profile'),
    register: (email: string, name: string, password: string, role?: string) =>
      fetchAPI('/api/v1/auth/register', { method: 'POST', body: JSON.stringify({ email, name, password, role }) }),
  },
  events: {
    list: (params?: any) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchAPI(`/api/v1/events${qs}`);
    },
    get: (id: string) => fetchAPI(`/api/v1/events/${id}`),
    stats: () => fetchAPI('/api/v1/events/stats'),
    timeline: (minutes?: number) => fetchAPI(`/api/v1/events/timeline${minutes ? `?minutes=${minutes}` : ''}`),
    ingest: (event: any) => fetchAPI('/api/v1/events/ingest', { method: 'POST', body: JSON.stringify(event) }),
    ingestBatch: (events: any[]) => fetchAPI('/api/v1/events/ingest/batch', { method: 'POST', body: JSON.stringify(events) }),
  },
  incidents: {
    list: (params?: any) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchAPI(`/api/v1/incidents${qs}`);
    },
    get: (id: string) => fetchAPI(`/api/v1/incidents/${id}`),
    stats: () => fetchAPI('/api/v1/incidents/stats'),
    create: (data: any) => fetchAPI('/api/v1/incidents', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string, notes?: string) =>
      fetchAPI(`/api/v1/incidents/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
    update: (id: string, data: any) => fetchAPI(`/api/v1/incidents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    addNote: (id: string, user: string, content: string) =>
      fetchAPI(`/api/v1/incidents/${id}/notes`, { method: 'POST', body: JSON.stringify({ user, content }) }),
    delete: (id: string) => fetchAPI(`/api/v1/incidents/${id}`, { method: 'DELETE' }),
  },
  assets: {
    list: (params?: any) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchAPI(`/api/v1/assets${qs}`);
    },
    get: (id: string) => fetchAPI(`/api/v1/assets/${id}`),
    stats: () => fetchAPI('/api/v1/assets/stats'),
    digitalTwin: () => fetchAPI('/api/v1/assets/digital-twin'),
    create: (data: any) => fetchAPI('/api/v1/assets', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchAPI(`/api/v1/assets/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/api/v1/assets/${id}`, { method: 'DELETE' }),
  },
  threats: {
    list: (params?: any) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchAPI(`/api/v1/threats${qs}`);
    },
    indicators: () => fetchAPI('/api/v1/threats/indicators'),
    feeds: () => fetchAPI('/api/v1/threats/feeds'),
    search: (q: string) => fetchAPI(`/api/v1/threats/indicators/search?q=${encodeURIComponent(q)}`),
    correlate: (ioc: string) => fetchAPI('/api/v1/threats/correlate', { method: 'POST', body: JSON.stringify({ ioc }) }),
    stats: () => fetchAPI('/api/v1/threats/stats'),
  },
  playbooks: {
    list: () => fetchAPI('/api/v1/playbooks'),
    get: (id: string) => fetchAPI(`/api/v1/playbooks/${id}`),
    stats: () => fetchAPI('/api/v1/playbooks/stats'),
    create: (data: any) => fetchAPI('/api/v1/playbooks', { method: 'POST', body: JSON.stringify(data) }),
    execute: (id: string, triggeredBy?: any) =>
      fetchAPI(`/api/v1/playbooks/${id}/execute`, { method: 'POST', body: JSON.stringify({ triggeredBy }) }),
    update: (id: string, data: any) => fetchAPI(`/api/v1/playbooks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/api/v1/playbooks/${id}`, { method: 'DELETE' }),
  },
  connectors: {
    list: () => fetchAPI('/api/v1/connectors'),
    get: (id: string) => fetchAPI(`/api/v1/connectors/${id}`),
    definitions: () => fetchAPI('/api/v1/connectors/definitions'),
    definitionsByCategory: () => fetchAPI('/api/v1/connectors/definitions/by-category'),
    stats: () => fetchAPI('/api/v1/connectors/stats'),
    create: (data: any) => fetchAPI('/api/v1/connectors', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchAPI(`/api/v1/connectors/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    toggle: (id: string) => fetchAPI(`/api/v1/connectors/${id}/toggle`, { method: 'PATCH' }),
    test: (id: string) => fetchAPI(`/api/v1/connectors/${id}/test`, { method: 'POST' }),
    delete: (id: string) => fetchAPI(`/api/v1/connectors/${id}`, { method: 'DELETE' }),
  },
  ai: {
    query: (query: string) => fetchAPI('/api/v1/ai/query', { method: 'POST', body: JSON.stringify({ query }) }),
    generateRule: (desc: string) => fetchAPI('/api/v1/ai/generate-rule', { method: 'POST', body: JSON.stringify({ description: desc }) }),
  },
  correlation: {
    alerts: (params?: { status?: string; severity?: string; limit?: number }) => {
      const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return fetchAPI(`/api/v1/correlation/alerts${qs}`);
    },
    rules: () => fetchAPI('/api/v1/correlation/rules'),
  },
  reports: {
    list: () => fetchAPI('/api/v1/reports'),
    templates: () => fetchAPI('/api/v1/reports/templates'),
    generate: (type: string, parameters?: Record<string, unknown>) =>
      fetchAPI('/api/v1/reports/generate', { method: 'POST', body: JSON.stringify({ type, parameters }) }),
    generatePdf: async (type: string, parameters?: Record<string, unknown>): Promise<Blob> => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('bsn_token') : null;
      const res = await fetch(`${API_URL}/api/v1/reports/generate/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ type, parameters }),
      });
      if (!res.ok) throw new Error('Error generating PDF');
      return res.blob();
    },
  },
  prediction: {
    analyze: () => fetchAPI('/api/v1/prediction/analyze'),
  },
  risk: {
    score: (assetId: string) => fetchAPI(`/api/v1/risk/score/${assetId}`),
  },
  digitalTwin: {
    graph: () => fetchAPI('/api/v1/digital-twin'),
    node: (id: string) => fetchAPI(`/api/v1/digital-twin/${id}`),
  },
  notifications: {
    list: () => fetchAPI('/api/v1/notifications'),
    unreadCount: () => fetchAPI('/api/v1/notifications/unread-count'),
    markRead: (id: string) => fetchAPI(`/api/v1/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => fetchAPI('/api/v1/notifications/read-all', { method: 'PATCH' }),
  },
  users: {
    list: () => fetchAPI('/api/v1/users'),
    get: (id: string) => fetchAPI(`/api/v1/users/${id}`),
    stats: () => fetchAPI('/api/v1/users/stats'),
    create: (data: { email: string; name: string; password: string; role?: string }) =>
      fetchAPI('/api/v1/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: { name?: string; email?: string; role?: string; isActive?: boolean }) =>
      fetchAPI(`/api/v1/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    changePassword: (id: string, currentPassword: string, newPassword: string) =>
      fetchAPI(`/api/v1/users/${id}/password`, { method: 'PATCH', body: JSON.stringify({ currentPassword, newPassword }) }),
    resetPassword: (id: string, newPassword: string) =>
      fetchAPI(`/api/v1/users/${id}/reset-password`, { method: 'PATCH', body: JSON.stringify({ newPassword }) }),
    delete: (id: string) => fetchAPI(`/api/v1/users/${id}`, { method: 'DELETE' }),
  },
  settings: {
    get: () => fetchAPI('/api/v1/settings'),
    update: (data: any) => fetchAPI('/api/v1/settings', { method: 'PATCH', body: JSON.stringify(data) }),
    updateLanguage: (language: string) =>
      fetchAPI('/api/v1/settings/language', { method: 'PATCH', body: JSON.stringify({ language }) }),
    updateTimezone: (timezone: string) =>
      fetchAPI('/api/v1/settings/timezone', { method: 'PATCH', body: JSON.stringify({ timezone }) }),
    updateNotifications: (notifications: any) =>
      fetchAPI('/api/v1/settings/notifications', { method: 'PATCH', body: JSON.stringify(notifications) }),
    updateSecurity: (security: any) =>
      fetchAPI('/api/v1/settings/security', { method: 'PATCH', body: JSON.stringify(security) }),
  },
};
