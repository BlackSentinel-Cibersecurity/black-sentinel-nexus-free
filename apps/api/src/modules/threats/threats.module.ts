import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreatsService } from './threats.service';
import { ThreatsController } from './threats.controller';
import { ThreatIndicator, ThreatFeed } from '../../database/entities/threat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThreatIndicator, ThreatFeed])],
  controllers: [ThreatsController],
  providers: [ThreatsService],
  exports: [ThreatsService],
})
export class ThreatsModule {}
