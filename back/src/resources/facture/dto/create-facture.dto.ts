import { IsBoolean, IsNumber } from 'class-validator';

export class CreateFactureDto {
    @IsNumber()
    clientId: number;

    @IsNumber()
    montantTotal: number;

    @IsNumber()
    employeId: number;

    @IsNumber()
    nbrColis: number;

    @IsBoolean()
    espece: boolean;

    @IsNumber()
    montantTva: number;

    @IsNumber()
    montantTtc: number;

    @IsNumber()
    montantTimbre: number;

    @IsNumber()
    montantHoreTaxe: number
}