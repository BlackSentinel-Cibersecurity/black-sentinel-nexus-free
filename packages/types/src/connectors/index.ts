import { Identifiable, Timestamped } from '../common';

export interface Connector extends Identifiable, Timestamped {
  name: string;
  type: 'input' | 'output' | 'bidirectional';
  protocol: string;
  category: 'siem' | 'endpoint' | 'network' | 'cloud' | 'identity' | 'vulnerability' | 'threat_intel' | 'collaboration' | 'custom';
  enabled: boolean;
  status: 'connected' | 'disconnected' | 'error' | 'configured';
  config: ConnectorConfig;
  stats: ConnectorStats;
  lastEvent?: Date;
}

export interface ConnectorConfig {
  host?: string;
  port?: number;
  apiKey?: string;
  username?: string;
  password?: string;
  tokens?: Record<string, string>;
  options: Record<string, unknown>;
}

export interface ConnectorStats {
  eventsReceived: number;
  eventsProcessed: number;
  eventsDropped: number;
  errorsCount: number;
  lastEventTime?: Date;
  averageLatency: number;
}

export interface ConnectorDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  type: 'input' | 'output' | 'bidirectional';
  category: string;
  configSchema: Record<string, unknown>;
  icon?: string;
  documentation?: string;
}
