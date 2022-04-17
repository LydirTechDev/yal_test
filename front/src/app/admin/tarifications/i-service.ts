import { ICodeTarif } from './i-code-tarif';

export interface IService {
  id?: number;
  nom: string;
  codeTarif: ICodeTarif[];
}
