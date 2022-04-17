import { JourSemaineEnum } from 'src/enums/JourSemaineEnum';
import { Agence } from 'src/resources/agences/entities/agence.entity';
import { Client } from 'src/resources/clients/entities/client.entity';
import { Shipment } from 'src/resources/shipments/entities/shipment.entity';
import { Wilaya } from 'src/resources/wilayas/entities/wilaya.entity';
import {
  DeleteDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  OneToMany,
} from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';

@Entity()
export class Commune {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  codePostal: string;

  @Column({ nullable: false })
  nomLatin: string;

  @Column({ nullable: false })
  nomArabe: string;

  @Column({
    nullable: true,
    default: false,
  })
  livraisonDomicile: boolean;

  @Column({
    nullable: true,

  })
  livraisonStopDesck: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  livrable: boolean;

  @Column('enum', {
    nullable: true,
    enum: JourSemaineEnum,
    array: true,
  })
  journeeLivraison: JourSemaineEnum[];

  @Column({
    nullable: true,
  })
  stockage: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({
    select: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    select: false,
  })
  deleatedAt: Date;

  @ManyToOne(() => Wilaya, (wilaya) => wilaya.communes)
  wilaya: Wilaya;

  @OneToMany(() => Shipment, (shipment) => shipment.commune)
  shipments: Shipment[];

  @OneToMany(() => Client, (client) => client.communeDepart)
  clientsDepart: Client[];

  @OneToMany(() => Client, (client) => client.communeResidence)
  clientsResident: Client[];

  @OneToMany(() => Agence, (agences) => agences.commune)
  agences: Agence[];
}
