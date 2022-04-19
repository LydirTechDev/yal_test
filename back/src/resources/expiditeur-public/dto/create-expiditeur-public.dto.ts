import { IsString } from 'class-validator';

export class CreateExpiditeurPublicDto {
  @IsString()
  adresseExp: string;

  @IsString()
  raisonSocialeExp: string;

  @IsString()
  nomExp: string;

  @IsString()
  prenomExp: string;

  @IsString()
  telephoneExp: string;

  @IsString()
  numIdentite: string;
}
