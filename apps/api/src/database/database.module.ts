import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  UserSettings,
  SecurityEvent,
  Incident,
  Alert,
  Asset,
  Connector,
  Playbook,
  PlaybookExecution,
  ThreatIndicator,
  ThreatFeed,
  AuditLog,
  CorrelationRule,
  Notification,
} from './entities';

const entities = [
  User,
  UserSettings,
  SecurityEvent,
  Incident,
  Alert,
  Asset,
  Connector,
  Playbook,
  PlaybookExecution,
  ThreatIndicator,
  ThreatFeed,
  AuditLog,
  CorrelationRule,
  Notification,
];

const isDev = process.env.NODE_ENV !== 'production';
const usePostgres = process.env.DB_HOST || process.env.USE_PG;

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(
      usePostgres
        ? {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'black_sentinel',
            entities,
            synchronize: isDev,
            logging: isDev,
            ssl:
              process.env.DB_SSL === 'true'
                ? { rejectUnauthorized: false }
                : false,
          }
        : {
            type: 'better-sqlite3',
            database: 'black_sentinel.db',
            entities,
            synchronize: isDev,
            logging: false,
          },
    ),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
