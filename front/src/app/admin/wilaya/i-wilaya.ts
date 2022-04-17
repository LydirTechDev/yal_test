import { IAgence } from "../agence/i-agence";

export interface IWilaya {
  id: number;
  codeWilaya: string;
  nomArabe: string;
  nomLatin: string;
  agenceRetour: IAgence;
}
