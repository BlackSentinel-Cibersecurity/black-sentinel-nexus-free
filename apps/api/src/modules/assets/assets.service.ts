import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../../database/entities/asset.entity';

@Injectable()
export class AssetsService {
  constructor(@InjectRepository(Asset) private assetRepo: Repository<Asset>) {
    this.seedAssets();
  }

  private async seedAssets() {
    const count = await this.assetRepo.count();
    if (count > 0) return;

    // FREE VERSION: Only 4 assets (vs 8 in full version)
    const assets = [
      {
        name: 'WEB-PROD-01',
        type: 'server' as const,
        ip: '10.0.1.10',
        os: 'Ubuntu 22.04',
        status: 'critical' as const,
        riskScore: 92,
        riskLevel: 'critical',
        location: 'US-East',
      },
      {
        name: 'DB-PRIMARY',
        type: 'database' as const,
        ip: '10.0.1.20',
        os: 'PostgreSQL 15',
        status: 'warning' as const,
        riskScore: 87,
        riskLevel: 'critical',
        location: 'US-East',
      },
      {
        name: 'FW-NORTH',
        type: 'firewall' as const,
        ip: '10.0.0.1',
        os: 'FortiOS 7.2',
        status: 'active' as const,
        riskScore: 45,
        riskLevel: 'low',
        location: 'US-East',
      },
      {
        name: 'API-GW-01',
        type: 'server' as const,
        ip: '10.0.1.30',
        os: 'Amazon Linux 2',
        status: 'active' as const,
        riskScore: 78,
        riskLevel: 'high',
        location: 'US-West',
      },
    ];

    for (const a of assets) {
      await this.assetRepo.save(
        this.assetRepo.create({ ...a, lastSeenAt: new Date() }),
      );
    }
  }

  async findAll(filters?: {
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.status) where.status = filters.status;

    const page = filters?.page || 1;
    const limit = filters?.limit || 100;

    const [data, total] = await this.assetRepo.findAndCount({
      where,
      order: { riskScore: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findById(id: string) {
    const asset = await this.assetRepo.findOne({ where: { id } });
    if (!asset) throw new NotFoundException(`Asset ${id} not found`);
    return asset;
  }

  async create(dto: Partial<Asset>) {
    return this.assetRepo.save(this.assetRepo.create(dto));
  }

  async update(id: string, dto: Partial<Asset>) {
    const asset = await this.findById(id);
    Object.assign(asset, dto);
    return this.assetRepo.save(asset);
  }

  async delete(id: string) {
    const asset = await this.findById(id);
    await this.assetRepo.remove(asset);
  }

  async getDigitalTwin() {
    const assets = await this.assetRepo.find({ where: { isActive: true } });
    const nodes = assets.map((a, i) => ({
      id: a.id,
      type: a.type,
      label: a.name,
      status: a.status === 'active' ? 'healthy' : a.status,
      riskLevel: a.riskLevel,
      x: Math.cos(i * ((2 * Math.PI) / assets.length)) * 4,
      y: Math.sin(i * ((2 * Math.PI) / assets.length)) * 2,
      z: (Math.random() - 0.5) * 4,
    }));

    const edges: any[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.6) {
          edges.push({
            source: nodes[i].id,
            target: nodes[j].id,
            status: Math.random() > 0.9 ? 'compromised' : 'active',
          });
        }
      }
    }

    return { nodes, edges };
  }

  async getStats() {
    const total = await this.assetRepo.count();
    const byType = await this.assetRepo
      .createQueryBuilder('a')
      .select('a.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('a.type')
      .getRawMany();
    const byStatus = await this.assetRepo
      .createQueryBuilder('a')
      .select('a.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('a.status')
      .getRawMany();

    return {
      total,
      byType: byType.reduce(
        (acc: any, r: any) => ({ ...acc, [r.type]: parseInt(r.count, 10) }),
        {},
      ),
      byStatus: byStatus.reduce(
        (acc: any, r: any) => ({ ...acc, [r.status]: parseInt(r.count, 10) }),
        {},
      ),
    };
  }
}
