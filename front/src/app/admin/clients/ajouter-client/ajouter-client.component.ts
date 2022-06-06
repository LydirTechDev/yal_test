import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delaiPaiementEnum } from 'src/app/core/models/delaiPaiementEnum';
import { JourSemaineEnum } from 'src/app/core/models/JourSemaineEnum';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-ajouter-client',
  templateUrl: './ajouter-client.component.html',
  styleUrls: ['./ajouter-client.component.scss'],
})
export class AjouterClientComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private sweetalertService: SweetAlertService,
    private router: Router
  ) { }


  listCodeTarif = [];
  listWilaya = [];
  listAgence = [];
  listService = [];
  listServiceBeforePatch = [];

  listCommuneResidence = [];
  listCommuneDepart = [];
  clients: any;
  breadCrumbItems: Array<{}>;
  touched: boolean = false;
  isDureePaiement = false;
  isJourneePayment = false
  listDureePaiement = ['Fret', 'classique divers', 'Classique Entreprise']
  listJourPayment = ['E-Commerce Express Divers', 'E-Commerce Economy Entreprise',
    'E-Commerce Express Entreprise', 'E-Commerce Economy Divers']
  selectedServiceDureePaiement = []
  selectedServiceJourneePayment = [];
  journeeSemaine: any[] = [
    { journee: JourSemaineEnum.Dimanche, nom: JourSemaineEnum.Dimanche },
    { journee: JourSemaineEnum.Lundi, nom: JourSemaineEnum.Lundi },
    { journee: JourSemaineEnum.Mardi, nom: JourSemaineEnum.Mardi },
    { journee: JourSemaineEnum.Mercredi, nom: JourSemaineEnum.Mercredi },
    { journee: JourSemaineEnum.Jeudi, nom: JourSemaineEnum.Jeudi },
  ];
  delaiPaiement = [
    { delai: delaiPaiementEnum.alenvoi },
    { delai: delaiPaiementEnum.aLaReceptionDeLaFacture },
    { delai: delaiPaiementEnum.a15Jours },
    { delai: delaiPaiementEnum.a30Jours },
    { delai: delaiPaiementEnum.a45Jours },
  ]

  newService = [];


  delaiPaiementEnum;
  emailPattern =
    '^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$';

  clientForm = this.formBuilder.group({
    email: [
      ,
      Validators.compose([
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
    ],
    password: [
      ,
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25),
      ]),
    ],
    isActive: [, Validators.compose([Validators.required])],
    raisonSociale: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
    ],
    nomCommercial: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
    ],
    nomGerant: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
    ],
    prenomGerant: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
    ],
    adresse: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ]),
    ],
    telephone: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
    ],
    wilayaResidenceId: [, Validators.compose([Validators.required])],
    communeResidenceId: [, Validators.compose([Validators.required])],
    nrc: [, Validators.compose([Validators.required])],
    nif: [, Validators.compose([Validators.required])],
    nis: [, Validators.compose([Validators.required])],
    nbEnvoiMin: [, Validators.compose([Validators.required])],
    nbEnvoiMax: [, Validators.compose([Validators.required])],
    nbTentative: [3, Validators.compose([Validators.required])],
    poidsBase: [, Validators.compose([Validators.required])],
    tauxCOD: [, Validators.compose([Validators.required])],
    c_o_d_ApartirDe: [, Validators.compose([Validators.required])],
    moyenPayement: [, Validators.compose([Validators.required])],
    jourPayement: [],
    delaiPaiement: [],
    tarifRetour: [, Validators.compose([Validators.required])],
    wilayaDepartId: [, Validators.compose([Validators.required])],
    communeDepartId: [, Validators.compose([Validators.required])],
    agenceRetourId: [, Validators.compose([Validators.required])],
    caisseAgenceId: [, Validators.compose([Validators.required])],
    typeTarif: this.formBuilder.array([
      this.formBuilder.group({
        serviceId: [, Validators.compose([Validators.required])],
        codeTarifId: [, Validators.compose([Validators.required])],
      }),
    ]),
  });

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Gestion des clients' },
      { label: 'ajouter client', active: true },
    ];
    this.getAllWilaya();
    this.getAllservice();
  }
  get typeTarif() {
    return this.clientForm.get('typeTarif') as FormArray;
  }

  newTypeTarif(): FormGroup {
    return this.formBuilder.group({
      serviceId: [, Validators.required],
      codeTarifId: [, Validators.required],
    });
  }

  addTypeTarif() {
    this.typeTarif.push(this.newTypeTarif());
  }
  resetTypeTarif() {
    this.typeTarif.clear();
    this.addTypeTarif();
    this.getAllservice();
    this.selectedServiceDureePaiement = []
    this.selectedServiceJourneePayment = []
    this.isDureePaiement = false;
    this.isJourneePayment = false;
  }

  removeTypeTarif(i: number) {
    console.log(this.listServiceBeforePatch)
    let id = (this.typeTarif.at(i) as FormGroup).get('serviceId').value;
    let service = this.listServiceBeforePatch.find((service) => service.id == id);
    this.listService.push(service);
    if (this.listDureePaiement.includes(service.nom)) {
      const index = this.selectedServiceDureePaiement.indexOf(service);
      this.selectedServiceDureePaiement.splice(index, 1);
    }
    if (this.listJourPayment.includes(service.nom)) {
      const index = this.selectedServiceJourneePayment.indexOf(service);
      this.selectedServiceJourneePayment.splice(index, 1)
    }

    this.typeTarif.removeAt(i);
    this.touched = true;
    if (this.selectedServiceDureePaiement.length > 0) {
      this.isDureePaiement = true
      this.clientForm.get('delaiPaiement').setValidators([Validators.required])
      this.clientForm.get('delaiPaiement').updateValueAndValidity()
    } else {
      this.isDureePaiement = false
      this.clientForm.get('delaiPaiement').setValidators(null)
      this.clientForm.get('delaiPaiement').updateValueAndValidity()

    }
    if (this.selectedServiceJourneePayment.length > 0) {
      this.isJourneePayment = true
      this.clientForm.get('jourPayement').setValidators([Validators.required])
      this.clientForm.get('jourPayement').updateValueAndValidity()

    }
    else {
      this.isJourneePayment = false
      this.clientForm.get('jourPayement').setValidators(null)
      this.clientForm.get('jourPayement').updateValueAndValidity()

    }
  }

  getAllWilaya() {
    this.clientService
      .getAllWilaya()
      .subscribe((resp) => (this.listWilaya = resp));
  }

  onChangWilayaResidence() {
    this.clientService
      .getCommunsByWilayaId(this.clientForm.get('wilayaResidenceId').value)
      .subscribe(
        (response) => {
          console.log(
            '🚀 ~ file: ajouter-client.component.ts ~ line 77 ~ AjouterClientComponent ~ onChangWilayaResidence ~ response',
            response
          );
          this.listCommuneResidence = response;
          this.clientForm.get('communeResidenceId').setValue(null);
        },

        (error) => {
          this.sweetalertService.sipmleAlertConfirme(
            'warning',
            'pas de commune pour la wilaya de',
            ''
          );
          this.clientForm.get('communeResidenceId').setValue(null);
        }
      );
  }

  onChangWilayaDepart() {
    this.clientService
      .getCommunsByWilayaId(this.clientForm.get('wilayaDepartId').value)
      .subscribe(
        (response) => {
          this.listCommuneDepart = response;
          this.clientForm.get('communeDepartId').setValue(null);
        },

        (error) => {
          this.sweetalertService.sipmleAlertConfirme(
            'warning',
            'pas de commune pour cette wilaya',
            ''
          );
          this.clientForm.get('communeDepartId').setValue(null);
        }
      );
    this.clientService
      .getAgencesByWilayaId(this.clientForm.get('wilayaDepartId').value)
      .subscribe(
        (response) => {
          this.listAgence = response;
          this.clientForm.get('agenceRetourId').setValue(null);
        },
        (error) => {
          this.clientForm.get('agenceRetourId').setValue(null);
        }
      );
  }

  private _validateFirstStep(): boolean {
    if (
      this.clientForm.get('email').valid &&
      this.clientForm.get('password').valid &&
      this.clientForm.get('raisonSociale').valid &&
      this.clientForm.get('nomCommercial').valid &&
      this.clientForm.get('nomGerant').valid &&
      this.clientForm.get('prenomGerant').valid &&
      this.clientForm.get('adresse').valid &&
      this.clientForm.get('telephone').valid &&
      this.clientForm.get('wilayaResidenceId').valid &&
      this.clientForm.get('communeResidenceId').valid &&
      this.clientForm.get('nrc').valid &&
      this.clientForm.get('nif').valid &&
      this.clientForm.get('nis').valid &&
      this.clientForm.get('isActive').valid
    ) {
      return true;
    } else {
      return false;
    }
  }

  validateFirstStep(): boolean {
    return this._validateFirstStep();
  }

  private _validateSecondtStep(): boolean {
    if (
      this.clientForm.get('nbEnvoiMin').valid &&
      this.clientForm.get('nbEnvoiMax').valid &&
      this.clientForm.get('nbTentative').valid &&
      this.clientForm.get('poidsBase').valid &&
      this.clientForm.get('tauxCOD').valid &&
      this.clientForm.get('moyenPayement').valid &&
      this.clientForm.get('tarifRetour').valid &&
      this.clientForm.get('wilayaDepartId').valid &&
      this.clientForm.get('communeDepartId').valid &&
      this.clientForm.get('agenceRetourId').valid
    ) {
      return true;
    } else {
      return false;
    }
  }

  validateSecondtStep(): boolean {
    return this._validateSecondtStep();
  }

  private _validateThirdtStep(): boolean {

    if ((this.typeTarif.at(0) as FormGroup).get('codeTarifId').valid && this.clientForm.get('jourPayement').valid && this.clientForm.get('delaiPaiement').valid ) {
      return true;
    } else {
      return false;
    }
  }

  validateThirdtStep(): boolean {
    return this._validateThirdtStep();
  }

  getAllservice() {
    this.clientService.getAllService().then((response) => {
      for (const i of response) {
        this.listServiceBeforePatch.push(i)
        this.listService.push(i);
      }

      console.log("🚀 ~ file: detail-client.component.ts ~ line 258 ~ DetailClientComponent ~ this.clientService.getAllService ~ response", response)
      console.log(this.listService)
      console.log(this.listServiceBeforePatch)
    });
  }
  onChangeService(i: number) {

    let id = (this.typeTarif.at(i) as FormGroup).get('serviceId').value;
    let service = this.listService.find((service) => service.id == id);
    if (this.listDureePaiement.includes(service.nom)) {
      this.selectedServiceDureePaiement.push(service)

      console.log(service.nom)
      this.isDureePaiement = true;
      this.clientForm.get('delaiPaiement').setValidators([Validators.required])
      this.clientForm.get('delaiPaiement').updateValueAndValidity()
    }

    if (this.listJourPayment.includes(service.nom)) {
      this.selectedServiceJourneePayment.push(service)
      this.isJourneePayment = true;
      this.clientForm.get('jourPayement').setValidators([Validators.required])
      this.clientForm.get('jourPayement').updateValueAndValidity()
    }


    const index = this.listService.indexOf(service);
    this.listService.splice(index, 1);
    this.clientService
      .getCodeTarifByServiceId(this.typeTarif.value[i].serviceId)
      .subscribe(
        (response) => {
          this.listCodeTarif[i] = response;
          (this.typeTarif.at(i) as FormGroup)
            .get('codeTarifId')
            .patchValue(null);
        },
        (error) => {
          (this.listCodeTarif[i] = null),
            (this.typeTarif.at(i) as FormGroup)
              .get('codeTarifId')
              .patchValue(null);
        }
      );
    (this.typeTarif.at(i) as FormGroup).get('serviceId').disable()
  }

  createClient() {
    this.clientForm.value['tauxCOD'] = +this.clientForm.value['tauxCOD']
    console.log("🚀 ~ this.clientForm.value['tauxCOD']", typeof this.clientForm.value['tauxCOD'])
    return this.clientService.createClient(this.clientForm.value).subscribe(
      (response) => {
        this.openFile(response, "application/pdf")
        this.sweetalertService.modificationSucces('Crée avec succés');
        this.router.navigateByUrl(`admin/client`);
      },
      (error) => {
        console.log(error);
        this.sweetalertService.creationFailure(error.message);
      }
    );
  }

  Confirm() {
    const alertTitle = 'Confirmation de la création';
    const alertMessage = "Voulez vous confirmer l'ajout de client";
    this.sweetalertService
      .confirmStandard(alertTitle, alertMessage, '', '', null)
      .then((result) => {
        if (result.isConfirmed) {
          this.createClient();
        }
      });
  }

  openFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your pop-up blocker and try again!')
    }
  }
}
