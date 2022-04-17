import { Wilaya } from 'src/resources/wilayas/entities/wilaya.entity';
import { Zone } from 'src/resources/zones/entities/zone.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Index(['wilayaDepartId', 'wilayaDestinationId'], { unique: true })
export class Rotation {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  wilayaDepartId: number;

  @ManyToOne(() => Wilaya, (wilayaDepart) => wilayaDepart.id, {
    primary: true,
  })
  wilayaDepart: Wilaya;

  @PrimaryColumn()
  wilayaDestinationId: number;
  @ManyToOne(() => Wilaya, (wilayaDestination) => wilayaDestination.id, {
    primary: true,
  })
  wilayaDestination: Wilaya;
  @Column({
    nullable: true,
  })
  rotation: string;
  @Column()
  zoneId: number;
  @ManyToOne(() => Zone, (zone) => zone.rotations)
  zone: Zone;
}
