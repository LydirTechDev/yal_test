import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Employe } from '../employes/entities/employe.entity';
import { EmployesService } from '../employes/employes.service';
import { User } from '../users/entities/user.entity';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { Agence } from '../agences/entities/agence.entity';
import { UsersService } from '../users/users.service';
import { FonctionsService } from '../fonctions/fonctions.service';
import { AgencesService } from '../agences/agences.service';
import { BanquesService } from '../banques/banques.service';
import { Banque } from '../banques/entities/banque.entity';
import { CommunesService } from '../communes/communes.service';
import { DepartementsService } from '../departements/departements.service';
import { WilayasService } from '../wilayas/wilayas.service';
import { Commune } from '../communes/entities/commune.entity';
import { Departement } from '../departements/entities/departement.entity';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { ClientsTarif } from '../clients-tarifs/entities/clients-tarif.entity';
import { CodeTarif } from '../code-tarif/entities/code-tarif.entity';
import { Service } from '../services/entities/service.entity';
import { ClientsTarifsService } from '../clients-tarifs/clients-tarifs.service';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { ServicesService } from '../services/services.service';
import { PdfService } from 'src/core/templates/pdf.service';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { CodeTarifsZone } from '../code-tarifs-zones/entities/code-tarifs-zone.entity';
import { ZonesService } from '../zones/zones.service';
import { Zone } from '../zones/entities/zone.entity';
import { PoidsService } from '../poids/poids.service';
import { Poid } from '../poids/entities/poid.entity';
import { Shipment } from '../shipments/entities/shipment.entity';
import { ShipmentsService } from '../shipments/shipments.service';
import { StatusService } from '../status/status.service';
import { Status } from '../status/entities/status.entity';
import { Coursier } from '../coursier/entities/coursier.entity';
import { CoursierService } from '../coursier/coursier.service';
import { PmtCoursierService } from '../pmt-coursier/pmt-coursier.service';
import { PmtCoursier } from '../pmt-coursier/entities/pmt-coursier.entity';
import { Facture } from '../facture/entities/facture.entity';
import { FactureService } from '../facture/facture.service';
import { RotationsService } from '../rotations/rotations.service';
import { Rotation } from '../rotations/entities/rotation.entity';
import { RecoltesService } from '../recoltes/recoltes.service';
import { Recolte } from '../recoltes/entities/recolte.entity';
import { ServiceClientService } from '../service-client/service-client.service';
import { ServiceClient } from '../service-client/entities/service-client.entity';
import { ExpiditeurPublicService } from '../expiditeur-public/expiditeur-public.service';
import { ExpiditeurPublic } from '../expiditeur-public/entities/expiditeur-public.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      Employe,
      User,
      Fonction,
      Agence,
      Banque,
      Departement,
      Commune,
      Wilaya,
      ClientsTarif,
      Service,
      CodeTarif,
      CodeTarifsZone,
      Zone,
      Poid,
      Shipment,
      Status,
      Coursier,
      PmtCoursier,
      Facture,
      Rotation,
      Recolte,
      ServiceClient,
      ExpiditeurPublic
    ]),
  ],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    PoidsService,
    ZonesService,
    EmployesService,
    UsersService,
    FonctionsService,
    AgencesService,
    BanquesService,
    DepartementsService,
    CommunesService,
    WilayasService,
    ClientsTarifsService,
    ServicesService,
    CodeTarifService,
    PdfService,
    ExcelService,
    CodeTarifsZonesService,
    ShipmentsService,
    StatusService,
    CoursierService,
    PmtCoursierService,
    FactureService,
    RotationsService,
    RecoltesService,
    ServiceClientService,
    ExpiditeurPublicService,
  ],
})
export class ClientsModule {}
