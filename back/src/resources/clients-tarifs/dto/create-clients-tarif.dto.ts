import { IsNumber } from 'class-validator';

export class CreateClientsTarifDto {
  @IsNumber()
  clientId: number;

  @IsNumber()
  codeTarifId: number;
}
