import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { PdfService } from 'src/core/templates/pdf.service';
import { AgencesService } from '../agences/agences.service';
import { Agence } from '../agences/entities/agence.entity';
import { BanquesService } from '../banques/banques.service';
import { Banque } from '../banques/entities/banque.entity';
import { ClientsTarifsService } from '../clients-tarifs/clients-tarifs.service';
import { ClientsTarif } from '../clients-tarifs/entities/clients-tarif.entity';
import { ClientsService } from '../clients/clients.service';
import { Client } from '../clients/entities/client.entity';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { CodeTarifsZone } from '../code-tarifs-zones/entities/code-tarifs-zone.entity';
import { CommunesService } from '../communes/communes.service';
import { Commune } from '../communes/entities/commune.entity';
import { CoursierService } from '../coursier/coursier.service';
import { Coursier } from '../coursier/entities/coursier.entity';
import { DepartementsService } from '../departements/departements.service';
import { Departement } from '../departements/entities/departement.entity';
import { EmployesService } from '../employes/employes.service';
import { Employe } from '../employes/entities/employe.entity';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { FonctionsService } from '../fonctions/fonctions.service';
import { Poid } from '../poids/entities/poid.entity';
import { PoidsService } from '../poids/poids.service';
import { Service } from '../services/entities/service.entity';
import { ServicesService } from '../services/services.service';
import { Shipment } from '../shipments/entities/shipment.entity';
import { ShipmentsService } from '../shipments/shipments.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { WilayasService } from '../wilayas/wilayas.service';
import { Zone } from '../zones/entities/zone.entity';
import { ZonesService } from '../zones/zones.service';
import { CodeTarif } from '../code-tarif/entities/code-tarif.entity';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import { PmtCoursierService } from '../pmt-coursier/pmt-coursier.service';
import { PmtCoursier } from '../pmt-coursier/entities/pmt-coursier.entity';
import { Facture } from '../facture/entities/facture.entity';
import { FactureService } from '../facture/facture.service';
import { ExpiditeurPublic } from '../expiditeur-public/entities/expiditeur-public.entity';
import { ExpiditeurPublicService } from '../expiditeur-public/expiditeur-public.service';
import { ServiceClientService } from '../service-client/service-client.service';
import { Rotation } from '../rotations/entities/rotation.entity';
import { RotationsService } from '../rotations/rotations.service';
import { Recolte } from '../recoltes/entities/recolte.entity';
import { RecoltesService } from '../recoltes/recoltes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Status,
      Shipment,
      Wilaya,
      Commune,
      User,
      Service,
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
      Facture,
      ExpiditeurPublic,
      Rotation,
      Recolte
    ]),
  ],
  providers: [
    StatusService,
    ShipmentsService,
    WilayasService,
    CommunesService,
    UsersService,
    ServicesService,
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
    ExcelService,
    CodeTarifService,
    PmtCoursierService,
    FactureService,
    ExpiditeurPublicService,
    ServiceClientService,
    RotationsService,
    RecoltesService
  ],
})
export class StatusModule {}
