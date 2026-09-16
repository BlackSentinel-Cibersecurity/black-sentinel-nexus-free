import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityEvent } from '../../database/entities/security-event.entity';
import { Alert } from '../../database/entities/alert.entity';
import { CorrelationRule } from '../../database/entities/audit-log.entity';
import { EventsGateway } from '../../websocket/events.gateway';

interface CorrelationCondition {
  eventCount?: number;
  timeWindowMinutes?: number;
  sourceIp?: string;
  category?: string;
  severity?: string;
  sameSource?: boolean;
  sameDestination?: boolean;
  uniqueCount?: string;
}

@Injectable()
export class CorrelationEngine {
  private readonly logger = new Logger('CorrelationEngine');
  private rules: CorrelationRule[] = [];

  constructor(
    @InjectRepository(SecurityEvent)
    private eventRepo: Repository<SecurityEvent>,
    @InjectRepository(Alert) private alertRepo: Repository<Alert>,
    @InjectRepository(CorrelationRule)
    private ruleRepo: Repository<CorrelationRule>,
    private wsGateway: EventsGateway,
  ) {
    this.loadRules();
  }

  private async loadRules() {
    this.rules = await this.ruleRepo.find({ where: { isEnabled: true } });
    if (this.rules.length === 0) {
      await this.createDefaultRules();
      this.rules = await this.ruleRepo.find({ where: { isEnabled: true } });
    }
    this.logger.log(`Loaded ${this.rules.length} correlation rules`);
  }

  private async createDefaultRules() {
    // FREE VERSION: Only 2 rules (vs 5 in full version)
    const defaults = [
      {
        name: 'Brute Force Detection',
        description:
          'Multiple failed login attempts from same IP within 5 minutes',
        severity: 'high',
        conditions: {
          eventCount: 5,
          timeWindowMinutes: 5,
          category: 'authentication',
          sameSource: true,
        } as CorrelationCondition,
      },
      {
        name: 'Port Scan Detection',
        description:
          'Multiple connection attempts to different ports from same source',
        severity: 'medium',
        conditions: {
          eventCount: 10,
          timeWindowMinutes: 2,
          category: 'network',
          sameSource: true,
          uniqueCount: 'destinationPort',
        } as CorrelationCondition,
      },
    ];

    for (const rule of defaults) {
      await this.ruleRepo.save(this.ruleRepo.create(rule));
    }
    this.logger.log('Created default correlation rules');
  }

  async evaluateEvent(event: SecurityEvent): Promise<Alert[]> {
    const generatedAlerts: Alert[] = [];

    for (const rule of this.rules) {
      try {
        const matches = await this.evaluateRule(rule, event);
        if (matches) {
          const alert = await this.createAlertFromRule(rule, event);
          generatedAlerts.push(alert);
        }
      } catch (err) {
        this.logger.error(`Error evaluating rule ${rule.name}: ${err}`);
      }
    }

    return generatedAlerts;
  }

  private async evaluateRule(
    rule: CorrelationRule,
    event: SecurityEvent,
  ): Promise<boolean> {
    const cond = rule.conditions as CorrelationCondition;
    const windowMs = (cond.timeWindowMinutes || 5) * 60 * 1000;
    const windowStart = new Date(Date.now() - windowMs);

    const qb = this.eventRepo
      .createQueryBuilder('e')
      .where('e.timestamp >= :windowStart', { windowStart });

    if (cond.category) {
      qb.andWhere('e.category = :category', { category: cond.category });
    }

    if (cond.severity) {
      qb.andWhere('e.severity = :severity', { severity: cond.severity });
    }

    if (cond.sameSource && event.sourceIp) {
      qb.andWhere('e.sourceIp = :sourceIp', { sourceIp: event.sourceIp });
    }

    if (cond.sameDestination && event.destinationIp) {
      qb.andWhere('e.destinationIp = :destinationIp', {
        destinationIp: event.destinationIp,
      });
    }

    const count = await qb.getCount();

    if (cond.eventCount && count >= cond.eventCount) {
      rule.matchCount++;
      rule.lastMatchAt = new Date();
      await this.ruleRepo.save(rule);
      return true;
    }

    return false;
  }

  private async createAlertFromRule(
    rule: CorrelationRule,
    event: SecurityEvent,
  ): Promise<Alert> {
    const existingAlert = await this.alertRepo.findOne({
      where: {
        ruleId: rule.id,
        status: 'open',
        sourceIp: event.sourceIp || undefined,
      },
    });

    if (existingAlert) {
      existingAlert.occurrenceCount++;
      existingAlert.lastSeenAt = new Date();
      if (!existingAlert.eventIds) existingAlert.eventIds = [];
      existingAlert.eventIds.push(event.id);
      await this.alertRepo.save(existingAlert);
      this.wsGateway.broadcastAlertUpdate(existingAlert);
      return existingAlert;
    }

    const alert = this.alertRepo.create({
      title: rule.name,
      description: rule.description,
      severity: rule.severity as any,
      status: 'open',
      ruleId: rule.id,
      ruleName: rule.name,
      eventIds: [event.id],
      sourceIp: event.sourceIp,
      destinationIp: event.destinationIp,
      userId: event.userId,
      assetId: event.assetId,
      occurrenceCount: 1,
      firstSeenAt: event.timestamp,
      lastSeenAt: event.timestamp,
    });

    const saved = await this.alertRepo.save(alert);
    this.wsGateway.broadcastNewAlert(saved);
    this.logger.log(`Alert generated: ${saved.title} (${saved.severity})`);
    return saved;
  }

  async getActiveAlertsCount(): Promise<number> {
    return this.alertRepo.count({ where: { status: 'open' } });
  }

  async getAlertsBySeverity(): Promise<Record<string, number>> {
    const result = await this.alertRepo
      .createQueryBuilder('a')
      .select('a.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .where('a.status = :status', { status: 'open' })
      .groupBy('a.severity')
      .getRawMany();

    const counts: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    for (const row of result) {
      counts[row.severity] = parseInt(row.count, 10);
    }
    return counts;
  }
}
