import { PartialType } from '@nestjs/mapped-types';
import { CreateCoursierDto } from './create-coursier.dto';

export class UpdateCoursierDto extends PartialType(CreateCoursierDto) {}
