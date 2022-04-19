import { PartialType } from '@nestjs/swagger';
import { CreateServiceClientDto } from './create-service-client.dto';

export class UpdateServiceClientDto extends PartialType(CreateServiceClientDto) {}
