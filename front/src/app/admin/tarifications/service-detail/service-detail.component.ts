import { Component, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { IZone } from '../../zone/i-zone';
import { CodeTarifService } from '../code-tarif.service';
import { IService } from '../i-service';
import { ServiceService } from '../service.service';
import { TarificationService } from '../tarification.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
})
export class ServiceDetailComponent implements OnInit {
  /**
   * card title
   */
  cardTitle: string;

  route: ActivatedRouteSnapshot;

  serviceData: IService;

  isloadingData: boolean;

  isLoadingDataToCodeTarif: boolean;

  selectedCodeTarifName: string = '';
  selectedCodeTarif: IZone[];

  codeTarifForm: FormGroup;

  codeTarifName: FormControl;

  showSelectList: boolean = true;
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _serviceService: ServiceService,
    public formBuilder: FormBuilder,
    private codeTarifService: CodeTarifService,
    public tarificationService: TarificationService
  ) {
    this.route = _route.snapshot;

    this.tarificationService.showServiceList.next(true);
    this.tarificationService.mxAutoToCard = '';
    this.isloadingData = false;
  }

  ngOnInit(): void {
    this.cardTitle = 'Detail services';
    this._getDetailServiceById(Number(this.route.params.id));
    this.codeTarifForm = this.formBuilder.group({
      codeTarifName: [, Validators.required],
    });
  }

  private _getDetailServiceById(serviceId: number) {
    this.isloadingData = true;
    this.isLoadingDataToCodeTarif = true;
    this._serviceService.getDetailServiceById(serviceId).subscribe(
      (responce) => {
        console.log(
          '🚀 ~ file: service-detail.component.ts ~ line 75 ~ ServiceDetailComponent ~ _getDetailServiceById ~ responce',
          responce
        );
        this.serviceData = responce;
        this.isloadingData = false;
      },
      (error) => {
        this.isloadingData = false;
      }
    );
  }

  onSelectCodeTarif() {
    this.showSelectList = false;
    this.isloadingData = true;
    this.codeTarifService
      .getCodeTarifById(this.codeTarifForm.get('codeTarifName').value)
      .subscribe(
        (response) => {
          console.log(
            '🚀 ~ file: service-detail.component.ts ~ line 95 ~ ServiceDetailComponent ~ response',
            response
          );
          this.isloadingData = false;
          response.forEach((zone) => {
            if (zone.codeTarifsZones.length > 0) {
              this.selectedCodeTarifName =
                zone.codeTarifsZones[0].codeTarif.nom;
            }
          });
          this.selectedCodeTarif = response;
        },
        (error) => {
          this.showSelectList = false;
        }
      );
  }

  /**
   * close detail service
   */
  closeServiceDetail() {
    this.showSelectList = true;
    this._getDetailServiceById(Number(this.route.params.id));
    this.codeTarifForm.reset();
    this.selectedCodeTarif = null;
  }
}
