import { Module } from '@nestjs/common';
import { ExpiditeurPublicService } from './expiditeur-public.service';
import { ExpiditeurPublicController } from './expiditeur-public.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpiditeurPublic } from './entities/expiditeur-public.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpiditeurPublic])],
  controllers: [ExpiditeurPublicController],
  providers: [ExpiditeurPublicService],
})
export class ExpiditeurPublicModule {}
