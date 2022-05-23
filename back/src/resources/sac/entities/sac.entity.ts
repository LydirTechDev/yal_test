import { SacTypeEnum } from 'src/enums/sacTypeEnum';
import { Agence } from 'src/resources/agences/entities/agence.entity';
import { SacShipment } from 'src/resources/sac-shipments/entities/sac-shipment.entity';
import { User } from 'src/resources/users/entities/user.entity';
import { Wilaya } from 'src/resources/wilayas/entities/wilaya.entity';
import {
  AfterInsert,
  Column,
  CreateDateColumn,
  Entity,
  InsertEvent,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Sac {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    unique: true,
  })
  tracking: string;

  @Column('enum', {
    nullable: false,
    enum: SacTypeEnum,
  })
  typeSac: SacTypeEnum;

  @ManyToOne(() => Wilaya, (wilaya) => wilaya.sac)
  wilayaDestination: Wilaya;

  @ManyToOne(() => Agence, (agence) => agence.sac)
  agenceDestination: Agence;

  @ManyToOne(() => User, (user) => user)
  user: User;

  @OneToMany(() => SacShipment, (sacShipment) => sacShipment.sac)
  sacShipment: SacShipment[];

  @CreateDateColumn()
  createdAt: Date;
}
