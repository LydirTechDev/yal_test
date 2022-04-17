import { ICodeTarif } from './i-code-tarif';

export interface ICreateService {
  nom: string;
  codeTarif: ICodeTarif[];
}
