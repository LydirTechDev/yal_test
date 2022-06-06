import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { IZone } from '../../zone/i-zone';
import { CodeTarifService } from '../code-tarif.service';
import { ICodeTarif } from '../i-code-tarif';
import { ICreateService } from '../i-create-service';
import { IService } from '../i-service';
import { ServiceService } from '../service.service';
import { TarificationService } from '../tarification.service';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss'],
})
export class CreateServiceComponent implements OnInit {
  /**
   * card title
   */
  cardTitle: string;
  nameStep: string = '';
  numStep: string;

  newServices: IService[] = [];
  createdService: ICreateService;
  createCodeTarif: ICodeTarif;

  serviceNameForm: FormGroup; // bootstrap service form
  codeTarifForm: FormGroup; // bootstrap codeTarif form

  statusForm: string;
  statusCodeTarifForm: string;

  serviceName: string;
  codeTarifName: string;

  progressConfigService: number = 0;
  progressConfigServiceColor: string = 'danger';

  validating: boolean;

  zones: IZone[];
  constructor(
    private router: Router,
    private sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private codeTarifService: CodeTarifService,
    public tarificationService: TarificationService
  ) {
    this.validating = false;
    /**
     * init form
     */
    this.serviceNameForm = this.formBuilder.group({
      serviceName: new FormControl(this.serviceName, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
    });

    this.codeTarifForm = this.formBuilder.group({
      codeTarifName: new FormControl(this.codeTarifName, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
    });

    this.serviceService.getAllZone().subscribe((response) => {
      console.log(
        '🚀 ~ file: create-service.component.ts ~ line 88 ~ CreateServiceComponent ~ this.serviceService.getAllZone ~ response',
        response
      );
      this.zones = response;
    });
  }

  ngOnInit(): void {
    this.createCodeTarif = {
      nom: '',
      isStandard: true,
      codeTarifZone: [],
    };
    this.createdService = {
      nom: '',
      codeTarif: [],
    };
    this.cardTitle = 'Configurer un nouveau service';
    /**
     * if inCreatingNewService == false redirect to admin/tarification
     */
    if (
      this.tarificationService.checkIfCreatingService() &&
      this.tarificationService.newServices.length > 0
    ) {
      this.tarificationService.inCreatingNewService.next(true);
      this.tarificationService.editPadingMarginCard.next('p-0 m-0');
      this.newServices = this.tarificationService.newServices;

      this.numStep = this.newServices.length.toString();
      this.createdService = this.newServices[0];

      if (this.newServices.length >= 1) {
        this.numStep = (
          this.newServices.length + this.newServices[0].codeTarif.length
        ).toString();
        this.createCodeTarif = this.newServices[0].codeTarif[0];
      }

      switch (parseInt(this.numStep) + 1) {
        case 1: {
          this.nameStep = 'NOM DU NOUVEAU SERVICE';
          this.serviceNameForm.patchValue({
            serviceName: this.createdService.nom,
          });
          break;
        }
        case 2: {
          this.nameStep = 'NOM DU NOUVEAU code tarif';
          this.numStep = '2';
          this.progressConfigService = 20;
          this.progressConfigServiceColor = 'danger';
          this.codeTarifForm.patchValue({
            codeTarifName: this.createCodeTarif.nom || '',
          });
          break;
        }
        default:
          break;
      }
    } else {
      this.tarificationService.inCreatingNewService.next(true);
      this.nameStep = 'NOM DU NOUVEAU SERVICE';
      this.numStep = '1';
      this.tarificationService.showServiceList.next(true);
      this.tarificationService.editPadingMarginCard.next('p-0 m-0');
    }
  }

  /**
   * save new service name
   */
  saveNewServiceName() {
    this.createdService.nom =
      this.serviceNameForm.controls['serviceName'].value;
    this.createdService.codeTarif = [];
    this.newServices.push(this.createdService);

    this.tarificationService.newServices = this.newServices;

    this.numStep = '2';
    this.nameStep = 'Nom du code tarif';
    this.progressConfigService = 20;
    this.progressConfigServiceColor = 'danger';
  }

  saveNewCodeTarif() {
    // this.createCodeTarif.isStandard = true;
    // console.log(
    //   '🚀 ~ file: create-service.component.ts ~ line 170 ~ CreateServiceComponent ~ this.createCodeTarif',
    //   this.createCodeTarif
    // );
    // this.createCodeTarif.nom =
    //   this.codeTarifForm.controls['codeTarifName'].value;
    this.createdService.codeTarif[0] = {
      nom: this.codeTarifForm.controls['codeTarifName'].value,
      isStandard: true,
      codeTarifZone: [],
    };
    this.tarificationService.newServices = [];
    this.progressConfigService = 40;
    this.progressConfigServiceColor = 'warning';
    this.tarificationService.newServices = this.newServices;
    console.log(this.createdService);
    this.nameStep = 'Tarifs de ' + this.createdService.codeTarif[0].nom;
    this.numStep = '3';
  }

  /**
   * dynamique validate service name
   * @param serviceName
   */
  // validateServiceNameForm(serviceName: string) {
  //   this.validating = false;
  //   this.serviceService
  //     .chekIfServiceExist(serviceName)
  //     .subscribe((responce) => {
  //       if (!responce == false) {
  //         this.validating = false;
  //         this.sweetAlertService.sipmleAlert(
  //           'warning',
  //           'ce service existe',
  //           '',
  //           'top-right',
  //           false
  //         );
  //         this.statusForm = 'is-invalid';
  //       } else {
  //         this.validating = true;
  //         this.statusForm = 'is-valid';
  //       }
  //     });
  // }

  // validateServiceCodeTarifForm(codeTarifName: string) {
  //   this.validating = false;
  //   this.codeTarifService
  //     .chekIfServiceExist(codeTarifName)
  //     .subscribe((responce) => {
  //       if (!responce == false) {
  //         this.validating = false;
  //         this.sweetAlertService.sipmleAlert(
  //           'warning',
  //           'ce code tarif existe',
  //           '',
  //           'top-right',
  //           false
  //         );
  //         this.statusForm = 'is-invalid';
  //       } else {
  //         this.validating = true;
  //         this.statusForm = 'is-valid';
  //       }
  //     });
  // }
  /**
   * cancel configuring service
   */
  cancelCreateService() {
    this.tarificationService.cancelCreateService('admin/tarifications');
  }
}
