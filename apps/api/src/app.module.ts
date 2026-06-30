import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';
import { AssetsModule } from './modules/assets/assets.module';
import { UsersModule } from './modules/users/users.module';
import { ThreatsModule } from './modules/threats/threats.module';
import { ConnectorsModule } from './modules/connectors/connectors.module';
import { PlaybooksModule } from './modules/playbooks/playbooks.module';
import { AIModule } from './modules/ai/ai.module';
import { DigitalTwinModule } from './modules/digital-twin/digital-twin.module';
import { ReportsModule } from './modules/reports/reports.module';
import { PredictionModule } from './modules/prediction/prediction.module';
import { RiskModule } from './modules/risk/risk.module';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { CommonModule } from './common/common.module';
import { WebsocketModule } from './websocket/websocket.module';
import { CorrelationModule } from './modules/correlation/correlation.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuditModule } from './modules/audit/audit.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    DatabaseModule,

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),

    // Scheduling
    ScheduleModule.forRoot(),

    // Event emitter
    EventEmitterModule.forRoot(),

    // WebSocket
    WebsocketModule,

    // Common
    CommonModule,

    // Core services
    CorrelationModule,
    NotificationsModule,
    AuditModule,

    // Feature modules
    AuthModule,
    EventsModule,
    AssetsModule,
    UsersModule,
    ThreatsModule,
    ConnectorsModule,
    PlaybooksModule,
    AIModule,
    DigitalTwinModule,
    ReportsModule,
    PredictionModule,
    RiskModule,
    IncidentsModule,
    SettingsModule,
  ],
})
export class AppModule implements NestModule {
  configure(_consumer: MiddlewareConsumer) {
    // Apply middleware to all routes
  }
}
