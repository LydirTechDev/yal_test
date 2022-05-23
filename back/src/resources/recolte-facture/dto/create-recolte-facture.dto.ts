import { IsNumber } from 'class-validator';

export class CreateRecolteFactureDto {

    @IsNumber()
    factureId: number;

    @IsNumber()
    createdBy: number;

    @IsNumber()
    createdOn: number;

    @IsNumber()
    receivedBy: number;

    @IsNumber()
    receivedOn: number;
}
