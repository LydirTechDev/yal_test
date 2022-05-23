import { Agence } from 'src/resources/agences/entities/agence.entity';
import { Facture } from 'src/resources/facture/entities/facture.entity';
import { User } from 'src/resources/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RecolteFacture {
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

  @OneToOne(() => Facture, (facture) => facture.recolte, {
    nullable: true,
  })
  @JoinColumn()
  facture: Facture;

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
}
