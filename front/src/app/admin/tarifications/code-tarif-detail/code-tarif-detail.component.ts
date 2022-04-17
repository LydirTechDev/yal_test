import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { IZone } from '../../zone/i-zone';
import { ZoneService } from '../../zone/zone.service';
import { ICodeTarif } from '../i-code-tarif';
import { ICodeTarifsZone } from '../icode-tarifs-zone';

@Component({
  selector: 'app-code-tarif-detail',
  templateUrl: './code-tarif-detail.component.html',
  styleUrls: ['./code-tarif-detail.component.scss'],
})
export class CodeTarifDetailComponent implements OnInit, OnDestroy {
  /**
   * card title
   */
  cardTitle: string;

  zonesData: any[];
  route: ActivatedRouteSnapshot;

  @Input() zone: IZone[];

  isloadingData: boolean;

  constructor(private zoneServices: ZoneService) {
    this.isloadingData = true;
    console.log('++++++++++++++');
  }

  ngOnDestroy(): void {
    console.log('***************');
  }

  ngOnInit(): void {
    this.isloadingData = false;
  }
}
