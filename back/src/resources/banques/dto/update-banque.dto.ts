import { PartialType } from '@nestjs/mapped-types';
import { CreateBanqueDto } from './create-banque.dto';

export class UpdateBanqueDto extends PartialType(CreateBanqueDto) {}
