import { IsEnum, IsNumber, Matches } from "class-validator";
import { SacTypeEnum } from "src/enums/sacTypeEnum";
// import { IsNull } from "typeorm";

export class CreateSacDto {
    // @Matches(/^sac-\d{3}\w{3}$/i)
    tracking: string;

    @IsEnum(SacTypeEnum)
    typeSac: SacTypeEnum;
    
    @IsNumber()
    userId: number;

    @IsNumber()
    wilayaDestination: number;

    @IsNumber()
    agenceDestination?: number
}
