import { PartialType } from '@nestjs/swagger';
import { CreateExpiditeurPublicDto } from './create-expiditeur-public.dto';

export class UpdateExpiditeurPublicDto extends PartialType(CreateExpiditeurPublicDto) {}
