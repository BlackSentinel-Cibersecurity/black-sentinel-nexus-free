import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus =
  | 'open'
  | 'acknowledged'
  | 'investigating'
  | 'resolved'
  | 'false_positive'
  | 'closed';

@Entity('alerts')
@Index(['severity'])
@Index(['status'])
@Index(['createdAt'])
@Index(['ruleId'])
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar' })
  severity!: AlertSeverity;

  @Column({ type: 'varchar', default: 'open' })
  status!: AlertStatus;

  @Column({ type: 'varchar', nullable: true })
  ruleId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  ruleName!: string | null;

  @Column({ type: 'simple-array', nullable: true })
  eventIds!: string[];

  @Column({ type: 'varchar', nullable: true })
  sourceIp!: string | null;

  @Column({ type: 'varchar', nullable: true })
  destinationIp!: string | null;

  @Column({ type: 'varchar', nullable: true })
  userId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  assetId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  assignedTo!: string | null;

  @Column({ type: 'varchar', nullable: true })
  incidentId!: string | null;

  @Column({ type: 'simple-json', nullable: true })
  metadata!: Record<string, any> | null;

  @Column({ type: 'int', default: 0 })
  occurrenceCount!: number;

  @Column({ type: 'datetime', nullable: true })
  firstSeenAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  lastSeenAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  acknowledgedAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  resolvedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
