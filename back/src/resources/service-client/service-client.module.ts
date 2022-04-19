import { Module } from '@nestjs/common';
import { ServiceClientService } from './service-client.service';
import { ServiceClientController } from './service-client.controller';
import { ServicesService } from '../services/services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../services/entities/service.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { RotationsService } from '../rotations/rotations.service';
import { Rotation } from '../rotations/entities/rotation.entity';
import { WilayasService } from '../wilayas/wilayas.service';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { ZonesService } from '../zones/zones.service';
import { Zone } from '../zones/entities/zone.entity';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import { EmployesService } from '../employes/employes.service';
import { Employe } from '../employes/entities/employe.entity';
import { AgencesService } from '../agences/agences.service';
import { Agence } from '../agences/entities/agence.entity';
import { BanquesService } from '../banques/banques.service';
import { Banque } from '../banques/entities/banque.entity';
import { FonctionsService } from '../fonctions/fonctions.service';
import { CommunesService } from '../communes/communes.service';
import { Commune } from '../communes/entities/commune.entity';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { DepartementsService } from '../departements/departements.service';
import { Departement } from '../departements/entities/departement.entity';
import { Poid } from '../poids/entities/poid.entity';
import { PoidsService } from '../poids/poids.service';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { CodeTarifsZone } from '../code-tarifs-zones/entities/code-tarifs-zone.entity';
import { ShipmentsService } from '../shipments/shipments.service';
import { Shipment } from '../shipments/entities/shipment.entity';
import { StatusService } from '../status/status.service';
import { Status } from '../status/entities/status.entity';
import { ClientsService } from '../clients/clients.service';
import { ClientsTarifsService } from '../clients-tarifs/clients-tarifs.service';
import { CoursierService } from '../coursier/coursier.service';
import { PdfService } from 'src/core/templates/pdf.service';
import { PmtCoursierService } from '../pmt-coursier/pmt-coursier.service';
import { Client } from '../clients/entities/client.entity';
import { ClientsTarif } from '../clients-tarifs/entities/clients-tarif.entity';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { Coursier } from '../coursier/entities/coursier.entity';
import { PmtCoursier } from '../pmt-coursier/entities/pmt-coursier.entity';
import { Pmt } from '../pmt/entities/pmt.entity';
import { CodeTarif } from '../code-tarif/entities/code-tarif.entity';
import { ExpiditeurPublicService } from '../expiditeur-public/expiditeur-public.service';
import { ExpiditeurPublic } from '../expiditeur-public/entities/expiditeur-public.entity';
import { FactureService } from '../facture/facture.service';
import { Facture } from '../facture/entities/facture.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      User,
      Rotation,
      Wilaya,
      Zone,
      Employe,
      Agence,
      Banque,
      Fonction,
      Commune,
      Departement,
      Poid,
      CodeTarifsZone,
      Shipment,
      Status,
      Client,
      ClientsTarif,
      Coursier,
      PmtCoursier,
      CodeTarif,
      ExpiditeurPublic,
      Facture,
    ]),
  ],
  controllers: [ServiceClientController],
  providers: [
    ServiceClientService,
    ServicesService,
    UsersService,
    RotationsService,
    WilayasService,
    ZonesService,
    ExcelService,
    EmployesService,
    AgencesService,
    BanquesService,
    FonctionsService,
    CommunesService,
    DepartementsService,
    PoidsService,
    CodeTarifsZonesService,
    ShipmentsService,
    StatusService,
    ClientsService,
    ClientsTarifsService,
    CoursierService,
    PdfService,
    PmtCoursierService,
    CodeTarifService,
    ExpiditeurPublicService,
    FactureService,
  ],
  exports: [ServiceClientService],
})
export class ServiceClientModule {}
