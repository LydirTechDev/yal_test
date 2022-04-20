import { Agence } from 'src/resources/agences/entities/agence.entity';
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
  @OneToMany(() => Shipment, (shipment) => shipment.recolte, {
    nullable: true,
  })
  shipment: Shipment[];

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
}
