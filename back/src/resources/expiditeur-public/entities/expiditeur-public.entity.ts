import { Shipment } from 'src/resources/shipments/entities/shipment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExpiditeurPublic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  adresseExp: string;

  @Column({
    nullable: true,
  })
  raisonSocialeExp: string;

  @Column({
    nullable: true,
  })
  nomExp: string;

  @Column({
    nullable: true,
  })
  prenomExp: string;

  @Column({
    nullable: true,
  })
  telephoneExp: string;

  @Column({
    nullable: true,
  })
  numIdentite: string;

  @OneToMany(() => Shipment, (shipments) => shipments.expiditeurPublic)
  shipments: Shipment[];
}
