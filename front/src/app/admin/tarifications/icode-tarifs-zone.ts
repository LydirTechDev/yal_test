import { IZone } from "../zone/i-zone";
import { ICodeTarif } from "./i-code-tarif";
import { IPoid } from "./i-poid";

export interface ICodeTarifsZone {
  id?: number;
  zone: IZone;
  poids?: IPoid;
  delay?: number
  tarifStopDesk: number;
  tarifDomicile: number;
  tarifPoidsParKg?: number;
  codeTarif?: ICodeTarif;
}
