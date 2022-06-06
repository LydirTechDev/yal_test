import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ServiceClient {
    @PrimaryGeneratedColumn()
    id: number;
}
