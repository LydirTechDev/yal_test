import { Agence } from 'src/resources/agences/entities/agence.entity';
import { Client } from 'src/resources/clients/entities/client.entity';
import { RecolteFacture } from 'src/resources/recolte-facture/entities/recolte-facture.entity';
import { Shipment } from 'src/resources/shipments/entities/shipment.entity';
import { User } from 'src/resources/users/entities/user.entity';
import {
  AfterInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Facture')
export class Facture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: true,
  })
  numFacture: string;

  @Column({
    nullable: true,
  })
  typeFacture: string;

  @Column({
    nullable: true,
  })
  datePaiement: Date;

  @Column({
    nullable: true,
  })
  modePaiement: string;

  @Column({
    nullable: true,
  })
  numCheque: string;

  @Column({
    default: false,
  })
  payer: boolean;

  @Column({
    nullable: true,
  })
  espece: boolean;

  // -------------------------------------------------

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (createdBy) => createdBy.facture, {
    nullable: true,
  })
  createdBy: User;

  @ManyToOne(() => Agence, (createdOn) => createdOn.facture, {
    nullable: true,
  })
  createdOn: Agence;

  // ---------------------------- client ---------------------

  @ManyToOne(() => Client, (client) => client.facture, {
    nullable: true,
  })
  client: Client;

  @Column({
    nullable: true,
    type: 'float',
  })
  montantTotal: number;


  @Column({
    nullable: true,
    type: 'float',
  })
  montantTva: number;
  @Column({
    nullable: true,
    type: 'float',
  })
  montantTtc: number;
  @Column({
    nullable: true,
    type: 'float',
  })
  montantTimbre: number;
  @Column({
    nullable: true,
    type: 'float',
  })
  montantHoreTaxe: number;

  //   ---------------------------------
  @OneToMany(() => Shipment, (shipments) => shipments.facture)
  shipments: Shipment[];

  @Column({
    nullable: true,
  })
  nbrColis: number;

  @OneToOne(() => RecolteFacture, (recolte) => recolte.facture, {
    nullable: true,
  })
  recolte: RecolteFacture;
}
