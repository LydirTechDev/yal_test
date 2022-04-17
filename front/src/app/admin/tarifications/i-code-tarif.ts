import { ICodeTarifsZone } from './icode-tarifs-zone';

export interface ICodeTarif {
  id?: number;
  nom: string;
  isStandard: boolean;
  codeTarifZone: ICodeTarifsZone[];
}
