import { Module } from '@nestjs/common';
import { FactureService } from './facture.service';
import { FactureController } from './facture.controller';
import { Facture } from './entities/facture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../clients/entities/client.entity';
import { ClientsService } from '../clients/clients.service';
import { Agence } from '../agences/entities/agence.entity';
import { Banque } from '../banques/entities/banque.entity';
import { ClientsTarif } from '../clients-tarifs/entities/clients-tarif.entity';
import { CodeTarif } from '../code-tarif/entities/code-tarif.entity';
import { Commune } from '../communes/entities/commune.entity';
import { Departement } from '../departements/entities/departement.entity';
import { Employe } from '../employes/entities/employe.entity';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { Service } from '../services/entities/service.entity';
import { User } from '../users/entities/user.entity';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import { PdfService } from 'src/core/templates/pdf.service';
import { AgencesService } from '../agences/agences.service';
import { BanquesService } from '../banques/banques.service';
import { ClientsTarifsService } from '../clients-tarifs/clients-tarifs.service';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { CommunesService } from '../communes/communes.service';
import { DepartementsService } from '../departements/departements.service';
import { EmployesService } from '../employes/employes.service';
import { FonctionsService } from '../fonctions/fonctions.service';
import { ServicesService } from '../services/services.service';
import { UsersService } from '../users/users.service';
import { WilayasService } from '../wilayas/wilayas.service';
import { Poid } from '../poids/entities/poid.entity';
import { Zone } from '../zones/entities/zone.entity';
import { ZonesService } from '../zones/zones.service';
import { PoidsService } from '../poids/poids.service';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { CodeTarifsZone } from '../code-tarifs-zones/entities/code-tarifs-zone.entity';
import { ShipmentsService } from '../shipments/shipments.service';
import { Shipment } from '../shipments/entities/shipment.entity';
import { Status } from '../status/entities/status.entity';
import { StatusService } from '../status/status.service';
import { Coursier } from '../coursier/entities/coursier.entity';
import { CoursierService } from '../coursier/coursier.service';
import { PmtCoursier } from '../pmt-coursier/entities/pmt-coursier.entity';
import { PmtCoursierService } from '../pmt-coursier/pmt-coursier.service';
import { RotationsService } from '../rotations/rotations.service';
import { Rotation } from '../rotations/entities/rotation.entity';
import { RecolteFacture } from '../recolte-facture/entities/recolte-facture.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Facture,
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
      Zone,
      Poid,
      CodeTarifsZone,
      Shipment,
      Status,
      Coursier,
      PmtCoursier,
      Rotation,
      RecolteFacture

    ]),
  ],
  controllers: [FactureController],
  providers: [
    FactureService,
    ClientsService,
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
    ZonesService,
    PoidsService,
    CodeTarifsZonesService,
    ShipmentsService,
    StatusService,
    CoursierService,
    PmtCoursierService,
    RotationsService

  ],
})
export class FactureModule { }
