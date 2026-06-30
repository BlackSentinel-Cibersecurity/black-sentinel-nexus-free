import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export type EventSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type EventCategory = 'authentication' | 'network' | 'malware' | 'data_exfiltration' | 'privilege_escalation' | 'policy_violation' | 'system' | 'application' | 'audit';

@Entity('security_events')
@Index(['timestamp', 'severity'])
@Index(['sourceIp'])
@Index(['destinationIp'])
@Index(['category'])
@Index(['severity'])
@Index(['source'])
export class SecurityEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  source!: string;

  @Column({ type: 'varchar' })
  eventType!: string;

  @Column({ type: 'varchar' })
  severity!: EventSeverity;

  @Column({ type: 'varchar' })
  category!: EventCategory;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'varchar', nullable: true })
  sourceIp!: string | null;

  @Column({ type: 'varchar', nullable: true })
  destinationIp!: string | null;

  @Column({ type: 'int', nullable: true })
  port!: number | null;

  @Column({ type: 'varchar', nullable: true })
  protocol!: string | null;

  @Column({ type: 'varchar', nullable: true })
  userId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  assetId!: string | null;

  @Column({ type: 'simple-json', nullable: true })
  enrichment!: Record<string, any> | null;

  @Column({ type: 'simple-json', nullable: true })
  rawEvent!: Record<string, any> | null;

  @Column({ type: 'varchar', nullable: true })
  correlationId!: string | null;

  @Column({ type: 'boolean', default: false })
  alertGenerated!: boolean;

  @Column({ type: 'varchar', nullable: true })
  alertId!: string | null;

  @Column({ type: 'datetime', default: () => 'NOW()' })
  timestamp!: Date;

  @CreateDateColumn()
  ingestedAt!: Date;
}
