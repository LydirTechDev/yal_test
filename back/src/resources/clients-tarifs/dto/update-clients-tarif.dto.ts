import { PartialType } from '@nestjs/mapped-types';
import { CreateClientsTarifDto } from './create-clients-tarif.dto';

export class UpdateClientsTarifDto extends PartialType(CreateClientsTarifDto) {}
