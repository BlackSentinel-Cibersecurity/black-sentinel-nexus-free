import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export type AssetType = 'server' | 'workstation' | 'firewall' | 'router' | 'switch' | 'database' | 'cloud' | 'endpoint' | 'network' | 'container';
export type AssetStatus = 'active' | 'warning' | 'critical' | 'offline' | 'decommissioned';

@Entity('assets')
@Index(['type'])
@Index(['status'])
@Index(['riskScore'])
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column({ type: 'varchar' })
  type!: AssetType;

  @Column({ type: 'varchar', nullable: true })
  ip!: string | null;

  @Column({ type: 'varchar', nullable: true })
  mac!: string | null;

  @Column({ type: 'varchar', nullable: true })
  os!: string | null;

  @Column({ type: 'varchar', default: 'active' })
  status!: AssetStatus;

  @Column({ type: 'varchar', nullable: true })
  location!: string | null;

  @Column({ type: 'varchar', nullable: true })
  owner!: string | null;

  @Column({ type: 'varchar', nullable: true })
  department!: string | null;

  @Column({ type: 'int', default: 0 })
  riskScore!: number;

  @Column({ type: 'varchar', default: 'low' })
  riskLevel!: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata!: Record<string, any> | null;

  @Column({ type: 'simple-array', nullable: true })
  tags!: string[];

  @Column({ type: 'datetime', nullable: true })
  lastSeenAt!: Date | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
