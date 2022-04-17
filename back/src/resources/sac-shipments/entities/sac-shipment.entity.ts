import { Sac } from "src/resources/sac/entities/sac.entity";
import { Shipment } from "src/resources/shipments/entities/shipment.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SacShipment {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({
        primary: true
    })
    createdAt: Date;
    
    @ManyToOne(() => Shipment, (shipment) => shipment.sacShipments)
    shipment: Shipment;

    @ManyToOne(() => Sac, (sac) => sac.sacShipment)
    sac: Sac;
}
