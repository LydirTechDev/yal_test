import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  ValidateNested,
  IsEmail,
  IsDate,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { TypeUserEnum } from 'src/enums/TypeUserEnum';
import { CreateUserDto } from 'src/resources/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/resources/users/dto/update-user.dto';

export class CreateEmployeDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(TypeUserEnum)
  @Type(() => Number)
  typeUser: TypeUserEnum;

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

  @IsString()
  nss: string;

  @IsString()
  numCompteBancaire: string;

  @IsString()
  genre: string;

  @IsString()
  groupeSanguin: string;

  @Type(() => Date)
  @IsDate()
  dateRecrutement: Date;

  @IsString()
  typeContrat: string;

  @IsNumber()
  banqueId: number;

  @IsNumber()
  fonctionId: number;

  @IsNumber()
  agenceId: number;
}
