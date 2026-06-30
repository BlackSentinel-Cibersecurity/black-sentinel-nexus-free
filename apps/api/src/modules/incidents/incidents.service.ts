import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident, IncidentStatus } from '../../database/entities/incident.entity';

const VALID_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  new: ['triaged', 'investigating', 'closed'],
  triaged: ['investigating', 'closed'],
  investigating: ['contained', 'eradicated', 'closed'],
  contained: ['eradicated', 'investigating', 'closed'],
  eradicated: ['recovered', 'investigating', 'closed'],
  recovered: ['closed', 'investigating'],
  closed: [],
};

@Injectable()
export class IncidentsService {
  private counter = 0;

  constructor(
    @InjectRepository(Incident) private incidentRepo: Repository<Incident>,
  ) {
    this.initCounter();
  }

  private async initCounter() {
    const count = await this.incidentRepo.count();
    this.counter = count;
  }

  async findAll(filters?: {
    severity?: string;
    status?: string;
    assignedTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Incident[]; total: number }> {
    const where: any = {};
    if (filters?.severity) where.severity = filters.severity;
    if (filters?.status) where.status = filters.status;
    if (filters?.assignedTo) where.assignedTo = filters.assignedTo;

    const page = filters?.page || 1;
    const limit = filters?.limit || 50;

    const [data, total] = await this.incidentRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<Incident> {
    const incident = await this.incidentRepo.findOne({ where: { id } });
    if (!incident) throw new NotFoundException(`Incident ${id} not found`);
    return incident;
  }

  async create(dto: {
    title: string;
    description?: string;
    severity: string;
    source: string;
    assignedTo?: string;
    affectedAssetIds?: string[];
    relatedEventIds?: string[];
    mitreTechnique?: string;
  }): Promise<Incident> {
    this.counter++;
    const code = `INC-${new Date().getFullYear()}-${String(this.counter).padStart(4, '0')}`;

    const incident = this.incidentRepo.create({
      code,
      title: dto.title,
      description: dto.description || null,
      severity: dto.severity as any,
      status: 'new',
      source: dto.source,
      assignedTo: dto.assignedTo || null,
      affectedAssetIds: dto.affectedAssetIds || [],
      relatedEventIds: dto.relatedEventIds || [],
      mitreTechnique: dto.mitreTechnique || null,
      timeline: [{ timestamp: new Date(), action: 'created', details: 'Incident created' }],
    });

    return this.incidentRepo.save(incident);
  }

  async updateStatus(id: string, newStatus: IncidentStatus, userId?: string, notes?: string): Promise<Incident> {
    const incident = await this.findById(id);
    const currentStatus = incident.status as IncidentStatus;

    if (!VALID_TRANSITIONS[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from "${currentStatus}" to "${newStatus}". Valid transitions: ${VALID_TRANSITIONS[currentStatus]?.join(', ') || 'none'}`
      );
    }

    incident.status = newStatus;

    if (!incident.timeline) incident.timeline = [];
    incident.timeline.push({
      timestamp: new Date(),
      action: `status_changed`,
      user: userId,
      details: `Status changed from ${currentStatus} to ${newStatus}${notes ? `: ${notes}` : ''}`,
    });

    if (newStatus === 'triaged') incident.triagedAt = new Date();
    if (newStatus === 'contained') incident.containedAt = new Date();
    if (newStatus === 'closed') incident.closedAt = new Date();

    return this.incidentRepo.save(incident);
  }

  async update(id: string, dto: Partial<{
    title: string;
    description: string;
    severity: string;
    assignedTo: string;
    mitreTechnique: string;
  }>): Promise<Incident> {
    const incident = await this.findById(id);
    Object.assign(incident, dto);

    if (!incident.timeline) incident.timeline = [];
    incident.timeline.push({
      timestamp: new Date(),
      action: 'updated',
      details: `Incident updated: ${Object.keys(dto).join(', ')}`,
    });

    return this.incidentRepo.save(incident);
  }

  async addNote(id: string, user: string, content: string): Promise<Incident> {
    const incident = await this.findById(id);
    if (!incident.notes) incident.notes = [];
    incident.notes.push({ timestamp: new Date(), user, content });

    if (!incident.timeline) incident.timeline = [];
    incident.timeline.push({ timestamp: new Date(), action: 'note_added', user, details: content });

    return this.incidentRepo.save(incident);
  }

  async delete(id: string): Promise<void> {
    const incident = await this.findById(id);
    await this.incidentRepo.remove(incident);
  }

  async getStats(): Promise<any> {
    const total = await this.incidentRepo.count();

    const bySeverity = await this.incidentRepo
      .createQueryBuilder('i')
      .select('i.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .groupBy('i.severity')
      .getRawMany();

    const byStatus = await this.incidentRepo
      .createQueryBuilder('i')
      .select('i.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('i.status')
      .getRawMany();

    const open = await this.incidentRepo.count({ where: { status: 'new' as any } });
    const active = await this.incidentRepo.count({ where: { status: 'investigating' as any } });

    return {
      total,
      open,
      active,
      bySeverity: bySeverity.reduce((acc: any, r: any) => ({ ...acc, [r.severity]: parseInt(r.count, 10) }), {}),
      byStatus: byStatus.reduce((acc: any, r: any) => ({ ...acc, [r.status]: parseInt(r.count, 10) }), {}),
    };
  }
}
