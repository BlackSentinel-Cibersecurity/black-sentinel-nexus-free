import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export type IOCType = 'ip' | 'domain' | 'url' | 'hash_md5' | 'hash_sha1' | 'hash_sha256' | 'email' | 'file_path';
export type ThreatType = 'ioc' | 'apt' | 'malware' | 'vulnerability' | 'campaign' | 'tool';

@Entity('threat_indicators')
@Index(['type'])
@Index(['value'])
@Index(['severity'])
export class ThreatIndicator {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  type!: IOCType;

  @Column({ type: 'varchar' })
  value!: string;

  @Column({ type: 'varchar' })
  threatType!: ThreatType;

  @Column({ type: 'varchar', nullable: true })
  name!: string | null;

  @Column({ type: 'varchar', default: 'medium' })
  severity!: string;

  @Column({ type: 'int', default: 50 })
  confidence!: number;

  @Column({ type: 'varchar', nullable: true })
  source!: string | null;

  @Column({ type: 'simple-array', nullable: true })
  tags!: string[];

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', nullable: true })
  mitreTechnique!: string | null;

  @Column({ type: 'datetime', nullable: true })
  firstSeenAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  lastSeenAt!: Date | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity('threat_feeds')
export class ThreatFeed {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column({ type: 'varchar' })
  url!: string;

  @Column({ type: 'varchar', default: 'stix' })
  format!: string;

  @Column({ type: 'varchar', default: 'active' })
  status!: string;

  @Column({ type: 'int', default: 0 })
  indicatorsCount!: number;

  @Column({ type: 'datetime', nullable: true })
  lastFetchedAt!: Date | null;

  @Column({ type: 'int', default: 3600 })
  fetchIntervalSeconds!: number;

  @Column({ type: 'boolean', default: true })
  isEnabled!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
