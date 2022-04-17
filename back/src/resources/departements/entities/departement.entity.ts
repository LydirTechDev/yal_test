import { Fonction } from "src/resources/fonctions/entities/fonction.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Departement {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @OneToMany(()=> Fonction, (functions)=> functions.departement)
    fonctions: Function[];
}
