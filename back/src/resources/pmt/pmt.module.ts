import { Module } from '@nestjs/common';
import { PmtService } from './pmt.service';
import { PmtController } from './pmt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pmt } from './entities/pmt.entity';
import { Banque } from '../banques/entities/banque.entity';
import { ClientsTarif } from '../clients-tarifs/entities/clients-tarif.entity';
import { CodeTarifsZone } from '../code-tarifs-zones/entities/code-tarifs-zone.entity';
import { Commune } from '../communes/entities/commune.entity';
import { Employe } from '../employes/entities/employe.entity';
import { Recolte } from '../recoltes/entities/recolte.entity';
import { Service } from '../services/entities/service.entity';
import { Shipment } from '../shipments/entities/shipment.entity';
import { Status } from '../status/entities/status.entity';
import { User } from '../users/entities/user.entity';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { Zone } from '../zones/entities/zone.entity';
import { ShipmentsService } from '../shipments/shipments.service';
import { PdfService } from 'src/core/templates/pdf.service';
import { AgencesService } from '../agences/agences.service';
import { BanquesService } from '../banques/banques.service';
import { ClientsTarifsService } from '../clients-tarifs/clients-tarifs.service';
import { ClientsService } from '../clients/clients.service';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { CommunesService } from '../communes/communes.service';
import { DepartementsService } from '../departements/departements.service';
import { EmployesService } from '../employes/employes.service';
import { FonctionsService } from '../fonctions/fonctions.service';
import { PoidsService } from '../poids/poids.service';
import { SacShipmentsService } from '../sac-shipments/sac-shipments.service';
import { SacService } from '../sac/sac.service';
import { ServicesService } from '../services/services.service';
import { StatusService } from '../status/status.service';
import { UsersService } from '../users/users.service';
import { WilayasService } from '../wilayas/wilayas.service';
import { ZonesService } from '../zones/zones.service';
import { Sac } from '../sac/entities/sac.entity';
import { SacShipment } from '../sac-shipments/entities/sac-shipment.entity';
import { Client } from '../clients/entities/client.entity';
import { Poid } from '../poids/entities/poid.entity';
import { Agence } from '../agences/entities/agence.entity';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { Departement } from '../departements/entities/departement.entity';
import { Coursier } from '../coursier/entities/coursier.entity';
import { CoursierService } from '../coursier/coursier.service';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { CodeTarif } from '../code-tarif/entities/code-tarif.entity';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import { PmtCoursierService } from '../pmt-coursier/pmt-coursier.service';
import { PmtCoursier } from '../pmt-coursier/entities/pmt-coursier.entity';
import { Facture } from '../facture/entities/facture.entity';
import { FactureService } from '../facture/facture.service';
import { ExpiditeurPublicService } from '../expiditeur-public/expiditeur-public.service';
import { ServiceClientService } from '../service-client/service-client.service';
import { ExpiditeurPublic } from '../expiditeur-public/entities/expiditeur-public.entity';
import { Rotation } from '../rotations/entities/rotation.entity';
import { RotationsService } from '../rotations/rotations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pmt,
      Recolte,
      Shipment,
      Wilaya,
      Commune,
      User,
      Service,
      Status,
      ClientsTarif,
      Zone,
      CodeTarifsZone,
      Employe,
      Banque,
      Coursier,
      Sac,
      SacShipment,
      Client,
      Poid,
      Agence,
      Fonction,
      Departement,
      CodeTarif,
      PmtCoursier,
      Facture,
      ExpiditeurPublic,
      Rotation,
    ]),
  ],
  controllers: [PmtController],
  providers: [
    PmtService,
    ShipmentsService,
    SacService,
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
    AgencesService,
    BanquesService,
    FonctionsService,
    DepartementsService,
    SacShipmentsService,
    CoursierService,
    CodeTarifService,
    ExcelService,
    PmtCoursierService,
    FactureService,
    ExpiditeurPublicService,
    RotationsService,
    ServiceClientService
  ],
})
export class PmtModule {}
