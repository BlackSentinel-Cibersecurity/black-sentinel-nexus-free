import { Injectable } from '@nestjs/common';
import { PredictionResult } from '@bsn/types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PredictionService {

  async getAttackPredictions(): Promise<PredictionResult[]> {
    return [
      {
        id: uuidv4(),
        type: 'attack_prediction',
        probability: 0.82,
        timeWindow: '72 hours',
        description: '82% probability of ransomware attempt on production servers based on detected reconnaissance patterns.',
        factors: [
          'Intensive port scanning from external IP',
          'SMB share access attempts',
          'Anomalous PowerShell activity',
          'Unpatched vulnerabilities on servers',
        ],
        recommendations: [
          'Implement immediate network segmentation',
          'Verify backups and their integrity',
          'Enable intensive SMB monitoring',
          'Review write permissions on shares',
        ],
        confidence: 0.82,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        type: 'attack_prediction',
        probability: 0.67,
        timeWindow: '48 hours',
        description: 'Possible targeted phishing attempt on finance department based on active campaigns detected.',
        factors: [
          'Active phishing campaigns in financial sector',
          'Finance employees as frequent target',
          'Recently blocked suspicious emails',
        ],
        recommendations: [
          'Refresh awareness training',
          'Block suspicious domains',
          'Implement DMARC verification',
        ],
        confidence: 0.67,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async getRiskTrends(): Promise<PredictionResult[]> {
    return [
      {
        id: uuidv4(),
        type: 'risk_trend',
        probability: 0.65,
        timeWindow: '7 days',
        description: 'Overall organizational risk will increase 15% in the next 7 days due to accumulated vulnerabilities.',
        factors: [
          'Accumulated pending patches',
          'Critical services exposure',
          'Users with excessive privileges',
        ],
        recommendations: [
          'Prioritize patching cycle',
          'Review privilege model',
        ],
        confidence: 0.65,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async getAnomalies() {
    return [
      {
        id: uuidv4(),
        type: 'behavioral_anomaly',
        severity: 'high',
        description: 'Admin user downloaded 2.5GB of data outside business hours',
        user: 'admin@company.com',
        timestamp: new Date(Date.now() - 7200000),
        riskScore: 78,
      },
      {
        id: uuidv4(),
        type: 'network_anomaly',
        severity: 'medium',
        description: 'Unusual traffic to Tor network IP from production server',
        source: 'SERVER-PROD-03',
        destination: '185.x.x.x',
        timestamp: new Date(Date.now() - 14400000),
        riskScore: 65,
      },
      {
        id: uuidv4(),
        type: 'process_anomaly',
        severity: 'critical',
        description: 'PowerShell executing external download with Base64 encoding',
        host: 'WS-FINANCE-01',
        process: 'powershell.exe',
        timestamp: new Date(Date.now() - 3600000),
        riskScore: 92,
      },
    ];
  }

  async generatePrediction(type: string, parameters: Record<string, unknown>) {
    return {
      id: uuidv4(),
      type,
      probability: 0.55,
      timeWindow: parameters.timeWindow || '24 hours',
      description: `Prediction generated for ${type} with custom parameters`,
      factors: ['Factor 1', 'Factor 2', 'Factor 3'],
      recommendations: ['Recommendation 1', 'Recommendation 2'],
      confidence: 0.50,
      createdAt: new Date(),
      modelVersion: '1.0.0',
      trainingData: 'Last updated: ' + new Date().toISOString(),
    };
  }
}
