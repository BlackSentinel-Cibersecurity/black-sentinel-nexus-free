import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_logs')
@Index(['userId'])
@Index(['action'])
@Index(['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  userId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  userEmail!: string | null;

  @Column({ type: 'varchar' })
  action!: string;

  @Column({ type: 'varchar' })
  resource!: string;

  @Column({ type: 'varchar', nullable: true })
  resourceId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  method!: string | null;

  @Column({ type: 'varchar', nullable: true })
  endpoint!: string | null;

  @Column({ type: 'int', nullable: true })
  statusCode!: number | null;

  @Column({ type: 'simple-json', nullable: true })
  oldValues!: Record<string, any> | null;

  @Column({ type: 'simple-json', nullable: true })
  newValues!: Record<string, any> | null;

  @Column({ type: 'varchar', nullable: true })
  ipAddress!: string | null;

  @Column({ type: 'text', nullable: true })
  userAgent!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity('correlation_rules')
export class CorrelationRule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar' })
  severity!: string;

  @Column({ type: 'simple-json' })
  conditions!: Record<string, any>;

  @Column({ type: 'varchar', default: 'active' })
  status!: string;

  @Column({ type: 'int', default: 0 })
  matchCount!: number;

  @Column({ type: 'datetime', nullable: true })
  lastMatchAt!: Date | null;

  @Column({ type: 'boolean', default: true })
  isEnabled!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt!: Date | null;
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar' })
  type!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'varchar', default: 'unread' })
  status!: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata!: Record<string, any> | null;

  @Column({ type: 'varchar', nullable: true })
  relatedEntityType!: string | null;

  @Column({ type: 'varchar', nullable: true })
  relatedEntityId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
