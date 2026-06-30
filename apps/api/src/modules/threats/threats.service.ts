import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThreatIndicator, ThreatFeed } from '../../database/entities/threat.entity';

@Injectable()
export class ThreatsService {
  constructor(
    @InjectRepository(ThreatIndicator) private iocRepo: Repository<ThreatIndicator>,
    @InjectRepository(ThreatFeed) private feedRepo: Repository<ThreatFeed>,
  ) {
    this.seedData();
  }

  private async seedData() {
    if ((await this.iocRepo.count()) > 0) return;

    const iocs = [
      { type: 'ip' as const, value: '185.220.101.45', threatType: 'apt' as const, name: 'APT29 C2 Server', severity: 'critical', confidence: 92, source: 'MITRE ATT&CK', tags: ['russia', 'apt29'], mitreTechnique: 'T1071.001' },
      { type: 'hash_sha256' as const, value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', threatType: 'malware' as const, name: 'LockBit 4.0 Sample', severity: 'critical', confidence: 95, source: 'VirusTotal', tags: ['ransomware', 'lockbit'] },
      { type: 'domain' as const, value: 'phishing-example.com', threatType: 'ioc' as const, name: 'Phishing Kit Domain', severity: 'high', confidence: 88, source: 'PhishTank', tags: ['phishing', 'microsoft'] },
      { type: 'ip' as const, value: '91.215.85.142', threatType: 'ioc' as const, name: 'Emotet C2', severity: 'high', confidence: 78, source: 'Abuse.ch', tags: ['emotet', 'banking-trojan'] },
      { type: 'url' as const, value: 'https://malware-delivery.example.com/payload.exe', threatType: 'malware' as const, name: 'Malware Delivery URL', severity: 'critical', confidence: 90, source: 'URLhaus', tags: ['malware', 'dropper'] },
    ];
    for (const ioc of iocs) await this.iocRepo.save(this.iocRepo.create({ ...ioc, firstSeenAt: new Date(Date.now() - 86400000 * 30), lastSeenAt: new Date() }));

    const feeds = [
      { name: 'AlienVault OTX', url: 'https://otx.alienvault.com/api/v1/pulses/subscribed', format: 'stix', indicatorsCount: 15420 },
      { name: 'MISP Galaxy', url: 'https://misp-galaxy.com/events', format: 'misp', indicatorsCount: 8750 },
      { name: 'Abuse.ch URLhaus', url: 'https://urlhaus-api.abuse.ch/v1/urls/recent', format: 'json', indicatorsCount: 23100 },
    ];
    for (const feed of feeds) await this.feedRepo.save(this.feedRepo.create({ ...feed, lastFetchedAt: new Date() }));
  }

  async findAllIndicators(filters?: { type?: string; severity?: string; page?: number; limit?: number }) {
    const where: any = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.severity) where.severity = filters.severity;

    const page = filters?.page || 1;
    const limit = filters?.limit || 100;

    const [data, total] = await this.iocRepo.findAndCount({
      where,
      order: { lastSeenAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async searchIndicators(query: string) {
    return this.iocRepo
      .createQueryBuilder('i')
      .where('i.value ILIKE :q OR i.name ILIKE :q OR i.tags ILIKE :q', { q: `%${query}%` })
      .orderBy('i.lastSeenAt', 'DESC')
      .limit(50)
      .getMany();
  }

  async getFeeds() { return this.feedRepo.find({ order: { createdAt: 'DESC' } }); }

  async correlateIOC(value: string) {
    const ioc = await this.iocRepo.findOne({ where: { value } });
    if (!ioc) return { found: false, message: 'IOC not found in threat intelligence database' };
    return { found: true, indicator: ioc, riskScore: ioc.confidence };
  }

  async getStats() {
    const total = await this.iocRepo.count();
    const byType = await this.iocRepo.createQueryBuilder('i').select('i.threatType', 'type').addSelect('COUNT(*)', 'count').groupBy('i.threatType').getRawMany();
    const bySeverity = await this.iocRepo.createQueryBuilder('i').select('i.severity', 'severity').addSelect('COUNT(*)', 'count').groupBy('i.severity').getRawMany();
    const feeds = await this.feedRepo.count();
    return { total, feeds, byType: byType.reduce((a: any, r: any) => ({ ...a, [r.type]: parseInt(r.count, 10) }), {}), bySeverity: bySeverity.reduce((a: any, r: any) => ({ ...a, [r.severity]: parseInt(r.count, 10) }), {}) };
  }
}
