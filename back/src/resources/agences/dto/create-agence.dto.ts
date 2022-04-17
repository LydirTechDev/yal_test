import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AgencesTypesEnum } from 'src/enums/agencesTypesEnum';

export class CreateAgenceDto {
  @ApiProperty({
    description: 'agence Name ex: Kaidi',
    type: String,
    maxLength: 30,
    minLength: 3,
    required: true,
    example: 'Kaidi agence',
  })
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  nom: string;

  @ApiProperty({
    description: 'type Agence',
    enum: AgencesTypesEnum
  })
  @IsEnum(AgencesTypesEnum)
  type: AgencesTypesEnum;

  @ApiProperty({
    description: 'agence adresse ex: wilaya, commune, rue n°',
    maxLength: 90,
    minLength: 10,
    required: true,
    example: 'Alger Bordj El Kiffan, Kaidi, Zonne industriel',
  })
  @MaxLength(90)
  @MinLength(10)
  @IsString()
  adresse: string;

  @ApiProperty({
    description: 'numéro de registre du commerce',
    maxLength: 14,
    minLength: 14,
    required: true,
    example: '00000000000000',
  })
  @Length(14)
  @IsString()
  nrc: string;

  @ApiProperty({
    description: "numéro d'dentification fiscal",
    maxLength: 16,
    minLength: 16,
    required: true,
    example: '0000000000000000',
  })
  @Length(16)
  @IsString()
  nif: string;

  @ApiProperty({
    description: 'Numéro d’Identification Statistique',
    required: true,
  })
  @IsString()
  nis: string;

  @ApiProperty({
    description: '????????????',
  })
  @IsString()
  nAI: string;

  @ApiProperty({
    description: 'commune Id of this agence',
    type: Number,
    required: true,
    example: 1,
  })
  @IsNumber()
  communeId: number;
}
