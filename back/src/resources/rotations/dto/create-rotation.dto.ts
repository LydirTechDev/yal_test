import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateRotationDto {
  @ApiProperty({
    description: 'id wilaya de départ ex: 1',
    required: true,
    type: Number,
    example: 1
  })
  @IsNumber()
  wilayaDepartId: number;

  @ApiProperty({
    description: 'id wilaya de déstination ex: 1',
    required: true,
    type: Number,
    example: 1
  })
  @IsNumber()
  wilayaDestinationId: number;

  @ApiProperty({
    description: 'id zone ex: 1',
    required: true,
    type: Number,
    example: 1
  })
  @IsNumber()
  zoneId: number;
}
