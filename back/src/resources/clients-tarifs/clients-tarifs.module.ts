import { Module } from '@nestjs/common';
import { ClientsTarifsService } from './clients-tarifs.service';
import { ClientsTarifsController } from './clients-tarifs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsTarif } from './entities/clients-tarif.entity';
import { AgencesService } from '../agences/agences.service';
import { Agence } from '../agences/entities/agence.entity';
import { ClientsService } from '../clients/clients.service';
import { Client } from '../clients/entities/client.entity';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { CodeTarif } from '../code-tarif/entities/code-tarif.entity';
import { CommunesService } from '../communes/communes.service';
import { Commune } from '../communes/entities/commune.entity';
import { Service } from '../services/entities/service.entity';
import { ServicesService } from '../services/services.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { WilayasService } from '../wilayas/wilayas.service';
import { Employe } from '../employes/entities/employe.entity';
import { EmployesService } from '../employes/employes.service';
import { Banque } from '../banques/entities/banque.entity';
import { Departement } from '../departements/entities/departement.entity';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { BanquesService } from '../banques/banques.service';
import { DepartementsService } from '../departements/departements.service';
import { FonctionsService } from '../fonctions/fonctions.service';
import { PdfService } from 'src/core/templates/pdf.service';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { CodeTarifsZone } from '../code-tarifs-zones/entities/code-tarifs-zone.entity';
import { ZonesService } from '../zones/zones.service';
import { PoidsService } from '../poids/poids.service';
import { Zone } from '../zones/entities/zone.entity';
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
import { ServiceClient } from '../service-client/entities/service-client.entity';
import { ServiceClientService } from '../service-client/service-client.service';
import { ExpiditeurPublicService } from '../expiditeur-public/expiditeur-public.service';
import { ExpiditeurPublic } from '../expiditeur-public/entities/expiditeur-public.entity';
import { Recolte } from '../recoltes/entities/recolte.entity';
import { RecoltesService } from '../recoltes/recoltes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientsTarif,
      CodeTarif,
      Client,
      User,
      Agence,
      Commune,
      Wilaya,
      Service,
      Employe,
      Fonction,
      Departement,
      Banque,
      CodeTarifsZone,
      Zone,
      Poid,
      Shipment,
      Status,
      Coursier,
      PmtCoursier,
      Facture,
      Rotation,
      ServiceClient,
      ExpiditeurPublic,
      Recolte
    ]),
  ],
  controllers: [ClientsTarifsController],
  providers: [
    ClientsTarifsService,
    CodeTarifService,
    ClientsService,
    UsersService,
    AgencesService,
    CommunesService,
    WilayasService,
    ServicesService,
    EmployesService,
    FonctionsService,
    DepartementsService,
    BanquesService,
    PdfService,
    ExcelService,
    CodeTarifsZonesService,
    ZonesService,
    PoidsService,
    ShipmentsService,
    StatusService,
    CoursierService,
    PmtCoursierService,
    FactureService,
    RotationsService,
    ServiceClientService,
    ExpiditeurPublicService,
    RecoltesService
  ],
})
export class ClientsTarifsModule {}
