import { Module } from '@nestjs/common';
import { CodeTarifsZonesService } from './code-tarifs-zones.service';
import { CodeTarifsZonesController } from './code-tarifs-zones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeTarifsZone } from './entities/code-tarifs-zone.entity';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { PoidsService } from '../poids/poids.service';
import { CodeTarif } from '../code-tarif/entities/code-tarif.entity';
import { Poid } from '../poids/entities/poid.entity';
import { Zone } from '../zones/entities/zone.entity';
import { ZonesService } from '../zones/zones.service';
import { ServicesService } from '../services/services.service';
import { Service } from '../services/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodeTarifsZone, Zone, Poid, CodeTarif, Service])],
  controllers: [CodeTarifsZonesController],
  providers: [
    CodeTarifsZonesService,
    ZonesService,
    PoidsService,
    CodeTarifService,
    ServicesService,
  ],
})
export class CodeTarifsZonesModule {}
