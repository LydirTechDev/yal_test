import { CodeTarif } from 'src/resources/code-tarif/entities/code-tarif.entity';
import { Shipment } from 'src/resources/shipments/entities/shipment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  nom: string;

  @OneToMany(() => Shipment, (shipment) => shipment.service)
  shipments: Shipment[];

  @OneToMany(() => CodeTarif, (codeTarif) => codeTarif.service)
  codeTarif: CodeTarif[];
}
