import { PartialType } from '@nestjs/mapped-types';
import { CreateFonctionDto } from './create-fonction.dto';

export class UpdateFonctionDto extends PartialType(CreateFonctionDto) {}
