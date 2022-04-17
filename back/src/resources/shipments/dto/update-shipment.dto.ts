import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateShipmentDto } from './create-shipment.dto';

export class UpdateShipmentDto extends PartialType(CreateShipmentDto) {

    @IsString()
    // @MinLength(3)
    @MaxLength(50)
    adresse?: string;
}
