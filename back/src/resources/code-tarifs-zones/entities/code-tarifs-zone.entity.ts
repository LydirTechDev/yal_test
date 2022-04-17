import { CodeTarif } from 'src/resources/code-tarif/entities/code-tarif.entity';
import { Poid } from 'src/resources/poids/entities/poid.entity';
import { Zone } from 'src/resources/zones/entities/zone.entity';
import {
  Column,
  Entity,
  Generated,
  Index,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('code_tarifs_zone')
export class CodeTarifsZone {
  @Generated('increment')
  @Index({ unique: true })
  @Column()
  id: number;

  @PrimaryColumn()
  codeTarifId: number;
  @ManyToOne(() => CodeTarif, (codeTarif) => codeTarif.codeTarifZone)
  codeTarif: CodeTarif;

  @PrimaryColumn()
  zoneId: number;
  @ManyToOne(() => Zone, (zone) => zone.codeTarifsZones)
  zone: Zone;

  @PrimaryColumn()
  poidsId;
  @ManyToOne(() => Poid, (poids) => poids.codeTarifZone)
  poids: Poid;

  @Column({
    nullable: true,
    type: 'float',
  })
  tarifStopDesk: number;

  @Column({
    nullable: true,
  })
  delay: number;

  @Column({
    nullable: false,
    type: 'float',
  })
  tarifDomicile: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  tarifPoidsParKg: number;
}
