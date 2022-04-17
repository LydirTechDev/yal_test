import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { environment } from 'src/environments/environment';
import { ICodeTarif } from './i-code-tarif';
import { ICreateService } from './i-create-service';
import { IService } from './i-service';

@Injectable({
  providedIn: 'root',
})
export class TarificationService {
  newServices: IService[] = [];
  createdService: ICreateService = {
    nom: '',
    codeTarif: [],
  };

  createCodeTarif: ICodeTarif = {
    nom: '',
    isStandard: true,
    codeTarifZone: [],
  };

  createdServicesIsLoading: boolean = false;

  inCreatingNewService: BehaviorSubject<boolean>;

  mxAutoToCard: string = 'mx-auto';

  editPadingMarginCard: BehaviorSubject<string>;

  /**
   * turn to false if list services is hiden
   */
  showServiceList: BehaviorSubject<boolean>;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private sweetAlertService: SweetAlertService,
    private http: HttpClient, 
  ) {
    this.inCreatingNewService = new BehaviorSubject(false);
    this.showServiceList = new BehaviorSubject(false);
    this.editPadingMarginCard = new BehaviorSubject('card-body');
  }

  /**
   * modifier le >=0
   * @returns
   */
  checkIfCreatingService(): boolean {
    if (this.inCreatingNewService.value == true) {
      console.log(
        '🚀~~~~~~~~~~~~~~~~~~~~~~~~TRUE~~~~~~~~~~~~~~~~~~~~~~~~',
        this.inCreatingNewService.value
      );
      return true;
    }
    return false;
  }

  /**
   * got to configure new service
   */
  configureNewService() {
    if (!this.checkIfCreatingService()) {
      this._router.navigateByUrl('admin/tarifications/create-new-service');
      this.inCreatingNewService.next(true);
      this.showListServices();
    } else {
      this._router.navigate(['admin/tarifications/']);
      this.newServices = [];
      this.inCreatingNewService.next(false);
    }
  }

  /**
   * got to configure new service
   */
  configureNewCodeTarif(serviceName: string) {
    console.log(
      '🚀 ~ file: tarification.service.ts ~ line 72 ~ TarificationService ~ serviceName',
      serviceName
    );
    if (!this.checkIfCreatingService()) {
      this.createdService.nom = serviceName;
      this.createdService.codeTarif = [];
      this.newServices.push(this.createdService);
      this._router.navigateByUrl('admin/tarifications/create-new-service');
      this.inCreatingNewService.next(true);
      this.showListServices();
    } else {
      this._router.navigate(['admin/tarifications/']);
      this.newServices = [];
      this.inCreatingNewService.next(false);
    }
  }

  showListServices() {
    this.mxAutoToCard = '';
    this.showServiceList.next(true);
  }

  /**
   * cancel configuring service
   * @param goToUrl
   */
  cancelCreateService(goToUrl: string) {
    if (this.checkIfCreatingService()) {
      this.sweetAlertService
        .basicConfirmWarning('Annuler la configuration su sérvice')
        .then(
          (responce) => {
            if (responce.value) {
              this.editPadingMarginCard.next('card-body');
              this._router.navigate([`${goToUrl}`]);
              this.inCreatingNewService.next(false);
              this.newServices = [];
            }
          },
          (error) => {
            console.log(
              '🚀 ~ file: create-service.component.ts ~ line 43 ~ CreateServiceComponent ~ cancelCreateService ~ error',
              error
            );
          }
        );
    }
  }

  redirecteAfterCreate(){
    this.editPadingMarginCard.next('card-body');
    this._router.navigate(['admin/tarifications']);
    this.inCreatingNewService.next(false);
    this.newServices = [];
  }
  onSelectService(i: number): Observable<string> {
    if (i == 0) {
      return new BehaviorSubject('info');
    } else {
      return new BehaviorSubject('light');
    }
  }

  /**
   * depanage
   */
  /**
   * close detail service
   */
  closeServiceDetail() {
    this._router.navigate(['admin/tarifications']);
  }
  createTarifsByFile(tarifications) {
    return this.http.post<any[]>(`${environment.apiV1}code-tarifs-zones/createTarifsByFile`, tarifications);

  }
}
