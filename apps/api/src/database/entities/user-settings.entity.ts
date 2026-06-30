import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({ type: 'varchar', default: 'es' })
  language!: string;

  @Column({ type: 'varchar', default: 'America/New_York' })
  timezone!: string;

  @Column({ type: 'varchar', default: 'dark' })
  theme!: string;

  @Column({ type: 'simple-json', nullable: true })
  notifications!: {
    criticalIncidents?: boolean;
    weeklyReports?: boolean;
    threatAlerts?: boolean;
    emailDigest?: boolean;
  } | null;

  @Column({ type: 'simple-json', nullable: true })
  security!: {
    mfaEnabled?: boolean;
    sessionTimeout?: number;
    ipWhitelist?: string[];
  } | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
