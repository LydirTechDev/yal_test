import { Agence } from 'src/resources/agences/entities/agence.entity';
import { PmtCoursier } from 'src/resources/pmt-coursier/entities/pmt-coursier.entity';
import { User } from 'src/resources/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Entity,
  OneToMany,
} from 'typeorm';
@Entity()
export class Coursier {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ nullable: true })
  dateNaissance: Date;

  @Column({ nullable: true })
  lieuNaissance: string;

  @Column({ nullable: true })
  adresse: string;

  @Column()
  numTelephone: string;

  @Column({ nullable: true })
  dateRecrutement: Date;

  @Column({ nullable: true })
  typeContrat: string;

  @ManyToOne(() => Agence, (agence) => agence.coursier)
  agence: Agence;

  @Column()
  montantRamassage: number;

  @Column()
  montantLivraison: number;

  @Column({ nullable: true })
  MarqueVehicule: string;

  @Column({ nullable: true })
  immatriculationVehicule: string;

  @OneToOne((type) => User, (user) => user.coursier)
  @JoinColumn()
  user: User;
  @OneToMany(() => PmtCoursier, (pmtCoursier) => pmtCoursier.coursier)
  pmtCoursier: PmtCoursier[];
}
