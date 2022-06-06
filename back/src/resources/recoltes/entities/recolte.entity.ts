import { Agence } from 'src/resources/agences/entities/agence.entity';
import { Facture } from 'src/resources/facture/entities/facture.entity';
import { Pmt } from 'src/resources/pmt/entities/pmt.entity';
import { Shipment } from 'src/resources/shipments/entities/shipment.entity';
import { User } from 'src/resources/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Recolte {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    unique: true,
  })
  tracking: string;

  @CreateDateColumn()
  createdAt: Date;
  @Column({
    nullable: true,
  })
  receivedAt: Date;
  // colis
  
  @Column({
    nullable: true,
  })
  typeRtc: string;

  @Column({
    nullable: true,
    type: 'float',
  })
  montant: number;
  
  @OneToMany(() => Shipment, (shipment) => shipment.recolte, {
    nullable: true,
  })
  shipment: Shipment[];

  @OneToMany(() => Pmt, (pmt) => pmt.recolte, {
    nullable: true,
  })
  pmts: Pmt[];

  @OneToMany(() => Facture, (facture) => facture.recolte, {
    nullable: true,
  })
  factures: Facture[];

  
  @OneToMany(() => Shipment, (shipment) => shipment.recolteCs, {
    nullable: true,
  })
  shipmentCs: Shipment[];

  @ManyToOne(() => User, (createdBy) => createdBy.recolteCreateBy)
  createdBy: User;
  @ManyToOne(() => Agence, (createdOn) => createdOn.recolteCreated, {
    nullable: true,
  })
  createdOn: Agence;

  @ManyToOne(() => User, (receivedBy) => receivedBy.recolteReceivedBy, {
    nullable: true,
  })
  receivedBy: User;

  @ManyToOne(() => Agence, (receivedOn) => receivedOn.recolteReceived, {
    nullable: true,
  })
  receivedOn: Agence;
  @ManyToOne(() => User, (coursier) => coursier.recolteCoursier)
  recolteCoursier: User;
  @ManyToOne(() => User, (agentServiceClient) => agentServiceClient.recolteCs)
  recolteCS: User;
}
