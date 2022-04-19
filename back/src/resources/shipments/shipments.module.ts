import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';
import { WilayasService } from '../wilayas/wilayas.service';
import { CommunesService } from '../communes/communes.service';
import { UsersService } from '../users/users.service';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { Commune } from '../communes/entities/commune.entity';
import { User } from '../users/entities/user.entity';
import { Service } from '../services/entities/service.entity';
import { ServicesService } from '../services/services.service';
import { Status } from '../status/entities/status.entity';
import { StatusService } from '../status/status.service';
import { ClientsService } from '../clients/clients.service';
import { ClientsTarifsService } from '../clients-tarifs/clients-tarifs.service';
import { Client } from '../clients/entities/client.entity';
import { ClientsTarif } from '../clients-tarifs/entities/clients-tarif.entity';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { PoidsService } from '../poids/poids.service';
import { ZonesService } from '../zones/zones.service';
import { CodeTarifsZone } from '../code-tarifs-zones/entities/code-tarifs-zone.entity';
import { Poid } from '../poids/entities/poid.entity';
import { Zone } from '../zones/entities/zone.entity';
import { PdfService } from 'src/core/templates/pdf.service';
import { Employe } from '../employes/entities/employe.entity';
import { EmployesService } from '../employes/employes.service';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { Departement } from '../departements/entities/departement.entity';
import { Agence } from '../agences/entities/agence.entity';
import { Banque } from '../banques/entities/banque.entity';
import { FonctionsService } from '../fonctions/fonctions.service';
import { DepartementsService } from '../departements/departements.service';
import { BanquesService } from '../banques/banques.service';
import { AgencesService } from '../agences/agences.service';
import { BanquesModule } from '../banques/banques.module';
import { CoursierService } from 'src/resources/coursier/coursier.service';
import { Coursier } from 'src/resources/coursier/entities/coursier.entity';
import { CoursierModule } from 'src/resources/coursier/coursier.module';
import { AgencesModule } from '../agences/agences.module';
import { ClientsTarifsModule } from '../clients-tarifs/clients-tarifs.module';
import { ClientsModule } from '../clients/clients.module';
import { CodeTarifsZonesModule } from '../code-tarifs-zones/code-tarifs-zones.module';
import { CommunesModule } from '../communes/communes.module';
import { DepartementsModule } from '../departements/departements.module';
import { EmployesModule } from '../employes/employes.module';
import { FonctionsModule } from '../fonctions/fonctions.module';
import { PoidsModule } from '../poids/poids.module';
import { StatusModule } from '../status/status.module';
import { UsersModule } from '../users/users.module';
import { WilayasModule } from '../wilayas/wilayas.module';
import { ZonesModule } from '../zones/zones.module';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { CodeTarif } from '../code-tarif/entities/code-tarif.entity';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import { PmtCoursierService } from '../pmt-coursier/pmt-coursier.service';
import { PmtCoursier } from '../pmt-coursier/entities/pmt-coursier.entity';
import { ExpiditeurPublicService } from '../expiditeur-public/expiditeur-public.service';
import { ExpiditeurPublic } from '../expiditeur-public/entities/expiditeur-public.entity';
import { ServiceClientModule } from '../service-client/service-client.module';
import { ServiceClientService } from '../service-client/service-client.service';
import { RotationsService } from '../rotations/rotations.service';
import { Rotation } from '../rotations/entities/rotation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shipment,
      Wilaya,
      Commune,
      User,
      Service,
      Status,
      Client,
      ClientsTarif,
      CodeTarifsZone,
      Poid,
      Zone,
      CodeTarifsZone,
      Employe,
      Fonction,
      Departement,
      Agence,
      Banque,
      Coursier,
      CodeTarif,
      PmtCoursier,
      ExpiditeurPublic,
      Rotation
    ]),
    BanquesModule,
  ],
  controllers: [ShipmentsController],
  providers: [
    ShipmentsService,
    WilayasService,
    CommunesService,
    UsersService,
    ServicesService,
    StatusService,
    ClientsService,
    ClientsTarifsService,
    CodeTarifsZonesService,
    PoidsService,
    ZonesService,
    PdfService,
    EmployesService,
    FonctionsService,
    DepartementsService,
    BanquesService,
    AgencesService,
    CoursierService,
    CodeTarifService,
    ExcelService,
    PmtCoursierService,
    ExpiditeurPublicService,
    ServiceClientService,
    RotationsService
  ],
  exports: [],
})
export class ShipmentsModule {}
