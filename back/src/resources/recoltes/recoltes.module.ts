import { Module } from '@nestjs/common';
import { RecoltesService } from './recoltes.service';
import { RecoltesController } from './recoltes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recolte } from './entities/recolte.entity';
import { Coursier } from 'src/resources/coursier/entities/coursier.entity';
import { Banque } from 'src/resources/banques/entities/banque.entity';
import { ClientsTarif } from 'src/resources/clients-tarifs/entities/clients-tarif.entity';
import { CodeTarifsZone } from 'src/resources/code-tarifs-zones/entities/code-tarifs-zone.entity';
import { Commune } from 'src/resources/communes/entities/commune.entity';
import { Employe } from 'src/resources/employes/entities/employe.entity';
import { Service } from 'src/resources/services/entities/service.entity';
import { Shipment } from 'src/resources/shipments/entities/shipment.entity';
import { ShipmentsModule } from 'src/resources/shipments/shipments.module';
import { Status } from 'src/resources/status/entities/status.entity';
import { User } from 'src/resources/users/entities/user.entity';
import { Wilaya } from 'src/resources/wilayas/entities/wilaya.entity';
import { Zone } from 'src/resources/zones/entities/zone.entity';
import { CoursierService } from 'src/resources/coursier/coursier.service';
import { ShipmentsService } from 'src/resources/shipments/shipments.service';
import { StatusService } from 'src/resources/status/status.service';
import { UsersService } from 'src/resources/users/users.service';
import { PdfService } from 'src/core/templates/pdf.service';
import { CommunesService } from 'src/resources/communes/communes.service';
import { ServicesService } from 'src/resources/services/services.service';
import { ClientsService } from 'src/resources/clients/clients.service';
import { ClientsTarifsService } from 'src/resources/clients-tarifs/clients-tarifs.service';
import { ZonesService } from 'src/resources/zones/zones.service';
import { EmployesService } from 'src/resources/employes/employes.service';
import { BanquesService } from 'src/resources/banques/banques.service';
import { CodeTarifsZonesService } from 'src/resources/code-tarifs-zones/code-tarifs-zones.service';
import { PoidsService } from 'src/resources/poids/poids.service';
import { WilayasService } from 'src/resources/wilayas/wilayas.service';
import { Client } from 'src/resources/clients/entities/client.entity';
import { FonctionsService } from 'src/resources/fonctions/fonctions.service';
import { AgencesService } from 'src/resources/agences/agences.service';
import { Poid } from 'src/resources/poids/entities/poid.entity';
import { Fonction } from 'src/resources/fonctions/entities/fonction.entity';
import { DepartementsService } from 'src/resources/departements/departements.service';
import { Departement } from 'src/resources/departements/entities/departement.entity';
import { Agence } from 'src/resources/agences/entities/agence.entity';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { CodeTarif } from '../code-tarif/entities/code-tarif.entity';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import { PmtCoursierService } from '../pmt-coursier/pmt-coursier.service';
import { PmtCoursier } from '../pmt-coursier/entities/pmt-coursier.entity';
import { Facture } from '../facture/entities/facture.entity';
import { FactureService } from '../facture/facture.service';
import { ExpiditeurPublic } from '../expiditeur-public/entities/expiditeur-public.entity';
import { ExpiditeurPublicService } from '../expiditeur-public/expiditeur-public.service';
import { ServiceClientService } from '../service-client/service-client.service';
import { RotationsService } from '../rotations/rotations.service';
import { Rotation } from '../rotations/entities/rotation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recolte,
      Shipment,
      Wilaya,
      Commune,
      User,
      Service,
      Status,
      ClientsTarif,
      Client,
      Zone,
      CodeTarifsZone,
      Employe,
      Banque,
      Coursier,
      Poid,
      Fonction,
      Departement,
      Agence,
      CodeTarif,
      PmtCoursier,
      Facture,
      ExpiditeurPublic,
      Rotation,
    ]),
    ShipmentsModule,
  ],
  controllers: [RecoltesController],
  providers: [
    RecoltesService,
    CoursierService,
    ShipmentsService,
    StatusService,
    UsersService,
    PdfService,
    CommunesService,
    ServicesService,
    ClientsService,
    ClientsTarifsService,
    ZonesService,
    CodeTarifsZonesService,
    EmployesService,
    BanquesService,
    PoidsService,
    WilayasService,
    FonctionsService,
    AgencesService,
    DepartementsService,
    CodeTarifService,
    ExcelService,
    PmtCoursierService,
    FactureService,
    ExpiditeurPublicService,
    ServiceClientService,
    RotationsService,
  ],
})
export class RecoltesModule {}
