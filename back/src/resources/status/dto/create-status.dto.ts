import { IsEnum, IsNumber, IsObject, IsString } from "class-validator";
import { StatusShipmentEnum } from "src/enums/status.shipment.enum";
import { Shipment } from "src/resources/shipments/entities/shipment.entity";
import { User } from "src/resources/users/entities/user.entity";

export class CreateStatusDto {
    
    user: User

    shipment: Shipment;
    
    @IsEnum(StatusShipmentEnum)
    libelle: StatusShipmentEnum;
}
