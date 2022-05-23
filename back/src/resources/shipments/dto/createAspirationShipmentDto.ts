import {
  IsBoolean,
  IsNumber,
  IsString,
  Matches,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAspirationShipmentDto {
  @IsNumber()
  idRaw: number;
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  raisonSociale: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  nom: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  prenom: string;

  @IsString()
  @MinLength(10)
  @MaxLength(10)
  telephone: string;

  @IsString()
  // @MinLength(3)
  @MaxLength(50)
  adresse: string;

  @IsString()
  @MinLength(3)
  @MaxLength(15)
  numCommande: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  designationProduit: string;

  @IsNumber()
  serviceId: number;

  @IsString()
  @MinLength(3)
  @MaxLength(45)
  commune: string;

  @IsNumber()
  prixVente: number;
  @IsNumber()
  prixEstimer: number;
  @IsNumber()
  poids: number;

  @IsNumber()
  longueur: number;
  
  @IsNumber()
  largeur: number;
  
  @IsNumber()
  hauteur: number;

  @IsString()
  echange = false;
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  objetRecuperer?: string;

  @IsBoolean()
  livraisonGratuite: boolean;

  @IsBoolean()
  ouvrireColis: string;

  @IsBoolean()
  livraisonStopDesck = true;

  @IsBoolean()
  livraisonDomicile = !this.livraisonStopDesck;

  @IsNumber()
  createdBy = null;
}
