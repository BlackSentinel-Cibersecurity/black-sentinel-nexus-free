import { Identifiable, Timestamped } from '../common';

export interface AIMessage extends Identifiable, Timestamped {
  role: 'user' | 'assistant' | 'system';
  content: string;
  context?: AIContext;
  tokens?: {
    input: number;
    output: number;
  };
}

export interface AIContext {
  incidentId?: string;
  assetId?: string;
  eventId?: string;
  userId?: string;
  conversationId?: string;
  additionalData?: Record<string, unknown>;
}

export interface AIConversation extends Identifiable, Timestamped {
  title: string;
  messages: AIMessage[];
  context: AIContext;
  status: 'active' | 'archived';
}

export interface AIAnalysisRequest {
  type: 'incident_summary' | 'risk_assessment' | 'threat_analysis' | 'vulnerability_explanation' | 'natural_language_query' | 'rule_generation' | 'playbook_generation' | 'executive_summary';
  input: string;
  context?: Record<string, unknown>;
  language?: string;
}

export interface AIAnalysisResponse {
  result: string;
  confidence: number;
  sources?: string[];
  recommendations?: string[];
  metadata?: Record<string, unknown>;
}

export interface PredictionResult extends Identifiable, Timestamped {
  type: 'attack_prediction' | 'risk_trend' | 'anomaly_detection' | 'capacity_forecast';
  probability: number;
  timeWindow: string;
  description: string;
  factors: string[];
  recommendations: string[];
  confidence: number;
}

export interface NaturalLanguageQuery {
  query: string;
  context?: Record<string, unknown>;
}

export interface QueryTranslation {
  originalQuery: string;
  targetLanguage: 'kql' | 'spl' | 'sql' | 'sigma' | 'yara' | 'regex';
  translatedQuery: string;
  explanation: string;
  confidence: number;
}
