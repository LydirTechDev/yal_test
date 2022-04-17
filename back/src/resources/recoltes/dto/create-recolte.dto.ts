import { IsNumber } from 'class-validator';

export class CreateRecolteDto {
  @IsNumber()
  id: number;
}
