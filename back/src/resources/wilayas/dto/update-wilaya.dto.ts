import { PartialType } from '@nestjs/mapped-types';
import { CreateWilayaDto } from './create-wilaya.dto';

export class UpdateWilayaDto extends PartialType(CreateWilayaDto) {}
