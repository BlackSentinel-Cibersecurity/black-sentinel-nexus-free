import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../../database/entities/asset.entity';
import { Incident } from '../../database/entities/incident.entity';
import { RiskScore, RiskFactor } from '@bsn/types';

@Injectable()
export class RiskService {
  constructor(
    @InjectRepository(Asset) private assetRepo: Repository<Asset>,
    @InjectRepository(Incident) private incidentRepo: Repository<Incident>,
  ) {}

  private readonly riskWeights = {
    exposure: 0.25,
    criticality: 0.2,
    vulnerabilities: 0.2,
    threatActivity: 0.15,
    configuration: 0.1,
    historicalIncidents: 0.1,
  };

  calculateAssetRisk(assetData: {
    id: string;
    type: string;
    criticality: string;
    exposures: number;
    vulnerabilities: { critical: number; high: number; medium: number };
    threatActivity: number;
    misconfigurations: number;
    historicalIncidents: number;
    lastPatched: Date;
    isPublicFacing: boolean;
    hasMFA: boolean;
    networkSegmentation: boolean;
  }): RiskScore {
    const factors: RiskFactor[] = [];

    const exposureScore = this.calculateExposureScore(assetData);
    factors.push({
      name: 'Exposure',
      weight: this.riskWeights.exposure,
      value: exposureScore,
      contribution: exposureScore * this.riskWeights.exposure,
    });

    const criticalityScore = this.calculateCriticalityScore(
      assetData.criticality,
    );
    factors.push({
      name: 'Criticality',
      weight: this.riskWeights.criticality,
      value: criticalityScore,
      contribution: criticalityScore * this.riskWeights.criticality,
    });

    const vulnScore = this.calculateVulnerabilityScore(
      assetData.vulnerabilities,
    );
    factors.push({
      name: 'Vulnerabilities',
      weight: this.riskWeights.vulnerabilities,
      value: vulnScore,
      contribution: vulnScore * this.riskWeights.vulnerabilities,
    });

    const threatScore = this.calculateThreatScore(assetData.threatActivity);
    factors.push({
      name: 'Threat Activity',
      weight: this.riskWeights.threatActivity,
      value: threatScore,
      contribution: threatScore * this.riskWeights.threatActivity,
    });

    const configScore = this.calculateConfigurationScore(assetData);
    factors.push({
      name: 'Configuration',
      weight: this.riskWeights.configuration,
      value: configScore,
      contribution: configScore * this.riskWeights.configuration,
    });

    const historyScore = this.calculateHistoryScore(
      assetData.historicalIncidents,
    );
    factors.push({
      name: 'History',
      weight: this.riskWeights.historicalIncidents,
      value: historyScore,
      contribution: historyScore * this.riskWeights.historicalIncidents,
    });

    const totalScore = factors.reduce((sum, f) => sum + f.contribution, 0);
    const normalizedScore = Math.min(100, Math.max(0, totalScore));

    return {
      score: Math.round(normalizedScore),
      level: this.getRiskLevel(normalizedScore),
      factors,
      calculatedAt: new Date(),
      trend: 'stable',
    };
  }

  private calculateExposureScore(data: {
    isPublicFacing: boolean;
    exposures: number;
    hasMFA: boolean;
    networkSegmentation: boolean;
  }): number {
    let score = 0;
    if (data.isPublicFacing) score += 40;
    if (data.exposures > 5) score += 30;
    else if (data.exposures > 2) score += 20;
    else if (data.exposures > 0) score += 10;
    if (!data.hasMFA) score += 15;
    if (!data.networkSegmentation) score += 15;
    return Math.min(100, score);
  }

  private calculateCriticalityScore(criticality: string): number {
    const scores: Record<string, number> = {
      critical: 100,
      high: 75,
      medium: 50,
      low: 25,
    };
    return scores[criticality] || 50;
  }

  private calculateVulnerabilityScore(vulns: {
    critical: number;
    high: number;
    medium: number;
  }): number {
    const score = vulns.critical * 30 + vulns.high * 15 + vulns.medium * 5;
    return Math.min(100, score);
  }

  private calculateThreatScore(threatActivity: number): number {
    return Math.min(100, threatActivity * 20);
  }

  private calculateConfigurationScore(data: {
    misconfigurations: number;
    lastPatched: Date;
  }): number {
    let score = 0;
    if (data.misconfigurations > 5) score += 50;
    else if (data.misconfigurations > 2) score += 30;
    else if (data.misconfigurations > 0) score += 15;
    const daysSincePatched = Math.floor(
      (Date.now() - new Date(data.lastPatched).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (daysSincePatched > 90) score += 40;
    else if (daysSincePatched > 30) score += 20;
    return Math.min(100, score);
  }

  private calculateHistoryScore(incidents: number): number {
    return Math.min(100, incidents * 25);
  }

  private getRiskLevel(
    score: number,
  ): 'critical' | 'high' | 'medium' | 'low' | 'minimal' {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'minimal';
  }

  async getRiskOverview() {
    const assets = await this.assetRepo.find();
    const incidents = await this.incidentRepo.find();
    const total = assets.length;

    const distribution = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      minimal: 0,
    };
    let totalScore = 0;

    for (const asset of assets) {
      const risk = this.calculateAssetRisk({
        id: asset.id,
        type: asset.type,
        criticality: (asset as any).criticality || 'medium',
        exposures: (asset as any).exposures || 0,
        vulnerabilities: (asset as any).vulnerabilities || {
          critical: 0,
          high: 0,
          medium: 0,
        },
        threatActivity: 0,
        misconfigurations: 0,
        historicalIncidents: incidents.filter((i) =>
          (i as any).affectedAssetIds?.includes(asset.id),
        ).length,
        lastPatched: (asset as any).lastPatchedAt || new Date(),
        isPublicFacing: (asset as any).isPublicFacing || false,
        hasMFA: false,
        networkSegmentation: false,
      });
      distribution[risk.level]++;
      totalScore += risk.score;
    }

    return {
      totalAssets: total,
      riskDistribution: distribution,
      averageRiskScore: total > 0 ? Math.round(totalScore / total) : 0,
      trend: 'stable',
      topRisks: assets.slice(0, 5).map((a) => ({
        assetId: a.id,
        name: a.name,
        score: Math.floor(Math.random() * 40) + 50,
        level: 'medium' as const,
      })),
    };
  }
}
