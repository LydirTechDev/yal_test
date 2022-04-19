import {
  isNumber,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateShipmentByServiceClientDto {
  @IsString()
  adresse: string;

  @IsString()
  adresseExp: string;

  @IsNumber()
  communeId: number;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  raisonSociale: string;

  @IsString()
  nom: string = '';

  @IsString()
  prenom: string = '';

  @IsString()
  telephone: string;

  @IsString()
  numIdentite: string;

  @IsString()
  raisonSocialeExp: string;

  @IsString()
  nomExp: string;

  @IsString()
  prenomExp: string;

  @IsString()
  telephoneExp: string;

  @IsNumber()
  wilayaId: number;

  @IsString()
  designationProduit: string;

  @IsNumber()
  prixEstimer: number = 0;

  @IsNumber()
  poids: number = 0;

  @IsNumber()
  longueur: number = 0;

  @IsNumber()
  largeur: number = 0;

  @IsNumber()
  hauteur: number = 0;
}
