import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { SecurityEvent } from '../../database/entities/security-event.entity';
import { CorrelationEngine } from '../correlation/correlation.engine';
import { EventsGateway } from '../../websocket/events.gateway';

export interface IngestEventDto {
  source: string;
  eventType: string;
  severity: string;
  category: string;
  message: string;
  sourceIp?: string;
  destinationIp?: string;
  port?: number;
  protocol?: string;
  userId?: string;
  assetId?: string;
  rawEvent?: Record<string, any>;
  timestamp?: Date;
}

export interface QueryEventsDto {
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
  severities?: string[];
  sources?: string[];
  sourceIp?: string;
  destinationIp?: string;
  userId?: string;
  assetId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class EventsService {
  private readonly logger = new Logger('EventsService');
  private eventBuffer: SecurityEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(
    @InjectRepository(SecurityEvent) private eventRepo: Repository<SecurityEvent>,
    private correlationEngine: CorrelationEngine,
    private wsGateway: EventsGateway,
  ) {
    this.startBufferFlush();
  }

  private startBufferFlush() {
    this.flushInterval = setInterval(() => this.flushBuffer(), 5000);
  }

  private async flushBuffer() {
    if (this.eventBuffer.length === 0) return;
    const events = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      await this.eventRepo.save(events);
      this.logger.debug(`Flushed ${events.length} events to database`);

      for (const event of events) {
        this.wsGateway.broadcastNewEvent(event);
        await this.correlationEngine.evaluateEvent(event);
      }
    } catch (err) {
      this.logger.error(`Failed to flush events: ${err}`);
      this.eventBuffer.unshift(...events);
    }
  }

  async ingestEvent(dto: IngestEventDto): Promise<SecurityEvent> {
    const event = this.eventRepo.create({
      source: dto.source,
      eventType: dto.eventType,
      severity: dto.severity as any,
      category: dto.category as any,
      message: dto.message,
      sourceIp: dto.sourceIp || null,
      destinationIp: dto.destinationIp || null,
      port: dto.port || null,
      protocol: dto.protocol || null,
      userId: dto.userId || null,
      assetId: dto.assetId || null,
      rawEvent: dto.rawEvent || null,
      timestamp: dto.timestamp || new Date(),
    });

    this.eventBuffer.push(event);

    if (this.eventBuffer.length >= 100) {
      await this.flushBuffer();
    }

    return event;
  }

  async ingestBatch(events: IngestEventDto[]): Promise<{ count: number }> {
    for (const dto of events) {
      await this.ingestEvent(dto);
    }
    return { count: events.length };
  }

  async queryEvents(query: QueryEventsDto): Promise<{ data: SecurityEvent[]; total: number }> {
    const qb = this.eventRepo.createQueryBuilder('e');

    if (query.startDate && query.endDate) {
      qb.andWhere('e.timestamp BETWEEN :startDate AND :endDate', {
        startDate: query.startDate,
        endDate: query.endDate,
      });
    }

    if (query.categories?.length) {
      qb.andWhere('e.category IN (:...categories)', { categories: query.categories });
    }

    if (query.severities?.length) {
      qb.andWhere('e.severity IN (:...severities)', { severities: query.severities });
    }

    if (query.sources?.length) {
      qb.andWhere('e.source IN (:...sources)', { sources: query.sources });
    }

    if (query.sourceIp) {
      qb.andWhere('e.sourceIp = :sourceIp', { sourceIp: query.sourceIp });
    }

    if (query.destinationIp) {
      qb.andWhere('e.destinationIp = :destinationIp', { destinationIp: query.destinationIp });
    }

    if (query.userId) {
      qb.andWhere('e.userId = :userId', { userId: query.userId });
    }

    if (query.assetId) {
      qb.andWhere('e.assetId = :assetId', { assetId: query.assetId });
    }

    if (query.search) {
      qb.andWhere('(e.message ILIKE :search OR e.eventType ILIKE :search)', { search: `%${query.search}%` });
    }

    const page = query.page || 1;
    const limit = Math.min(query.limit || 100, 1000);
    const sortBy = query.sortBy || 'timestamp';
    const sortOrder = query.sortOrder || 'DESC';

    qb.orderBy(`e.${sortBy}`, sortOrder);
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async getEventById(id: string): Promise<SecurityEvent | null> {
    return this.eventRepo.findOne({ where: { id } });
  }

  async getStats(): Promise<any> {
    const total = await this.eventRepo.count();

    const bySeverity = await this.eventRepo
      .createQueryBuilder('e')
      .select('e.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .groupBy('e.severity')
      .getRawMany();

    const byCategory = await this.eventRepo
      .createQueryBuilder('e')
      .select('e.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('e.category')
      .getRawMany();

    const bySource = await this.eventRepo
      .createQueryBuilder('e')
      .select('e.source', 'source')
      .addSelect('COUNT(*)', 'count')
      .groupBy('e.source')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const last24h = await this.eventRepo.count({
      where: { timestamp: Between(new Date(Date.now() - 86400000), new Date()) },
    });

    const last1h = await this.eventRepo.count({
      where: { timestamp: Between(new Date(Date.now() - 3600000), new Date()) },
    });

    return {
      total,
      last24h,
      last1h,
      bySeverity: bySeverity.reduce((acc, r) => ({ ...acc, [r.severity]: parseInt(r.count, 10) }), {}),
      byCategory: byCategory.reduce((acc, r) => ({ ...acc, [r.category]: parseInt(r.count, 10) }), {}),
      bySource: bySource.map(r => ({ source: r.source, count: parseInt(r.count, 10) })),
    };
  }

  async getTimeline(minutes = 60): Promise<any[]> {
    const start = new Date(Date.now() - minutes * 60 * 1000);
    return this.eventRepo
      .createQueryBuilder('e')
      .select("date_trunc('minute', e.timestamp)", 'time')
      .addSelect('COUNT(*)', 'count')
      .addSelect('e.severity', 'severity')
      .where('e.timestamp >= :start', { start })
      .groupBy("date_trunc('minute', e.timestamp), e.severity")
      .orderBy("date_trunc('minute', e.timestamp)", 'ASC')
      .getRawMany();
  }

  async getTopSourceIps(limit = 10): Promise<any[]> {
    return this.eventRepo
      .createQueryBuilder('e')
      .select('e.sourceIp', 'ip')
      .addSelect('COUNT(*)', 'events')
      .addSelect('COUNT(DISTINCT e.severity)', 'severityCount')
      .where('e.sourceIp IS NOT NULL')
      .andWhere('e.timestamp >= :start', { start: new Date(Date.now() - 86400000) })
      .groupBy('e.sourceIp')
      .orderBy('events', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async deleteOldEvents(daysToKeep = 90): Promise<{ deleted: number }> {
    const cutoff = new Date(Date.now() - daysToKeep * 86400000);
    const result = await this.eventRepo
      .createQueryBuilder()
      .delete()
      .where('timestamp < :cutoff', { cutoff })
      .execute();
    return { deleted: result.affected || 0 };
  }

  onModuleDestroy() {
    if (this.flushInterval) clearInterval(this.flushInterval);
  }
}
