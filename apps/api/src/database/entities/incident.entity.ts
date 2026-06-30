import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'new' | 'triaged' | 'investigating' | 'contained' | 'eradicated' | 'recovered' | 'closed';

@Entity('incidents')
@Index(['severity'])
@Index(['status'])
@Index(['createdAt'])
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  code!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar' })
  severity!: IncidentSeverity;

  @Column({ type: 'varchar', default: 'new' })
  status!: IncidentStatus;

  @Column({ type: 'varchar' })
  source!: string;

  @Column({ type: 'varchar', nullable: true })
  assignedTo!: string | null;

  @Column({ type: 'simple-array', nullable: true })
  affectedAssetIds!: string[];

  @Column({ type: 'simple-array', nullable: true })
  relatedEventIds!: string[];

  @Column({ type: 'varchar', nullable: true })
  mitreTechnique!: string | null;

  @Column({ type: 'simple-json', nullable: true })
  timeline!: Array<{ timestamp: Date; action: string; user?: string; details?: string }> | null;

  @Column({ type: 'simple-json', nullable: true })
  notes!: Array<{ timestamp: Date; user: string; content: string }> | null;

  @Column({ type: 'int', nullable: true })
  riskScore!: number | null;

  @Column({ type: 'datetime', nullable: true })
  slaDeadline!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  triagedAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  containedAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  closedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
