import { Identifiable, Timestamped } from '../common';

export interface Playbook extends Identifiable, Timestamped {
  name: string;
  description: string;
  version: number;
  enabled: boolean;
  trigger: PlaybookTrigger;
  steps: PlaybookStep[];
  variables: PlaybookVariable[];
  createdBy: string;
  executionCount: number;
  lastExecuted?: Date;
  tags: string[];
  category: 'response' | 'investigation' | 'containment' | 'remediation' | 'notification' | 'custom';
}

export interface PlaybookTrigger {
  type: 'manual' | 'event' | 'schedule' | 'webhook' | 'alert';
  conditions: PlaybookCondition[];
}

export interface PlaybookCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'regex';
  value: string;
}

export interface PlaybookStep {
  id: string;
  name: string;
  type: 'action' | 'condition' | 'loop' | 'approval' | 'ai_analysis' | 'notification' | 'api_call' | 'script';
  config: Record<string, unknown>;
  nextStep?: string;
  onError?: string;
  timeout?: number;
  retries?: number;
}

export interface PlaybookVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  defaultValue?: unknown;
  required: boolean;
  description?: string;
}

export interface PlaybookExecution extends Identifiable, Timestamped {
  playbookId: string;
  status: 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
  trigger: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  steps: StepExecution[];
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
}

export interface StepExecution {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
}
