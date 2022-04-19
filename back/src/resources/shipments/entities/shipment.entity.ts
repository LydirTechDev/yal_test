import { Recolte } from 'src/resources/recoltes/entities/recolte.entity';
import { Commune } from 'src/resources/communes/entities/commune.entity';
import { SacShipment } from 'src/resources/sac-shipments/entities/sac-shipment.entity';
import { Service } from 'src/resources/services/entities/service.entity';
import { Status } from 'src/resources/status/entities/status.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/resources/users/entities/user.entity';
import { StatusShipmentEnum } from 'src/enums/status.shipment.enum';
import { Pmt } from 'src/resources/pmt/entities/pmt.entity';
import { Agence } from 'src/resources/agences/entities/agence.entity';
import { PmtCoursier } from 'src/resources/pmt-coursier/entities/pmt-coursier.entity';
import { Facture } from 'src/resources/facture/entities/facture.entity';
import { ExpiditeurPublic } from 'src/resources/expiditeur-public/entities/expiditeur-public.entity';

@Entity()
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    unique: true,
  })
  tracking: string;

  @Column({
    nullable: true,
  })
  raisonSociale: string;

  @Column({
    nullable: false,
  })
  nom: string;

  @Column({
    nullable: false,
  })
  prenom: string;

  @Column({
    nullable: false,
  })
  telephone: string;

  @Column({
    nullable: true,
  })
  adresse: string;

  @Column({
    nullable: true,
  })
  numCommande: string;

  @Column({
    nullable: false,
  })
  designationProduit: string;

  @Column({
    nullable: true,
  })
  objetRecuperer?: string;

  @Column({
    nullable: true,
  })
  prixVente: number;
  @Column({
    nullable: true,
  })
  prixEstimer: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  poids: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  longueur: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  largeur: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  hauteur: number;

  @Column({
    nullable: true,
  })
  echange?: boolean;

  @Column({
    nullable: true,
  })
  livraisonGratuite: boolean;

  @Column({
    nullable: true,
  })
  ouvrireColis: boolean;

  @Column({
    nullable: false,
  })
  livraisonStopDesck: boolean;

  @Column({
    nullable: false,
  })
  livraisonDomicile: boolean;

  @ManyToOne(() => User, (createdBy) => createdBy.id, { nullable: true })
  createdBy: User;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({
    select: false,
  })
  deleatedAt: Date;

  @ManyToOne(() => Service, (service) => service.shipments, {
    nullable: false,
  })
  service: Service;

  @ManyToOne(() => Commune, (commune) => commune.shipments, {
    nullable: false,
  })
  commune: Commune;
  @ManyToOne(
    () => ExpiditeurPublic,
    (expiditeurPublic) => expiditeurPublic.shipments,
    {
      nullable: true,
    },
  )
  expiditeurPublic: ExpiditeurPublic;

  @OneToMany(() => Status, (status) => status.shipment)
  status: Status[];

  @Column({
    type: 'enum',
    enum: StatusShipmentEnum,
    nullable: true,
  })
  lastStatus: StatusShipmentEnum;
  @Column({
    type: 'boolean',
    default: false,
  })
  payer: boolean;

  @ManyToOne(() => User, (userLastStatus) => userLastStatus, { nullable: true })
  userLastStatus: User;

  @OneToMany(() => SacShipment, (sacShipment) => sacShipment.shipment)
  sacShipments: SacShipment[];

  @ManyToOne(() => Recolte, (recolte) => recolte.shipment)
  recolte: Recolte;
  @Column({
    nullable: true,
  })
  libererAt: Date;

  @ManyToOne(() => User, (libererBy) => libererBy.shipmentsLiberer, {
    nullable: true,
  })
  libererBy: User;

  @ManyToOne(() => Agence, (libererOn) => libererOn.shipmentsLiberer, {
    nullable: true,
  })
  libererOn: Agence;

  @ManyToOne(() => Pmt, (pmt) => pmt.shipments, { nullable: true })
  pmt: Pmt;
  @ManyToOne(() => PmtCoursier, (pmtCoursier) => pmtCoursier.shipments, {
    nullable: true,
  })
  pmtCoursier: PmtCoursier;
  @OneToOne(() => Shipment, (shipmentRelation) => shipmentRelation, {
    nullable: true,
  })
  @JoinColumn()
  shipmentRelation: Shipment;
  @ManyToOne(() => Facture, (facture) => facture.shipments, { nullable: true })
  facture: Facture;
}
