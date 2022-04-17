import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCoursierDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  isActive: string;

  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @Type(() => Date)
  @IsDate()
  dateNaissance: Date;

  @IsString()
  lieuNaissance: string;

  @IsString()
  adresse: string;

  @IsString()
  numTelephone: string;

  @Type(() => Date)
  @IsDate()
  dateRecrutement: Date;

  @IsString()
  typeContrat: string;

  @IsNumber()
  montantRamassage: number;

  @IsNumber()
  montantLivraison: number;

  @IsString()
  MarqueVehicule: string;

  @IsString()
  immatriculationVehicule: string;

  @IsNumber()
  agenceId: number;
}
