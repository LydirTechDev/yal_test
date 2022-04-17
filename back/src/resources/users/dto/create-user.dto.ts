import { IsBoolean, IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { TypeUserEnum } from 'src/enums/TypeUserEnum';

export class CreateUserDto {
  @IsEmail()
  @Length(13, 30)
  email: string;

  @IsString()
  @Length(6, 16)
  password: string;


  @IsBoolean()
  isActive: boolean;

  @IsEnum(TypeUserEnum)
  typeUser: TypeUserEnum;
}
