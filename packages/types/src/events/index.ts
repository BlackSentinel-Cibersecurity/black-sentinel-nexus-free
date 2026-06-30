import { Severity, EventCategory, Identifiable, Timestamped } from '../common';

export interface SecurityEvent extends Identifiable, Timestamped {
  timestamp: Date;
  source: string;
  category: EventCategory;
  action: string;
  outcome: 'success' | 'failure' | 'unknown';
  severity: Severity;
  assetId?: string;
  userId?: string;
  sourceIp?: string;
  destinationIp?: string;
  sourcePort?: number;
  destinationPort?: number;
  protocol?: string;
  hostname?: string;
  processName?: string;
  processId?: number;
  commandLine?: string;
  fileName?: string;
  filePath?: string;
  fileHash?: string;
  registryKey?: string;
  dnsQuery?: string;
  userAgent?: string;
  httpMethod?: string;
  httpUrl?: string;
  httpStatusCode?: number;
  bytesRead?: number;
  bytesWritten?: number;
  rawLog: string;
  parsedFields: Record<string, unknown>;
  enrichment?: EventEnrichment;
}

export interface EventEnrichment {
  geoLocation?: {
    source?: { country: string; city?: string; };
    destination?: { country: string; city?: string; };
  };
  threatIntelligence?: {
    isKnownThreat: boolean;
    threatType?: string;
    confidence?: number;
    source?: string;
  };
  userContext?: {
    department?: string;
    role?: string;
    riskLevel?: string;
    lastActivity?: Date;
  };
  assetContext?: {
    criticality?: string;
    owner?: string;
    lastPatch?: Date;
    vulnerabilities?: number;
  };
}

export interface EventQuery {
  startTime: Date;
  endTime: Date;
  categories?: EventCategory[];
  severity?: Severity[];
  sources?: string[];
  assetIds?: string[];
  userIds?: string[];
  sourceIps?: string[];
  destinationIps?: string[];
  freeText?: string;
  limit?: number;
  offset?: number;
}
