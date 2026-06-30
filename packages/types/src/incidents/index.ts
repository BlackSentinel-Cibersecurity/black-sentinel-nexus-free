import { Severity, Status, Identifiable, Timestamped } from '../common';

export interface Incident extends Identifiable, Timestamped {
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  source: string;
  tactics: string[];
  techniques: string[];
  affectedAssets: string[];
  affectedUsers: string[];
  iocs: IOC[];
  timeline: TimelineEvent[];
  aiSummary?: string;
  aiRecommendations?: string[];
  mitreMapping: MITREMapping[];
  riskScore: number;
  assignedTo?: string;
  resolvedAt?: Date;
  tags: string[];
}

export interface IOC extends Identifiable {
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'file';
  value: string;
  confidence: number;
  severity: Severity;
  context?: string;
}

export interface TimelineEvent {
  timestamp: Date;
  phase: string;
  description: string;
  source: string;
  details: Record<string, unknown>;
  aiExplanation?: string;
}

export interface MITREMapping {
  tactic: string;
  technique: string;
  techniqueId: string;
  subTechnique?: string;
}

export interface IncidentCreateDTO {
  title: string;
  description: string;
  severity: Severity;
  source: string;
  affectedAssets?: string[];
  affectedUsers?: string[];
  iocs?: Omit<IOC, 'id'>[];
  tags?: string[];
}
