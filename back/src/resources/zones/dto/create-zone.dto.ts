import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateZoneDto {
  @ApiProperty({
    description: 'code zone ex: zone-1',
    minLength: 6,
    maxLength: 7,
    type: String,
    required: true,
    example: 'zone-1',
  })
  @MinLength(6)
  @MaxLength(6)
  @IsString()
  codeZone: string;
}
