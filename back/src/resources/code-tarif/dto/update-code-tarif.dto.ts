import { PartialType } from '@nestjs/mapped-types';
import { CreateCodeTarifDto } from './create-code-tarif.dto';

export class UpdateCodeTarifDto extends PartialType(CreateCodeTarifDto) {}
