import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateInterneShipmentDto {
  @IsNumber()
  userId: number;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  designation: string;
}
