import { AgencesTypesEnum } from "./agencesTypesEnum";

export interface ICreateAgence {
  nom: string;
  adresse: string;
  type: AgencesTypesEnum
  nrc: string;
  nif: string;
  nis: string;
  nAI: string;
  communeId: number;
}
