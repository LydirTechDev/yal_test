import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateCodeTarifDto {
  @IsString()
  nom: string;

  @IsNumber()
  serviceId: number;

  @IsBoolean()
  isStandard: boolean;
}
