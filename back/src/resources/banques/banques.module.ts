import { Module } from '@nestjs/common';
import { BanquesService } from './banques.service';
import { BanquesController } from './banques.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banque } from './entities/banque.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Banque])],
  controllers: [BanquesController],
  providers: [BanquesService],
  exports: [BanquesService]
})
export class BanquesModule {}
