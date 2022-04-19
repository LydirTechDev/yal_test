import { IsBoolean, IsNumber } from "class-validator";

export class CreateFactureDto {

    @IsNumber()
    clientId:number

    @IsNumber()
    montantTotal:number

    @IsNumber()
    employeId:number

    @IsNumber()
    nbrColis:number

    @IsBoolean()
    espece:boolean

}
