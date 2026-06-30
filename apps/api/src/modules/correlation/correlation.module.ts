import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityEvent } from '../../database/entities/security-event.entity';
import { Alert } from '../../database/entities/alert.entity';
import { CorrelationRule } from '../../database/entities/audit-log.entity';
import { CorrelationEngine } from './correlation.engine';

@Module({
  imports: [TypeOrmModule.forFeature([SecurityEvent, Alert, CorrelationRule])],
  providers: [CorrelationEngine],
  exports: [CorrelationEngine],
})
export class CorrelationModule {}
