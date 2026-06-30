import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';

export class CreateEventDTO {
  @IsString()
  source!: string;

  @IsString()
  eventType!: string;

  @IsEnum(['critical', 'high', 'medium', 'low', 'info'])
  severity!: string;

  @IsString()
  message!: string;

  @IsString()
  @IsOptional()
  sourceIp?: string;

  @IsString()
  @IsOptional()
  destinationIp?: string;

  @IsNumber()
  @IsOptional()
  port?: number;

  @IsString()
  @IsOptional()
  protocol?: string;

  @IsString()
  @IsOptional()
  rawEvent?: string;
}
