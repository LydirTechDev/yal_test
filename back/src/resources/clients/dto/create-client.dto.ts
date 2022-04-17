import { Type } from 'class-transformer';
import { IsEmail, IsString, IsNumber, IsArray, IsEnum } from 'class-validator';
import { JourSemaineEnum } from 'src/enums/JourSemaineEnum';

export class CreateClientDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  isActive: string;

  @IsString()
  raisonSociale: string;

  @IsString()
  nomCommercial: string;

  @IsString()
  nomGerant: string;

  @IsString()
  prenomGerant: string;

  @IsString()
  adresse: string;

  @IsString()
  telephone: string;

  @Type(() => Number)
  @IsNumber()
  communeResidenceId: number;

  @IsString()
  nrc: string;

  @IsString()
  nif: string;

  @IsString()
  nis: string;

  @Type(() => Number)
  @IsNumber()
  nbEnvoiMin: number;

  @Type(() => Number)
  @IsNumber()
  nbEnvoiMax: number;

  @Type(() => Number)
  @IsNumber()
  nbTentative: number;

  @Type(() => Number)
  @IsNumber()
  poidsBase: number;

  @Type(() => Number)
  @IsNumber()
  tauxCOD: number;

  @IsString()
  moyenPayement: string;

  // @IsEnum(JourSemaineEnum, { each: true })
  // jourPayement: JourSemaineEnum[];

  @Type(() => Number)
  @IsNumber()
  tarifRetour: number;

  @Type(() => Number)
  @IsNumber()
  communeDepartId: number;

  @Type(() => Number)
  @IsNumber()
  agenceRetourId: number;

  @Type(() => Number)
  @IsNumber()
  caisseAgenceId: number;

  @IsArray()
  typeTarif: Array<any>;
}
