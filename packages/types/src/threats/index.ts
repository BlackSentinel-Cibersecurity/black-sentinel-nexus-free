import { Severity, Identifiable, Timestamped } from '../common';

export interface ThreatIntelligence extends Identifiable, Timestamped {
  name: string;
  type: 'apt' | 'malware' | 'ransomware' | 'phishing' | 'supply_chain' | 'zero_day';
  severity: Severity;
  confidence: number;
  description: string;
  tactics: string[];
  techniques: string[];
  indicators: ThreatIndicator[];
  sources: string[];
  firstSeen: Date;
  lastSeen: Date;
  tags: string[];
}

export interface ThreatIndicator extends Identifiable {
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'mutex' | 'registry' | 'file';
  value: string;
  confidence: number;
  context?: string;
}

export interface ThreatFeed extends Identifiable, Timestamped {
  name: string;
  url: string;
  type: 'stix' | 'taxii' | 'csv' | 'json' | 'misp';
  enabled: boolean;
  lastFetched?: Date;
  nextFetch?: Date;
  indicatorsCount: number;
  reliability: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface Vulnerability extends Identifiable, Timestamped {
  cveId: string;
  description: string;
  severity: Severity;
  cvssScore: number;
  epssScore?: number;
  isKEV: boolean;
  affectedAssets: string[];
  publishedDate: Date;
  lastModified: Date;
  references: string[];
  remediation?: string;
  exploitAvailable: boolean;
  inTheWild: boolean;
}
