import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { ShippmentsClientService } from 'src/app/client/components/shippments/shippments-client.service';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { CommuneService } from '../../commune/commune.service';
import { WilayaService } from '../../wilaya/wilaya.service';
import { AgenceService } from '../agence.service';
import { AgencesTypesEnum } from '../agencesTypesEnum';
import { Location } from '@angular/common';
import { computeDecimalDigest } from '@angular/compiler/src/i18n/digest';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-agence',
  templateUrl: './detail-agence.component.html',
  styleUrls: ['./detail-agence.component.scss'],
})
export class DetailAgenceComponent implements OnInit {
  agences: any;
  breadCrumbItems: Array<{}>;
  route: ActivatedRouteSnapshot;
  listWilaya = [];
  listCommune = [];
  typeAgences: any[] = [
    { type: AgencesTypesEnum.bureau, name: AgencesTypesEnum.bureau },
    { type: AgencesTypesEnum.hub, name: AgencesTypesEnum.hub },
    { type: AgencesTypesEnum.centreRetour, name: AgencesTypesEnum.centreRetour },
    { type: AgencesTypesEnum.caisseRegional, name: AgencesTypesEnum.caisseRegional },
    { type: AgencesTypesEnum.caisseCentral, name: AgencesTypesEnum.caisseCentral },
  ];

  hidden: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private agenceService: AgenceService,
    private wilayaService: WilayaService,
    private communeService: CommuneService,
    public sweetalertService: SweetAlertService,
    private location: Location,
    private router: Router,
    _route: ActivatedRoute
  ) {
    this.route = _route.snapshot;
  }

  agenceForm = this.formBuilder.group({
    nom: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
    ],
    adresse: [
      '',
      Validators.compose([
        Validators.required,
        Validators.maxLength(90),
        Validators.minLength(10),
      ]),
    ],
    nrc: [
      '',
      Validators.compose([
        Validators.required,
        Validators.maxLength(14),
        Validators.minLength(14),
      ]),
    ],
    nif: [
      '',
      Validators.compose([
        Validators.required,
        Validators.maxLength(16),
        Validators.minLength(16),
      ]),
    ],
    nis: ['', Validators.compose([Validators.required])],
    nAi: ['', Validators.compose([Validators.required])],
    type: ['', Validators.compose([Validators.required])],
    communeId: [
      '',
      Validators.compose([Validators.required]),
    ],
    wilayaId: ['', Validators.compose([Validators.required])],
    prixRamassageZoneOne: [, Validators.required],
    prixRamassageZoneTwo: [, Validators.required],
    prixLivraisonZoneOne: [, Validators.required],
    prixLivraisonZoneTwo: [, Validators.required],
    communeZoneOne: [, Validators.required],
  });


  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Gestion du patrimoine' },
      { label: 'agence' },
      { label: 'detail agence', active: true },
    ];

    this.getAllWilaya();

    this.agenceService
      .getAgenceById(this.route.params.id)
      .subscribe((agences) => {
        this.agences = agences;
        console.log("🚀 ~ file: detail-agence.component.ts ~ line 109 ~ DetailAgenceComponent ~ .subscribe ~ agences", agences)
        this.agenceForm.patchValue({
          nom: agences.nom,
          adresse: agences.adresse,
          nrc: agences.nrc,
          nif: agences.nif,
          nis: agences.nis,
          nAi: agences.nAI,
          type: agences.type,
          communeId: agences.commune.id,
          wilayaId: agences.commune.wilaya.id,
          prixRamassageZoneOne: agences.prixRamassageZoneOne,
          prixRamassageZoneTwo:agences.prixRamassageZoneTwo,
          prixLivraisonZoneOne:agences.prixLivraisonZoneOne,
          prixLivraisonZoneTwo:agences.prixLivraisonZoneTwo,
          communeZoneOne:agences.communeZoneOne,
        });
        this.getCommuneByWilayaId();
        this.agenceForm.disable();
      });
  }
  getAllWilaya() {
    this.wilayaService
      .getAllWilaya()
      .subscribe((resp) => (this.listWilaya = resp));
  }

  getCommuneByWilayaId() {
    this.communeService
      .getCommunsByWilayaId(this.agenceForm.get('wilayaId').value)
      .subscribe((resp) => {
        (this.listCommune = resp);
        console.log("🚀 ~ file: detail-agence.component.ts ~ line 145 ~ DetailAgenceComponent ~ getCommuneByWilayaId ~ resp", resp) });
  }
     

  onChangWilaya() {
    this.communeService
      .getCommunsByWilayaId(this.agenceForm.get('wilayaId').value)
      .subscribe(
        (response) => {
          this.listCommune = response;
          this.agenceForm.get('communeId').setValue(null);
        },

        (error) => {
          this.sweetalertService.sipmleAlertConfirme(
            'warning',
            'pas de commune pour la wilaya de',
            ''
          );
        }
      );
    let wilayas = this.listWilaya;
    const t = wilayas.filter((wil) => {
      return wil.id == this.agenceForm.get('wilayaId').value;
    });
    this.agenceForm.get('adresse').setValue(t[0].nomLatin + ', ');
  }

  onChangCommune() {
    let commune = this.listCommune;
    const t1 = commune.filter((com) => {
      return com.id == this.agenceForm.get('communeId').value;
    });
    let wilayas = this.listWilaya;
    const t = wilayas.filter((wil) => {
      return wil.id == this.agenceForm.get('wilayaId').value;
    });
    this.agenceForm
      .get('adresse')
      .setValue(t[0].nomLatin + ', ' + t1[0].nomLatin + ', ');
  }

  enableAgenceForm() {
    this.agenceForm.enable();
    this.hidden = false;
  }

  goBack(): void {
    this.location.back();
  }

  updateAgence() {

    return this.agenceService.updateAgence(this.route.params.id, this.agenceForm.value).subscribe(
      (response) => {
        this.sweetalertService.modificationSucces(
          'Agence modifiée avec succés'
        );
        this.router.navigateByUrl(`admin/agence`);
      },
      (error) => {
        this.sweetalertService.modificationFailure(error.message);
      }
    );
  }

  Confirm() {
    const alertTitle = 'Confirmation des modifications';
    const alertMessage = 'voulez vous confirmez vos modification !';
    this.sweetalertService
      .confirmStandard(
        alertTitle,
        alertMessage, '', '', null
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.updateAgence()
        }
      });
  }
}
