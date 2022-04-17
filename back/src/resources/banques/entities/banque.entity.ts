import { Employe } from 'src/resources/employes/entities/employe.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  orderBy: {
    nom: 'ASC',
  },
})
export class Banque {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  nom: string;

  @OneToMany(() => Employe, (employes) => employes.banque)
  employes: Employe[];
}
