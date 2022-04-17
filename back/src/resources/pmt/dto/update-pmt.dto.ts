import { PartialType } from '@nestjs/swagger';
import { CreatePmtDto } from './create-pmt.dto';

export class UpdatePmtDto extends PartialType(CreatePmtDto) {}
