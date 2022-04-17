import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeDto } from './create-employe.dto';

export class UpdateEmployeDto extends PartialType(CreateEmployeDto) {}
