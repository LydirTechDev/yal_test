import { InternalServerErrorException } from '@nestjs/common';
import { TypeUserEnum } from 'src/enums/TypeUserEnum';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Status } from 'src/resources/status/entities/status.entity';
import { Client } from 'src/resources/clients/entities/client.entity';
import { Employe } from 'src/resources/employes/entities/employe.entity';
import { Coursier } from 'src/resources/coursier/entities/coursier.entity';
import { Recolte } from 'src/resources/recoltes/entities/recolte.entity';
import { Pmt } from 'src/resources/pmt/entities/pmt.entity';
import { Shipment } from 'src/resources/shipments/entities/shipment.entity';
import { PmtCoursier } from 'src/resources/pmt-coursier/entities/pmt-coursier.entity';
import { Facture } from 'src/resources/facture/entities/facture.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique:true,
    length: 50,
  })
  email: string;

  @Column({
    nullable: false,
    select: false,
    length: 255,
  })
  password: string;

  @Column({
    default: false,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleatedAt: Date;

  @Column({
    type: 'enum',
    enum: TypeUserEnum,
    nullable: false,
  })
  typeUser: TypeUserEnum;

  @Column({
    nullable: true,
  })
  lastIP: string;

  @OneToMany(() => Status, (status) => status.user)
  status: Status[];

  @OneToOne(() => Client, (client) => client.user)
  client: Client;

  @OneToOne(() => Employe, (employe) => employe.user)
  employe: Employe;

  @OneToOne(() => Coursier, (cousier) => cousier.user)
  coursier: Coursier;

  @OneToMany(() => Recolte, (recolteCreateBy) => recolteCreateBy.createdBy)
  recolteCreateBy: Recolte[];

  @OneToMany(() => Shipment, (shipmentCreateBy) => shipmentCreateBy.createdBy)
  shipmentCreateBy: Shipment[];

  @OneToMany(
    () => Recolte,
    (recolteCoursier) => recolteCoursier.recolteCoursier,
  )
  recolteCoursier: Recolte;

  @OneToMany(() => Recolte, (recolteCs) => recolteCs.recolteCS)
  recolteCs: Recolte;

  @OneToMany(() => Recolte, (recolteReceivedBy) => recolteReceivedBy.receivedBy)
  recolteReceivedBy: Recolte[];

  @OneToMany(() => Pmt, (pmtCreatedBy) => pmtCreatedBy.createdBy)
  pmtCreatedBy: Pmt[];

  @OneToMany(() => Pmt, (pmtValidateBy) => pmtValidateBy.validatedBy)
  pmtValidateBy: Pmt[];

  @OneToMany(() => Pmt, (pmtConfirmedBy) => pmtConfirmedBy.confirmedBy)
  pmtConfirmedBy: Pmt[];
  @OneToMany(() => Shipment, (shipmentsLiberer) => shipmentsLiberer.libererBy)
  shipmentsLiberer: Shipment[];

  @OneToMany(() => Shipment, (shipmentsCreated) => shipmentsCreated.createdBy)
  shipmentsCreated: Shipment[];
  
  @OneToMany(
    () => PmtCoursier,
    (pmtCoursierCreatedBy) => pmtCoursierCreatedBy.createdBy,
  )
  pmtCoursierCreatedBy: PmtCoursier[];
  @OneToMany(() => Facture, (facture) => facture.createdBy)
  facture: Facture[];

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
