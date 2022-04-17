import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { JourSemaineEnum } from 'src/enums/JourSemaineEnum';

export class CreateCommuneDto {
  @ApiProperty({
    description: 'Code postal commune ex: 16031 Bordj El Kiffan',
    type: String,
    maxLength: 5,
    minLength: 5,
    example: '16031',
  })
  @Length(5)
  @IsString()
  codePostal: string;

  @ApiProperty({
    description: 'nom commune en français ex : Bordj El Kiffan',
    type: String,
    maxLength: 30,
    minLength: 3,
    example: 'Bordj El Kiffan',
  })
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  nomLatin: string;

  @ApiProperty({
    description: 'nom commune en Arabe ex : برج الكيفان',
    type: String,
    maxLength: 30,
    minLength: 3,
    example: 'برج الكيفان',
    required: true,
  })
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  nomArabe: string;

  @ApiProperty({
    description: 'delivery days',
    isArray: true,
    enum: JourSemaineEnum,
    example: [JourSemaineEnum.Dimanche, JourSemaineEnum.Lundi],
    required: true,
  })
  @IsEnum(JourSemaineEnum, { each: true })
  journeeLivraison: JourSemaineEnum[];

  @ApiProperty({
    description: 'si la commune offre le service de livraison à domicile',
    type: Boolean,
    example: true,
    required: true,
  })
  @IsBoolean()
  livraisonDomicile: boolean;

  @ApiProperty({
    description: 'si la commune offre le service de livraison Stop desck',
    type: Boolean,
    example: true,
    required: true,
  })
  @IsBoolean()
  livraisonStopDesck: boolean;

  @ApiProperty({
    description: 'si la coomune offre le service de stockage',
    type: Boolean,
    example: false,
    required: true,
  })
  @IsBoolean()
  stockage: boolean;

  @ApiProperty({
    description: 'si la commune est livrable ou pas',
    type: Boolean,
    example: true,
    required: true,
  })
  @IsBoolean()
  livrable?: boolean;

  @ApiProperty({
    description: ' id wilaya de la commune',
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  wilayaId: number;
}
