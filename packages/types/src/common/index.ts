export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type Status = 'active' | 'investigating' | 'contained' | 'eradicated' | 'recovered' | 'closed';
export type AssetType = 'server' | 'endpoint' | 'network' | 'cloud' | 'container' | 'database' | 'user' | 'application' | 'iot' | 'ot';
export type CloudProvider = 'aws' | 'azure' | 'gcp' | 'oracle' | 'alibaba';
export type Protocol = 'tcp' | 'udp' | 'icmp' | 'http' | 'https' | 'dns' | 'ssh' | 'rdp' | 'smb';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'minimal';
export type EventCategory = 'authentication' | 'network' | 'process' | 'file' | 'registry' | 'dns' | 'email' | 'cloud' | 'container' | 'application';

export interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

export interface Identifiable {
  id: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface GeoLocation {
  country: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface RiskScore {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
  calculatedAt: Date;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface RiskFactor {
  name: string;
  weight: number;
  value: number;
  contribution: number;
}
