import { AssetType, CloudProvider, RiskScore, Identifiable, Timestamped } from '../common';

export interface Asset extends Identifiable, Timestamped {
  name: string;
  type: AssetType;
  hostname?: string;
  ipAddress?: string;
  macAddress?: string;
  operatingSystem?: string;
  osVersion?: string;
  cloudProvider?: CloudProvider;
  cloudRegion?: string;
  cloudInstanceId?: string;
  ownerId?: string;
  ownerName?: string;
  department?: string;
  criticality: 'critical' | 'high' | 'medium' | 'low';
  riskScore: RiskScore;
  status: 'online' | 'offline' | 'maintenance' | 'compromised';
  health: number;
  lastSeen: Date;
  tags: string[];
  metadata: Record<string, unknown>;
  dependencies: AssetDependency[];
  exposures: AssetExposure[];
}

export interface AssetDependency {
  targetAssetId: string;
  type: 'connects_to' | 'depends_on' | 'communicates_with' | 'manages' | 'hosts';
  protocol?: string;
  port?: number;
}

export interface AssetExposure {
  type: 'open_port' | 'vulnerability' | 'misconfiguration' | 'weak_cipher' | 'expired_cert';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  cveId?: string;
  remediation?: string;
}

export interface DigitalTwinNode {
  id: string;
  type: AssetType;
  label: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'minimal';
  x: number;
  y: number;
  z: number;
  connections: string[];
  metrics: NodeMetrics;
  lastUpdate: Date;
}

export interface NodeMetrics {
  cpu?: number;
  memory?: number;
  disk?: number;
  network?: number;
  eventsPerSecond?: number;
  activeConnections?: number;
}

export interface DigitalTwinGraph {
  nodes: DigitalTwinNode[];
  edges: DigitalTwinEdge[];
  metadata: {
    totalNodes: number;
    totalEdges: number;
    criticalNodes: number;
    lastSync: Date;
  };
}

export interface DigitalTwinEdge {
  source: string;
  target: string;
  type: string;
  weight: number;
  status: 'active' | 'inactive' | 'compromised';
}
