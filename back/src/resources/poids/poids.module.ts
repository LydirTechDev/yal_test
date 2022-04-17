import { Module } from '@nestjs/common';
import { PoidsService } from './poids.service';
import { PoidsController } from './poids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poid } from './entities/poid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poid])],
  controllers: [PoidsController],
  providers: [PoidsService]
})
export class PoidsModule {}
