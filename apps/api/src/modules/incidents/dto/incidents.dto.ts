import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';

export class CreateIncidentDTO {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['critical', 'high', 'medium', 'low'])
  severity!: string;

  @IsString()
  source!: string;

  @IsArray()
  @IsOptional()
  affectedAssets?: string[];
}

export class UpdateIncidentDTO {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  severity?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
