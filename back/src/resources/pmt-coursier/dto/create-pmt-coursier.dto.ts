import { IsNumber } from "class-validator";

export class CreatePmtCoursierDto {

    @IsNumber()
    coursierId:number

    @IsNumber()
    employeId:number

    @IsNumber()
    nbrColis:number

    @IsNumber()
    montantTotal:number


}
