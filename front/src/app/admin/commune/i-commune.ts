import { JourSemaineEnum } from 'src/app/core/models/JourSemaineEnum';
import { IWilaya } from '../wilaya/i-wilaya';

export interface ICommune {
  id: number;
  codePostal: string;
  nomLatin: string;
  nomArabe: string;
  livraisonDomicile: boolean;
  livraisonStopDesck: boolean;
  livrable: boolean;
  stockage: boolean;
  journeeLivraison: JourSemaineEnum[];
  createdAt: Date;
  wilaya: IWilaya;
}
