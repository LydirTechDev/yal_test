import { PartialType } from '@nestjs/mapped-types';
import { CreateSacShipmentDto } from './create-sac-shipment.dto';

export class UpdateSacShipmentDto extends PartialType(CreateSacShipmentDto) {}
