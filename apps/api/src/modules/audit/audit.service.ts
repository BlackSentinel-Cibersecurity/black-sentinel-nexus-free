import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../database/entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
  ) {}

  async log(params: {
    userId?: string;
    userEmail?: string;
    action: string;
    resource: string;
    resourceId?: string;
    method?: string;
    endpoint?: string;
    statusCode?: number;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    const entry = this.auditRepo.create(params);
    return this.auditRepo.save(entry);
  }

  async findAll(filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ data: AuditLog[]; total: number }> {
    const qb = this.auditRepo.createQueryBuilder('a');

    if (filters?.userId)
      qb.andWhere('a.userId = :userId', { userId: filters.userId });
    if (filters?.action)
      qb.andWhere('a.action = :action', { action: filters.action });
    if (filters?.resource)
      qb.andWhere('a.resource = :resource', { resource: filters.resource });
    if (filters?.startDate)
      qb.andWhere('a.createdAt >= :startDate', {
        startDate: filters.startDate,
      });
    if (filters?.endDate)
      qb.andWhere('a.createdAt <= :endDate', { endDate: filters.endDate });

    qb.orderBy('a.createdAt', 'DESC');

    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }
}
