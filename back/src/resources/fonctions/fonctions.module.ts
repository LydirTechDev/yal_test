import { Module } from '@nestjs/common';
import { FonctionsService } from './fonctions.service';
import { FonctionsController } from './fonctions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departement } from '../departements/entities/departement.entity';
import { Fonction } from './entities/fonction.entity';
import { DepartementsService } from '../departements/departements.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fonction, Departement])],
  controllers: [FonctionsController],
  providers: [FonctionsService, DepartementsService]
})
export class FonctionsModule {}
