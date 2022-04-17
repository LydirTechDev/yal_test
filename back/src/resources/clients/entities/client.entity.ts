import { delaiPaiementEnum } from 'src/enums/delaiPaiementEnum';
import { JourSemaineEnum } from 'src/enums/JourSemaineEnum';
import { Agence } from 'src/resources/agences/entities/agence.entity';
import { ClientsTarif } from 'src/resources/clients-tarifs/entities/clients-tarif.entity';
import { Commune } from 'src/resources/communes/entities/commune.entity';
import { Pmt } from 'src/resources/pmt/entities/pmt.entity';
import { User } from 'src/resources/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Entity,
} from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numClient: string;

  @Column()
  raisonSociale: string;

  @Column()
  nomCommercial: string;

  @Column()
  adresse: string;

  @Column()
  telephone: string;

  @Column()
  nomGerant: string;

  @Column()
  prenomGerant: string;

  @Column()
  nrc: string;

  @Column()
  nif: string;

  @Column()
  nis: string;

  @Column()
  nbEnvoiMin: number;

  @Column()
  nbEnvoiMax: number;

  @Column()
  nbTentative: number;

  @Column()
  poidsBase: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  tauxCOD: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  c_o_d_ApartirDe: number;

  @Column({
    nullable: true,
  })
  moyenPayement: string;

  @Column('enum', {
    nullable: true,
    enum: JourSemaineEnum,
    array: true,
  })
  jourPayement: JourSemaineEnum[];

  @Column('enum', {
    nullable: true,
    enum: delaiPaiementEnum,
  })
  delaiPaiement: delaiPaiementEnum;

  @Column()
  tarifRetour: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  latitude: number;

  @Column({
    nullable: true,
  })
  longitude: number;

  @ManyToOne(() => Commune, (commune) => commune.clientsResident)
  communeResidence: Commune;

  @ManyToOne(() => Commune, (commune) => commune.clientsDepart)
  communeDepart: Commune;

  @OneToOne(() => User, (user) => user)
  @JoinColumn()
  user: User;

  @OneToMany(() => ClientsTarif, (clientsTarifs) => clientsTarifs.client)
  clientsTarifs: ClientsTarif[];

  @ManyToOne(() => Agence, (agence) => agence)
  agenceRetour: Agence;

  @ManyToOne(() => Agence, (caisseAgence) => caisseAgence.clients, {
    nullable: true,
  })
  caisseAgence: Agence;
  @OneToMany(() => Pmt, (pmts) => pmts.client)
  pmts: Pmt[];
}
