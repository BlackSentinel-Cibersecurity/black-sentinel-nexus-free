import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaybooksService } from './playbooks.service';
import { PlaybooksController } from './playbooks.controller';
import { Playbook, PlaybookExecution } from '../../database/entities/playbook.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playbook, PlaybookExecution])],
  controllers: [PlaybooksController],
  providers: [PlaybooksService],
  exports: [PlaybooksService],
})
export class PlaybooksModule {}
