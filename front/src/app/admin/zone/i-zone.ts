import { IRotation } from '../rotations/i-rotation';
import { ICodeTarifsZone } from '../tarifications/icode-tarifs-zone';

export interface IZone {
  id: number;
  codeZone: string;
  rotations?: IRotation[];
  codeTarifsZones?: ICodeTarifsZone[];
}
