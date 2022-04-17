import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Poid } from '../poids/entities/poid.entity';
import { PoidsService } from '../poids/poids.service';
import { Zone } from '../zones/entities/zone.entity';
import { ZonesService } from '../zones/zones.service';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { CodeTarif } from '../code-tarif/entities/code-tarif.entity';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { CodeTarifsZone } from '../code-tarifs-zones/entities/code-tarifs-zone.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Zone, Poid, CodeTarif, CodeTarifsZone]),
  ],
  controllers: [ServicesController],
  providers: [
    ServicesService,
    ZonesService,
    PoidsService,
    CodeTarifService,
    CodeTarifsZonesService,
  ],
})
export class ServicesModule {}
