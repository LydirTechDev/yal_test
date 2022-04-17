import { PartialType } from '@nestjs/mapped-types';
import { CreateSacDto } from './create-sac.dto';

export class UpdateSacDto extends PartialType(CreateSacDto) {}
