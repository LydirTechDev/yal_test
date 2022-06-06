import { Module } from '@nestjs/common';
import { SacService } from './sac.service';
import { SacController } from './sac.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sac } from './entities/sac.entity';
import { PdfService } from 'src/core/templates/pdf.service';
import { ClientsTarifsService } from '../clients-tarifs/clients-tarifs.service';
import { ClientsService } from '../clients/clients.service';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { CommunesService } from '../communes/communes.service';
import { EmployesService } from '../employes/employes.service';
import { PoidsService } from '../poids/poids.service';
import { ServicesService } from '../services/services.service';
import { StatusService } from '../status/status.service';
import { UsersService } from '../users/users.service';
import { WilayasService } from '../wilayas/wilayas.service';
import { ZonesService } from '../zones/zones.service';
import { ShipmentsService } from '../shipments/shipments.service';
import { Shipment } from '../shipments/entities/shipment.entity';
import { ClientsTarif } from '../clients-tarifs/entities/clients-tarif.entity';
import { Client } from '../clients/entities/client.entity';
import { CodeTarifsZone } from '../code-tarifs-zones/entities/code-tarifs-zone.entity';
import { Commune } from '../communes/entities/commune.entity';
import { Employe } from '../employes/entities/employe.entity';
import { Poid } from '../poids/entities/poid.entity';
import { Service } from '../services/entities/service.entity';
import { Status } from '../status/entities/status.entity';
import { User } from '../users/entities/user.entity';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { Zone } from '../zones/entities/zone.entity';
import { AgencesService } from '../agences/agences.service';
import { Agence } from '../agences/entities/agence.entity';
import { SacShipment } from '../sac-shipments/entities/sac-shipment.entity';
import { Banque } from '../banques/entities/banque.entity';
import { BanquesService } from '../banques/banques.service';
import { FonctionsService } from '../fonctions/fonctions.service';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { DepartementsService } from '../departements/departements.service';
import { Departement } from '../departements/entities/departement.entity';
import { CoursierService } from 'src/resources/coursier/coursier.service';
import { Coursier } from 'src/resources/coursier/entities/coursier.entity';
import { SacShipmentsService } from '../sac-shipments/sac-shipments.service';
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
import { RotationsService } from '../rotations/rotations.service';
import { Rotation } from '../rotations/entities/rotation.entity';
import { Recolte } from '../recoltes/entities/recolte.entity';
import { RecoltesService } from '../recoltes/recoltes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sac,
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
      Agence,
      SacShipment,
      Banque,
      Fonction,
      Departement,
      Coursier,
      SacShipment,
      CodeTarif,
      PmtCoursier,
      Facture,
      ExpiditeurPublic,
      Rotation,
      Recolte
    ]),
  ],
  controllers: [SacController],
  providers: [
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
    CoursierService,
    SacShipmentsService,
    CodeTarifService,
    ExcelService,
    PmtCoursierService,
    FactureService,
    ExpiditeurPublicService,
    ServiceClientService,
    RotationsService,
    RecoltesService
  ],
})
export class SacModule {}
