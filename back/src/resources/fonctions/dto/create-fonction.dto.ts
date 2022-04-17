import { IsNumber, IsString } from "class-validator";

export class CreateFonctionDto {


    @IsString()
    nom: string;
    
    @IsString()
    dureeEssai: string;

    @IsNumber()
    departementId: number;
}
