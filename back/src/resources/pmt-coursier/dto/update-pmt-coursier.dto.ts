import { PartialType } from '@nestjs/mapped-types';
import { CreatePmtCoursierDto } from './create-pmt-coursier.dto';

export class UpdatePmtCoursierDto extends PartialType(CreatePmtCoursierDto) {}
