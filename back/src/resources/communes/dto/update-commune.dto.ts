import { PartialType } from '@nestjs/mapped-types';
import { CreateCommuneDto } from './create-commune.dto';

export class UpdateCommuneDto extends PartialType(CreateCommuneDto) {}
