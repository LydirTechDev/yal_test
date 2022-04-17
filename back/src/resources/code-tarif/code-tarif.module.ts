import { Module } from '@nestjs/common';
import { CodeTarifService } from './code-tarif.service';
import { CodeTarifController } from './code-tarif.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../services/entities/service.entity';
import { CodeTarif } from './entities/code-tarif.entity';
import { ServicesService } from '../services/services.service';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { CodeTarifsZone } from '../code-tarifs-zones/entities/code-tarifs-zone.entity';
import { Zone } from '../zones/entities/zone.entity';
import { Poid } from '../poids/entities/poid.entity';
import { ZonesService } from '../zones/zones.service';
import { PoidsService } from '../poids/poids.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CodeTarif, Service, CodeTarifsZone, Zone, Poid]),
  ],
  controllers: [CodeTarifController],
  providers: [
    CodeTarifService,
    ServicesService,
    CodeTarifsZonesService,
    ZonesService,
    PoidsService,
  ],
})
export class CodeTarifModule {}
