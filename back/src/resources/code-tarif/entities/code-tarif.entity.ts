import { ClientsTarif } from "src/resources/clients-tarifs/entities/clients-tarif.entity";
import { CodeTarifsZone } from "src/resources/code-tarifs-zones/entities/code-tarifs-zone.entity";
import { Service } from "src/resources/services/entities/service.entity";
import { PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Entity } from "typeorm";

@Entity()
export class CodeTarif {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    nom: string;
  
    @Column()
    isStandard: boolean;
  
    @ManyToOne(() => Service, (service) => service.codeTarif)
    service: Service;
    
    @OneToMany(()=> CodeTarifsZone, (codeTarifZone)=> codeTarifZone.codeTarif)
    codeTarifZone: CodeTarifsZone[];

    @OneToMany(() => ClientsTarif, (clientsTarifs) => clientsTarifs.codeTarif)
    clientsTarifs: ClientsTarif[];
}
