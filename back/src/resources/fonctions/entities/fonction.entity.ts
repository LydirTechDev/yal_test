import { Departement } from 'src/resources/departements/entities/departement.entity';
import { Employe } from 'src/resources/employes/entities/employe.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Fonction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({
      nullable: true,
  })
  dureeEssai: string;

  @OneToMany(() => Employe, (employes) => employes.fonction)
  employes: Employe[];

  @ManyToOne(() => Departement, (departement) => departement.fonctions)
  departement: Departement;
}
