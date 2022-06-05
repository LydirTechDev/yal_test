import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWilayaDto {
  @ApiProperty({
    description: 'code wilaya ex: wilaya Alger code 16',
    type: String,
    minimum: 2,
    maximum: 2,
    required: true,
    example: '16'
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2)
  codeWilaya: string;

  @ApiProperty({
    description: 'nom wilaya en français ex: Alger',
    type: String,
    minimum: 3,
    maximum: 30,
    required: true,
    example: 'Alger',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30) 
  nomLatin: string;

  @ApiProperty({
    description: 'nom wilaya en arabe ex: اسم الولاية الجزائر',
    type: String,
    minimum: 3,
    maximum: 30,
    example: 'الجزائر'
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  nomArabe: string;


  @ApiProperty({
    description: " id de l'agence de retour de la wilaya",
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  agenceRetourId: number
}
