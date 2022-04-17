import { ICommune } from '../commune/i-commune';
import { AgencesTypesEnum } from './agencesTypesEnum';

export interface IAgence {
  id: number;
  nom: string;
  type: AgencesTypesEnum;
  code: string;
  adresse: string;
  nAI: string;
  nrc: string;
  nif: string;
  nis: string;
  commune: ICommune;
}
