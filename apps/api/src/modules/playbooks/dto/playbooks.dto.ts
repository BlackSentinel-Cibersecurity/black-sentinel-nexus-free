import { IsString, IsOptional } from 'class-validator';

export class CreatePlaybookDTO {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  trigger!: string;

  @IsString()
  @IsOptional()
  steps?: string;
}

export class ExecutePlaybookDTO {
  @IsString()
  @IsOptional()
  incidentId?: string;

  @IsString()
  @IsOptional()
  triggeredBy?: string;
}
