import { PartialType } from '@nestjs/mapped-types';
import { CreateCodeTarifsZoneDto } from './create-code-tarifs-zone.dto';

export class UpdateCodeTarifsZoneDto extends PartialType(CreateCodeTarifsZoneDto) {}
