import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ConnectorType =
  'syslog' | 'wec' | 'api' | 'agent' | 'cloud' | 'webhook' | 'custom';
export type ConnectorStatus = 'active' | 'inactive' | 'error' | 'configuring';
export type ConnectorCategory =
  | 'cloud'
  | 'siem'
  | 'edr'
  | 'network'
  | 'identity'
  | 'vulnerability'
  | 'threat_intel'
  | 'ticketing'
  | 'collaboration'
  | 'email'
  | 'database'
  | 'devops'
  | 'endpoint'
  | 'compliance'
  | 'custom';

@Entity('connectors')
export class Connector {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column({ type: 'varchar' })
  type!: ConnectorType;

  @Column({ type: 'varchar', default: 'inactive' })
  status!: ConnectorStatus;

  @Column({ type: 'varchar', default: 'custom' })
  category!: ConnectorCategory;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', nullable: true })
  icon!: string | null;

  @Column({ type: 'varchar', nullable: true })
  vendor!: string | null;

  @Column({ type: 'varchar', nullable: true })
  version!: string | null;

  @Column({ type: 'simple-json', nullable: true })
  config!: Record<string, any> | null;

  @Column({ type: 'simple-json', nullable: true })
  configSchema!: Record<string, any> | null;

  @Column({ type: 'simple-json', nullable: true })
  stats!: Record<string, any> | null;

  @Column({ type: 'int', default: 0 })
  eventsReceived!: number;

  @Column({ type: 'int', default: 0 })
  eventsProcessed!: number;

  @Column({ type: 'int', default: 0 })
  errorsCount!: number;

  @Column({ type: 'datetime', nullable: true })
  lastEventAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  lastErrorAt!: Date | null;

  @Column({ type: 'text', nullable: true })
  lastError!: string | null;

  @Column({ type: 'boolean', default: true })
  isEnabled!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
