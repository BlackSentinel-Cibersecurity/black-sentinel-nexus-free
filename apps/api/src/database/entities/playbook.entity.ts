import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('playbooks')
export class Playbook {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar' })
  trigger!: string;

  @Column({ type: 'varchar', default: 'draft' })
  status!: string;

  @Column({ type: 'simple-json', default: () => "'[]'" })
  steps!: Array<{
    id: string;
    name: string;
    // FREE VERSION: 3 types (vs 4 in full - no 'integration' type)
    type: 'action' | 'condition' | 'notification';
    config: Record<string, any>;
    order: number;
  }>;

  @Column({ type: 'int', default: 0 })
  runsCount!: number;

  @Column({ type: 'datetime', nullable: true })
  lastRunAt!: Date | null;

  @Column({ type: 'boolean', default: true })
  isEnabled!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity('playbook_executions')
export class PlaybookExecution {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  playbookId!: string;

  @Column({ type: 'varchar', default: 'running' })
  status!: string;

  @Column({ type: 'simple-json', nullable: true })
  triggeredBy!: Record<string, any> | null;

  @Column({ type: 'simple-json', default: () => "'[]'" })
  stepResults!: Array<{
    stepId: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startedAt?: Date;
    completedAt?: Date;
    output?: any;
    error?: string;
  }>;

  @Column({ type: 'text', nullable: true })
  error!: string | null;

  @Column({ type: 'datetime', nullable: true })
  startedAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  completedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;
}
