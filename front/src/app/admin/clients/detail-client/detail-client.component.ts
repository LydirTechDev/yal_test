import { Component, OnInit } from '@angular/core';
import {
  FormArray,
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
import { JourSemaineEnum } from 'src/app/core/models/JourSemaineEnum';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ClientService } from '../client.service';
import { Location } from '@angular/common';
import { delaiPaiementEnum } from 'src/app/core/models/delaiPaiementEnum';

@Component({
  selector: 'app-detail-client',
  templateUrl: './detail-client.component.html',
  styleUrls: ['./detail-client.component.scss'],
})
export class DetailClientComponent implements OnInit {


  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private sweetalertService: SweetAlertService,
    private router: Router,
    private location: Location,
    _route: ActivatedRoute
  ) {
    this.route = _route.snapshot;
  }

  route: ActivatedRouteSnapshot;
  listCodeTarif = [];
  listWilaya = [];
  listAgence = [];
  listService = [];
  listServiceBeforePatch = [];

  listCommuneResidence = [];
  listCommuneDepart = [];
  clients: any;
  breadCrumbItems: Array<{}>;
  touched:boolean=false;
  isDureePaiement= false;
  isJourneePayment=false
  listDureePaiement = ['Fret', 'Classique Divers','Classique Entreprise']
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
    password: [],
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
    nbTentative: [, Validators.compose([Validators.required])],
    poidsBase: [, Validators.compose([Validators.required])],
    tauxCOD: [, Validators.compose([Validators.required])],
    moyenPayement: [, Validators.compose([Validators.required])],
    jourPayement: [],
    delaiPaiement: [],
    tarifRetour: [, Validators.compose([Validators.required])],
    wilayaDepartId: [, Validators.compose([Validators.required])],
    communeDepartId: [, Validators.compose([Validators.required])],
    agenceRetourId: [, Validators.compose([Validators.required])],
    caisseAgenceId: [, Validators.compose([Validators.required])],
    typeTarif: this.formBuilder.array([]),
  });

  ngOnInit(): void {
   

    this.breadCrumbItems = [
      { label: 'Gestion des clients' },
      { label: 'detail client', active: true },
    ];

    this.getAllWilaya();
    this.getAllservice();

    this.clientService
      .findOneclientById(this.route.params.id)
      .subscribe((client) => {
        this.clients = client;
        if (this.clients.user.isActive == true) {
          this.clients.user.isActive = 'Actif';
        } else {
          this.clients.user.isActive = 'Inactif';
        }

      this.clientForm.patchValue({
        email: this.clients.user.email,
        isActive: this.clients.user.isActive,
        raisonSociale: this.clients.raisonSociale,
        nomCommercial: this.clients.nomCommercial,
        nomGerant: this.clients.nomGerant,
        prenomGerant: this.clients.prenomGerant,
        adresse: this.clients.adresse,
        telephone: this.clients.telephone,
        wilayaResidenceId: this.clients.communeResidence.wilaya.id,
        communeResidenceId: this.clients.communeResidence.id,
        nrc: this.clients.nrc,
        nif: this.clients.nif,
        nis: this.clients.nis,
        nbEnvoiMin: this.clients.nbEnvoiMin,
        nbEnvoiMax: this.clients.nbEnvoiMax,
        nbTentative: this.clients.nbTentative,
        poidsBase: this.clients.poidsBase,
        tauxCOD: this.clients.tauxCOD,
        moyenPayement: this.clients.moyenPayement,
        jourPayement: this.clients.jourPayement,
        delaiPaiement: this.clients.delaiPaiement,
        tarifRetour: this.clients.tarifRetour,
        wilayaDepartId: this.clients.communeDepart.wilaya.id,
        communeDepartId: this.clients.communeDepart.id,
        agenceRetourId: this.clients.agenceRetour.id,
        caisseAgenceId: this.clients.caisseAgence.id
      });


      this.getAgenceByWilayaId();
      this.getCommuneDepartByWilayaId();
      this.getCommuneResidenceByWilayaId();
        let i = 0;
        for (const tarif of client.clientsTarifs) {
          if (this.listDureePaiement.includes(tarif.codeTarif.service.nom)) {
            this.isDureePaiement = true;
            this.clientForm.get('delaiPaiement').setValidators([Validators.required])
            this.clientForm.get('delaiPaiement').updateValueAndValidity()
            this.selectedServiceDureePaiement.push(tarif.codeTarif.service)
          }
          if (this.listJourPayment.includes(tarif.codeTarif.service.nom)) {
            this.isJourneePayment = true;
            this.clientForm.get('jourPayement').setValidators([Validators.required])
            this.clientForm.get('jourPayement').updateValueAndValidity()
            this.selectedServiceJourneePayment.push(tarif.codeTarif.service)
          }
          this.clientService
            .getCodeTarifByServiceId(tarif.codeTarif.service.id)
            .subscribe((response) => {
              this.listCodeTarif[i] = response;
              i = i + 1;
            });

          (this.clientForm.get('typeTarif') as FormArray).push(
            new FormGroup({
              serviceId: new FormControl(tarif.codeTarif.service.id,Validators.required),
              codeTarifId: new FormControl(tarif.codeTarif.id,Validators.required),
            })

          );

          setTimeout(() => {
            let service = this.listService.find(
              (service) => service.id == tarif.codeTarif.service.id
            );
            const index = this.listService.indexOf(service);
            this.listService.splice(index, 1);
          }, 50);
        }
        console.log(this.selectedServiceDureePaiement)
        console.log(this.selectedServiceJourneePayment)

        this.clientForm.disable();
      });
  }

  getAllWilaya() {
    this.clientService
      .getAllWilaya()
      .subscribe((resp) => (this.listWilaya = resp));
  }

  getAllservice() {
    this.clientService.getAllService().then((response) => {
      for  (const i of response) {
        this.listServiceBeforePatch.push(i) 
        this.listService.push(i);
      }
     
      console.log("🚀 ~ file: detail-client.component.ts ~ line 258 ~ DetailClientComponent ~ this.clientService.getAllService ~ response", response)
      console.log(this.listService)
      console.log(this.listServiceBeforePatch)
    });
  }

  getAgenceByWilayaId(){
    this.clientService
    .getAgencesByWilayaId(this.clientForm.get('wilayaDepartId').value)
    .subscribe(
      (response) => {
        this.listAgence = response;
      },
    );
  }

  getCommuneResidenceByWilayaId() {
    this.clientService.getCommunsByWilayaId(this.clientForm.get('wilayaResidenceId').value)
      .subscribe(
        (communeResidence) =>{ (this.listCommuneResidence = communeResidence);
        }
        );

  }

  getCommuneDepartByWilayaId() {
    this.clientService
      .getCommunsByWilayaId(this.clientForm.get('wilayaDepartId').value)
      .subscribe((resp) => (this.listCommuneDepart = resp));
  }

  get typeTarif() {
    return this.clientForm.get('typeTarif') as FormArray;
  }
  newTypeTarif(): FormGroup {
    return this.formBuilder.group({
      serviceId: [,Validators.required],
      codeTarifId: [,Validators.required],
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
      this.selectedServiceJourneePayment.splice(index,1)
    } 

    this.typeTarif.removeAt(i);
    this.touched=true;
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

  onChangeService(i: number) {
    let id = (this.typeTarif.at(i) as FormGroup).get('serviceId').value;
    let service = this.listService.find((service) => service.id == id);
    if ( this.listDureePaiement.includes(service.nom)) {
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
          this.listCommuneResidence=[];
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
          this.listCommuneDepart=[];
          this.clientForm.get('communeDepartId').setValue(null);
        }
      );
    this.clientService
      .getAgencesByWilayaId(this.clientForm.get('wilayaDepartId').value)
      .subscribe(
        (response) => {
          this.listAgence = response;
          this.clientForm.get('agenceRetourId').setValue(null);
          this.clientForm.get('caisseAgenceId').setValue(null);
        },
        (error) => {
          this.listAgence=[];
          this.clientForm.get('agenceRetourId').setValue(null);
          this.clientForm.get('caisseAgenceId').setValue(null);
        }
      );
  }

  hidden: boolean = true;
  goBack(): void {
    this.location.back();
  }
  enableClientForm() {
    this.clientForm.enable();
    this.hidden = false;
  }
  setValidity() {
    this.clientForm
      .get('password')
      .setValidators([
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ]);
    this.clientForm.get('password').updateValueAndValidity();
  }


  updateClient(){
    this.clientForm.value['tarifRetour'] = +this.clientForm.value['tarifRetour']
    this.clientForm.value['tauxCOD'] = +this.clientForm.value['tauxCOD']
    this.clientForm.value['poidsBase'] = +this.clientForm.value['poidsBase']
    this.clientForm.value['nbTentative'] = +this.clientForm.value['nbTentative']
    this.clientForm.value['nbEnvoiMin'] = +this.clientForm.value['nbEnvoiMin']
    this.clientForm.value['nbEnvoiMax'] = +this.clientForm.value['nbEnvoiMax']

    return this.clientService.updateClient(this.route.params.id,this.clientForm.value).subscribe(
      (response)=>{
        this.sweetalertService.modificationSucces('client modifié avec succés');
        this.router.navigateByUrl(`admin/client`)
      },
      (error)=>{
        this.sweetalertService.modificationFailure(error.message)
      }
    )
  }


  Confirm() {
    const alertTitle = 'Confirmation des modifications';
    const alertMessage = 'voulez vous confirmez vos modification !';
    this.sweetalertService
      .confirmStandard(alertTitle, alertMessage, '', '', null)
      .then((result) => {
        if (result.isConfirmed) {
          this.updateClient();
        }
      });
  }
}
