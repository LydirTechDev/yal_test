import { IsNumber } from "class-validator";

export class CreateSacShipmentDto {
    
    @IsNumber()
    shipmentId: number;
    
    @IsNumber()
    sacId: number;
}
