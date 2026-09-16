import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Playbook,
  PlaybookExecution,
} from '../../database/entities/playbook.entity';

@Injectable()
export class PlaybooksService {
  constructor(
    @InjectRepository(Playbook) private playbookRepo: Repository<Playbook>,
    @InjectRepository(PlaybookExecution)
    private executionRepo: Repository<PlaybookExecution>,
  ) {
    this.seedPlaybooks();
  }

  private async seedPlaybooks() {
    if ((await this.playbookRepo.count()) > 0) return;
    const playbooks = [
      {
        name: 'Endpoint Containment',
        description: 'Isolate compromised endpoint from domain and network',
        trigger: 'CRITICAL incident from EDR',
        status: 'active',
        runsCount: 23,
        steps: [
          {
            id: '1',
            name: 'Isolate Endpoint',
            type: 'action' as const,
            config: { action: 'isolate_network' },
            order: 1,
          },
          {
            id: '2',
            name: 'Notify SOC',
            type: 'notification' as const,
            config: { channel: 'slack', message: 'Endpoint isolated' },
            order: 2,
          },
          {
            id: '3',
            name: 'Capture Evidence',
            type: 'action' as const,
            config: { action: 'forensic_capture' },
            order: 3,
          },
        ],
      },
      {
        name: 'Phishing Response',
        description: 'Extract malicious URLs, revoke credentials, notify user',
        trigger: 'Email classified as phishing',
        status: 'active',
        runsCount: 45,
        steps: [
          {
            id: '1',
            name: 'Extract IOCs',
            type: 'action' as const,
            config: { action: 'extract_urls' },
            order: 1,
          },
          {
            id: '2',
            name: 'Block URLs',
            type: 'action' as const,
            config: { action: 'block_urls' },
            order: 2,
          },
          {
            id: '3',
            name: 'Revoke Credentials',
            type: 'action' as const,
            config: { action: 'reset_password' },
            order: 3,
          },
          {
            id: '4',
            name: 'Notify User',
            type: 'notification' as const,
            config: { channel: 'email' },
            order: 4,
          },
        ],
      },
      {
        name: 'SOC Escalation',
        description: 'Escalate incidents to L2/L3 based on severity and SLA',
        trigger: 'Severity >= HIGH',
        status: 'active',
        runsCount: 112,
        steps: [
          {
            id: '1',
            name: 'Check SLA',
            type: 'condition' as const,
            config: { check: 'sla_breach' },
            order: 1,
          },
          {
            id: '2',
            name: 'Notify L2',
            type: 'notification' as const,
            config: { channel: 'pagerduty' },
            order: 2,
          },
        ],
      },
    ];
    for (const p of playbooks)
      await this.playbookRepo.save(this.playbookRepo.create(p));
  }

  async findAll() {
    return this.playbookRepo.find({ order: { createdAt: 'DESC' } });
  }
  async findById(id: string) {
    const p = await this.playbookRepo.findOne({ where: { id } });
    if (!p) throw new NotFoundException();
    return p;
  }
  async create(dto: Partial<Playbook>) {
    return this.playbookRepo.save(this.playbookRepo.create(dto));
  }
  async update(id: string, dto: Partial<Playbook>) {
    const p = await this.findById(id);
    Object.assign(p, dto);
    return this.playbookRepo.save(p);
  }
  async delete(id: string) {
    const p = await this.findById(id);
    await this.playbookRepo.remove(p);
  }

  async execute(id: string, triggeredBy?: any): Promise<PlaybookExecution> {
    const playbook = await this.findById(id);
    const stepResults = playbook.steps.map((s: any) => ({
      stepId: s.id,
      status: 'pending' as const,
    }));

    const execution = await this.executionRepo.save(
      this.executionRepo.create({
        playbookId: id,
        status: 'running',
        triggeredBy: triggeredBy || null,
        stepResults,
        startedAt: new Date(),
      }),
    );

    // Simulate step execution
    for (let i = 0; i < playbook.steps.length; i++) {
      execution.stepResults[i].status = 'running';
      execution.stepResults[i].startedAt = new Date();
      await this.executionRepo.save(execution);

      await new Promise((r) => setTimeout(r, 1000));

      execution.stepResults[i].status = 'completed';
      execution.stepResults[i].completedAt = new Date();
      execution.stepResults[i].output = {
        success: true,
        message: `Step ${playbook.steps[i].name} completed`,
      };
      await this.executionRepo.save(execution);
    }

    execution.status = 'completed';
    execution.completedAt = new Date();
    await this.executionRepo.save(execution);

    playbook.runsCount++;
    playbook.lastRunAt = new Date();
    await this.playbookRepo.save(playbook);

    return execution;
  }

  async getStats() {
    const total = await this.playbookRepo.count();
    const active = await this.playbookRepo.count({
      where: { status: 'active' },
    });
    const totalRuns =
      (
        await this.playbookRepo
          .createQueryBuilder('p')
          .select('SUM(p.runsCount)', 'sum')
          .getRawOne()
      )?.sum || 0;
    return { total, active, totalRuns: parseInt(totalRuns, 10) };
  }
}
