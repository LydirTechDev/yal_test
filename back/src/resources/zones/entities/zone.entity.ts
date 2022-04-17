import { CodeTarifsZone } from "src/resources/code-tarifs-zones/entities/code-tarifs-zone.entity";
import { Rotation } from "src/resources/rotations/entities/rotation.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Zone {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: false
    })
    codeZone: string;

    @OneToMany(()=> Rotation, (rotations)=> rotations.zone)
    rotations: Rotation[]

    @OneToMany(()=> CodeTarifsZone, (codeTarifsZones)=> codeTarifsZones.zone)
    codeTarifsZones: CodeTarifsZone[];
}
