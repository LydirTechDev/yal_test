import { IsBoolean, IsNumber } from 'class-validator';

export class EstimateTarifDto {
  @IsNumber()
  communeId: number;

  @IsNumber()
  poids: number;

  @IsNumber()
  longueur: number;

  @IsNumber()
  largeur: number;

  @IsNumber()
  hauteur: number;

  @IsNumber()
  wilayaId: number;

  @IsBoolean()
  livraisonDomicile: boolean;

  @IsBoolean()
  livraisonStopDesck: boolean;

  @IsNumber({
    allowNaN: true,
  })
  serviceId: number = NaN;
}
