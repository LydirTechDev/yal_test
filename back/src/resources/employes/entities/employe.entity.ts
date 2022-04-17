import { Agence } from 'src/resources/agences/entities/agence.entity';
import { Banque } from 'src/resources/banques/entities/banque.entity';
import { Fonction } from 'src/resources/fonctions/entities/fonction.entity';
import { User } from 'src/resources/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Employe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codeEmploye: string;

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
  nss: string;

  @Column({ nullable: true })
  numCompteBancaire: string;

  @Column({ nullable: true })
  genre: string;

  @Column({ nullable: true })
  groupeSanguin: string;

  @Column({ nullable: true })
  dateRecrutement: Date;

  @Column({ nullable: true })
  typeContrat: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Fonction, (fonction) => fonction.employes)
  fonction: Fonction;

  @ManyToOne(() => Banque, (banque) => banque.employes)
  banque: Banque;

  @ManyToOne(() => Agence, (agence) => agence.employes)
  agence: Agence;
}
