'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from './api';

export function useApiData<T>(
  fetcher: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useEvents() {
  return useApiData(() => api.events.list());
}

export function useIncidents() {
  return useApiData(() => api.incidents.list());
}

export function useAssets() {
  return useApiData(() => api.assets.list());
}

export function useThreats() {
  return useApiData(() => api.threats.list());
}

export function usePlaybooks() {
  return useApiData(() => api.playbooks.list());
}

export function useDashboardStats() {
  return useApiData(async () => {
    const [events, incidents, assets] = await Promise.all([
      api.events.stats().catch(() => null),
      api.incidents.stats().catch(() => null),
      api.assets.list().catch(() => ({ total: 0 })),
    ]);
    return { events, incidents, assets };
  });
}
