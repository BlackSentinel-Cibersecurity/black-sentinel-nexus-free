import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { SecurityEvent } from '../../database/entities/security-event.entity';
import { CorrelationModule } from '../correlation/correlation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SecurityEvent]),
    CorrelationModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
