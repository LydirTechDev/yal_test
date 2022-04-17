import { Agence } from 'src/resources/agences/entities/agence.entity';
import { Commune } from 'src/resources/communes/entities/commune.entity';
import { Pmt } from 'src/resources/pmt/entities/pmt.entity';
import { Sac } from 'src/resources/sac/entities/sac.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  orderBy: {
    nomLatin: 'ASC',
  },
})
export class Wilaya {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  codeWilaya: string;

  @Column({ nullable: false, unique: true })
  nomLatin: string;

  @Column({ nullable: false, unique: true })
  nomArabe: string;

  @Column({ nullable: true })
  dureeReceptionRecolte: number;

  @CreateDateColumn({
    select: false,
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

  @OneToMany(() => Commune, (commune) => commune.wilaya)
  communes: Commune[];

  @OneToMany(() => Sac, (sac) => sac.wilayaDestination)
  sac: Sac[];

  /**
   * recupération colis retoures
   */

  @ManyToOne(() => Agence, (agence) => agence.wilayaRetour, {
    nullable: true,
  })
  agenceRetour: Agence;
  @ManyToOne(() => Agence, (agence) => agence.wilayaCaisse, { nullable: true })
  caisseRegional: Agence;

  @OneToMany(() => Pmt, (departurPmt) => departurPmt.wilayaDeparPmt)
  departurPmt: Pmt[];
}
