import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Nom du service',
    type: String,
    maxLength: 3,
    minLength: 50,
    example: 'E-Commerce Express Entreprise',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  nom: string;
}
