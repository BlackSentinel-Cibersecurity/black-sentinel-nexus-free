'use client';

import { useEffect, useRef } from 'react';
import { useSocket } from './socket';

type Handler = (data: any) => void;

export function useRealtime(room: string, events: Record<string, Handler>) {
  const { socket, connected, joinRoom, leaveRoom } = useSocket();
  const handlersRef = useRef(events);
  handlersRef.current = events;

  useEffect(() => {
    if (!socket || !connected) return;

    joinRoom(room);

    const listeners: Array<[string, Handler]> = [];
    for (const [event, handler] of Object.entries(events)) {
      const wrapped = (data: any) => handlersRef.current[event]?.(data);
      socket.on(event, wrapped);
      listeners.push([event, wrapped]);
    }

    return () => {
      for (const [event, listener] of listeners) {
        socket.off(event, listener);
      }
      leaveRoom(room);
    };
  }, [socket, connected, room, joinRoom, leaveRoom]);
}

export function useDashboardRealtime(handlers: {
  onEventNew?: Handler;
  onAlertNew?: Handler;
  onAlertUpdated?: Handler;
  onIncidentNew?: Handler;
  onIncidentUpdated?: Handler;
  onMetricsUpdate?: Handler;
  onNotification?: Handler;
}) {
  useRealtime('dashboard', {
    'event.new': handlers.onEventNew || (() => {}),
    'alert.new': handlers.onAlertNew || (() => {}),
    'alert.updated': handlers.onAlertUpdated || (() => {}),
    'incident.new': handlers.onIncidentNew || (() => {}),
    'incident.updated': handlers.onIncidentUpdated || (() => {}),
    'metrics.update': handlers.onMetricsUpdate || (() => {}),
    'notification': handlers.onNotification || (() => {}),
  });
}
