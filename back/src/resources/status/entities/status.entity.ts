import { StatusShipmentEnum } from 'src/enums/status.shipment.enum';
import { Agence } from 'src/resources/agences/entities/agence.entity';
import { Shipment } from 'src/resources/shipments/entities/shipment.entity';
import { User } from 'src/resources/users/entities/user.entity';
import {
  PrimaryColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';

@Entity({
  orderBy: {
    createdAt: 'ASC',
  },
})
export class Status {
  @ManyToOne(() => User, (user) => user.status, {
    primary: true,
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Shipment, (shipment) => shipment.id, {
    nullable: false,
    primary: true,
  })
  shipment: Shipment;

  @ManyToOne(() => User, (userAfect) => userAfect.status)
  userAffect: User;

  @PrimaryColumn('enum', {
    nullable: false,
    enum: StatusShipmentEnum,
  })
  libelle: StatusShipmentEnum;

  @Column({
    nullable: true,
  })
  comment: string;

  @ManyToOne(() => Agence, (agence) => agence.id, {
    nullable: true,
  })
  createdOn: number;
  
  @CreateDateColumn({
    primary: true,
    select: true,
  })
  createdAt: Date;

  @UpdateDateColumn({
    select: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    select: false,
  })
  deleatedAt: Date;
}
