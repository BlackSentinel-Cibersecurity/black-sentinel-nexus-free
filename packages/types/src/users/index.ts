import { Identifiable, Timestamped, Severity } from '../common';

export interface User extends Identifiable, Timestamped {
  email: string;
  name: string;
  displayName: string;
  department: string;
  role: string;
  riskScore: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  lastActivity: Date;
  lastLogin: Date;
  status: 'active' | 'inactive' | 'disabled' | 'compromised';
  authMethod: 'password' | 'sso' | 'mfa' | 'certificate';
  devices: UserDevice[];
  permissions: string[];
  anomalies: UserAnomaly[];
}

export interface UserDevice {
  id: string;
  name: string;
  type: 'workstation' | 'laptop' | 'mobile' | 'tablet';
  os: string;
  lastSeen: Date;
  status: 'active' | 'inactive' | 'compromised';
}

export interface UserAnomaly {
  type: string;
  description: string;
  severity: Severity;
  detectedAt: Date;
  relatedEvents: string[];
}
