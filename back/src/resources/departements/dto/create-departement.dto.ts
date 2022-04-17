import { IsString } from "class-validator";

export class CreateDepartementDto {
    
    @IsString()
    nom: string;
}
