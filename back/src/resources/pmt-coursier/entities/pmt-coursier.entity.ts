import { Agence } from 'src/resources/agences/entities/agence.entity';
import { Coursier } from 'src/resources/coursier/entities/coursier.entity';
import { Shipment } from 'src/resources/shipments/entities/shipment.entity';
import { User } from 'src/resources/users/entities/user.entity';
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
export class PmtCoursier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  tracking: string;

  // ----------------------------- create -----------------------------
  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (createdBy) => createdBy.pmtCoursierCreatedBy, {
    nullable: true,
  })
  createdBy: User;

  @ManyToOne(() => Agence, (createdOn) => createdOn.pmtCoursierCreatedOn, {
    nullable: true,
  })
  createdOn: Agence;

  // ---------------------------- client ---------------------

  @ManyToOne(() => Coursier, (coursier) => coursier.pmtCoursier, {
    nullable: true,
  })
  coursier: Coursier;

  @Column({
    nullable: true,
  })
  montantTotal: number;

  // ----------------------------- info shipment -----------------------------

  @OneToMany(() => Shipment, (shipments) => shipments.pmtCoursier)
  shipments: Shipment[];

  @Column({
    nullable: true,
  })
  nbrColis: number;
}
