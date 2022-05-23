import { PartialType } from '@nestjs/mapped-types';
import { CreateRecolteFactureDto } from './create-recolte-facture.dto';

export class UpdateRecolteFactureDto extends PartialType(CreateRecolteFactureDto) {}
