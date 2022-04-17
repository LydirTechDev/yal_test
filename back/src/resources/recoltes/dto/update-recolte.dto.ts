import { PartialType } from '@nestjs/swagger';
import { CreateRecolteDto } from './create-recolte.dto';

export class UpdateRecolteDto extends PartialType(CreateRecolteDto) {}
