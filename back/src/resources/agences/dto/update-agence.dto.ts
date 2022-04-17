import { PartialType } from '@nestjs/mapped-types';
import { CreateAgenceDto } from './create-agence.dto';

export class UpdateAgenceDto extends PartialType(CreateAgenceDto) {}
