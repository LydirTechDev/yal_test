import { Agence } from 'src/resources/agences/entities/agence.entity';
import { Client } from 'src/resources/clients/entities/client.entity';
import { Shipment } from 'src/resources/shipments/entities/shipment.entity';
import { User } from 'src/resources/users/entities/user.entity';
import { Wilaya } from 'src/resources/wilayas/entities/wilaya.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Pmt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tracking: string;

  // ----------------------------- create -----------------------------
  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (createdBy) => createdBy.pmtCreatedBy, {
    nullable: true,
  })
  createdBy: User;

  @ManyToOne(() => Agence, (createdOn) => createdOn.pmtCreated, {
    nullable: true,
  })
  createdOn: Agence;

  // ----------------------------- validate -----------------------------
  @Column({
    nullable: true,
  })
  validatedAt: Date;

  @ManyToOne(() => User, (validatedBy) => validatedBy.pmtValidateBy, {
    nullable: true,
  })
  validatedBy: User;

  @ManyToOne(() => Agence, (validatedOn) => validatedOn.pmtValidated, {
    nullable: true,
  })
  validatedOn: Agence;

  // ----------------------------- confirme -----------------------------
  @ManyToOne(() => User, (confirmedBy) => confirmedBy.pmtValidateBy, {
    nullable: true,
  })
  confirmedBy: User;

  @Column({
    nullable: true,
  })
  confirmedAt: Date;

  // ----------------------------- info client -----------------------------
  @Column({
    type: 'float',
    nullable: true,
  })
  tauxC_O_D: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  tarifRetour: number;

  @ManyToOne(() => Wilaya, (confirmedBy) => confirmedBy.departurPmt, {
    nullable: true,
  })
  wilayaDeparPmt: Wilaya;

  @ManyToOne(() => Client, (client) => client.pmts, {
    nullable: true,
  })
  client: Client;

  @Column({
    nullable: true,
  })
  tarifs: string;
  // ----------------------------- info pmt -----------------------------
  @Column({
    type: 'float',
    nullable: true,
  })
  montantRamasser: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  FraisD_envois: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  montantC_O_D: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  FraisRetour: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  netClient: number;

  @OneToMany(() => Shipment, (shipments) => shipments.pmt)
  shipments: Shipment[];
  // ----------------------------- info shipment -----------------------------
  @Column({
    nullable: true,
  })
  nbShipmentLivrer: number;

  @Column({
    nullable: true,
  })
  nbShipmentRetour: number;
}
