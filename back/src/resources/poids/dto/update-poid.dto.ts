import { PartialType } from '@nestjs/mapped-types';
import { CreatePoidDto } from './create-poid.dto';

export class UpdatePoidDto extends PartialType(CreatePoidDto) {}
