import { Coursier } from 'src/resources/coursier/entities/coursier.entity';
import { AgencesTypesEnum } from 'src/enums/agencesTypesEnum';
import { Commune } from 'src/resources/communes/entities/commune.entity';
import { Employe } from 'src/resources/employes/entities/employe.entity';
import { Sac } from 'src/resources/sac/entities/sac.entity';
import { Wilaya } from 'src/resources/wilayas/entities/wilaya.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from 'src/resources/clients/entities/client.entity';
import { Recolte } from 'src/resources/recoltes/entities/recolte.entity';
import { Shipment } from 'src/resources/shipments/entities/shipment.entity';
import { Pmt } from 'src/resources/pmt/entities/pmt.entity';
import { PmtCoursier } from 'src/resources/pmt-coursier/entities/pmt-coursier.entity';
import { Facture } from 'src/resources/facture/entities/facture.entity';

@Entity()
export class Agence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  nom: string;

  @Column({
    nullable: true,
  })
  code: string;

  @Column({
    nullable: false,
  })
  adresse: string;

  @Column({
    nullable: true,
  })
  nrc: string;

  @Column({
    nullable: true,
  })
  nif: string;

  @Column({
    nullable: true,
  })
  nis: string;

  @Column({
    nullable: true,
  })
  nAI: string;

  @Column({
    nullable: true,
  })
  latitude: number;

  @Column({
    nullable: true,
  })
  longitude: number;

  @Column({
    type: 'enum',
    enum: AgencesTypesEnum,
    nullable: true,
  })
  type: AgencesTypesEnum;

  @ManyToOne(() => Commune, (commune) => commune.agences)
  commune: Commune;

  @OneToMany(() => Employe, (employes) => employes.agence)
  employes: Employe[];

  @OneToMany(() => Coursier, (coursier) => coursier.agence)
  coursier: Coursier[];

  @OneToMany(() => Wilaya, (wilaya) => wilaya.agenceRetour)
  wilayaRetour: Wilaya[];

  @OneToMany(() => Sac, (sac) => sac.agenceDestination)
  sac: Sac[];
  @OneToMany(() => Wilaya, (wilayaCaisse) => wilayaCaisse.caisseRegional)
  wilayaCaisse: Wilaya[];

  @OneToMany(() => Recolte, (recolteCreatedOn) => recolteCreatedOn.createdOn)
  recolteCreated: Recolte[];

  @OneToMany(() => Recolte, (recolteReceived) => recolteReceived.receivedOn)
  recolteReceived: Recolte[];

  @OneToMany(() => Shipment, (shipmentsLiberer) => shipmentsLiberer.libererOn)
  shipmentsLiberer: Shipment[];

  @OneToMany(() => Client, (clients) => clients.caisseAgence)
  clients: Client[];

  @OneToMany(() => Pmt, (pmtCreated) => pmtCreated.createdOn)
  pmtCreated: Pmt[];

  @OneToMany(() => Pmt, (pmtValidated) => pmtValidated.validatedOn)
  pmtValidated: Pmt[];

  @OneToMany(
    () => PmtCoursier,
    (pmtCoursierCreatedOn) => pmtCoursierCreatedOn.createdOn,
  )
  pmtCoursierCreatedOn: PmtCoursier[];
  @OneToMany(() => Facture, (facture) => facture.createdOn)
  facture: Facture[];
}
