import { JourSemaineEnum } from "src/app/core/models/JourSemaineEnum";

export interface ICreateCommune {
  codePostal: string;
  nomLatin: string;
  nomArabe: string;
  journeeLivraison: JourSemaineEnum[];
  livraisonDomicile: boolean;
  livraisonStopDesck: boolean;
  stockage: boolean;
  livrable: boolean;
  wilayaId: number;
}
