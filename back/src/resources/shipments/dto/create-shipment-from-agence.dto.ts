import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Commune } from 'src/resources/communes/entities/commune.entity';
import { ExpiditeurPublic } from 'src/resources/expiditeur-public/entities/expiditeur-public.entity';
import { Service } from 'src/resources/services/entities/service.entity';
import { User } from 'src/resources/users/entities/user.entity';

export class CreateShipmentFromAgenceDto {
  @IsString()
  raisonSociale: string;

  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsString()
  telephone: string;

  @IsString()
  adresse: string;

  @IsString()
  designationProduit: string;

  @IsObject()
  service: Service;

  @IsObject()
  commune: Commune;

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

  @IsObject()
  createdBy: User;
  
  @IsBoolean()
  livraisonStopDesck: boolean = true;

  @IsBoolean()
  livraisonDomicile: boolean = !this.livraisonStopDesck;

  @IsObject()
  expiditeurPublic: ExpiditeurPublic;
}
