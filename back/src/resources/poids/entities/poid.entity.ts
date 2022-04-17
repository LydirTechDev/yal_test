import { CodeTarifsZone } from "src/resources/code-tarifs-zones/entities/code-tarifs-zone.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Poid {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "float",
        nullable: false
    })
    min: number;

    @Column({
        type: "float",
        nullable: false
    })
    max: number

    @OneToMany(() => CodeTarifsZone, (codeTarifZone) => codeTarifZone.poids)
    codeTarifZone: CodeTarifsZone[];
}
