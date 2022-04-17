import { IWilaya } from '../wilaya/i-wilaya';
import { IZone } from '../zone/i-zone';

export interface IRotation {
  id: number;
  wilayaDepart: IWilaya;
  wilayaDestination: IWilaya;
  zone: IZone;
}
