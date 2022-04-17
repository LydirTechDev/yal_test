import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { CoursierService } from '../coursier.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detail-coursier',
  templateUrl: './detail-coursier.component.html',
  styleUrls: ['./detail-coursier.component.scss'],
})
export class DetailCoursierComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private coursierService: CoursierService,
    private router: Router,
    _route: ActivatedRoute,
    private sweetAlertService: SweetAlertService
  ) {
    this.route = _route.snapshot;
  }

  route: ActivatedRouteSnapshot;
  dateNaissanceError: boolean;
  dateRecrutementError: boolean;
  dateRecrutementError2: boolean;
  breadCrumbItems: Array<{}>;
  coursiers: any;
  listAgences = [];
  hidden: boolean = true;
  emailPattern =
    '^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$';
  coursierForm = this.formBuilder.group({
    email: [
      ,
      Validators.compose([
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
    ],
    password: [],
    nom: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
    ],
    prenom: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
    ],
    dateNaissance: ['', Validators.compose([Validators.required])],
    lieuNaissance: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
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
    numTelephone: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
    ],
    dateRecrutement: ['', Validators.compose([Validators.required])],
    typeContrat: [, Validators.compose([Validators.required])],
    montantRamassage: ['', Validators.compose([Validators.required])],
    montantLivraison: ['', Validators.compose([Validators.required])],
    MarqueVehicule: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
    ],
    immatriculationVehicule: ['', Validators.compose([Validators.required])],
    agenceId: [, Validators.compose([Validators.required])],
    isActive: [, Validators.compose([Validators.required])],
  });

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Gestion des coursiers' },
      { label: 'detail coursier', active: true },
    ];
    this.getAllAgences();

    this.coursierService
      .getOneCoursierById(this.route.params.id)
      .subscribe((coursier) => {
        this.coursiers = coursier;
        if (this.coursiers.user.isActive == true) {
          this.coursiers.user.isActive = 'Actif';
        } else {
          this.coursiers.user.isActive = 'Inactif';
        }
        this.coursierForm.patchValue({
          email: this.coursiers.user.email,
          password: this.coursiers.user.password,
          nom: this.coursiers.nom,
          prenom: this.coursiers.prenom,
          dateNaissance: this.formatDate(this.coursiers.dateNaissance),
          lieuNaissance: this.coursiers.lieuNaissance,
          adresse: this.coursiers.adresse,
          numTelephone: this.coursiers.numTelephone,
          dateRecrutement: this.formatDate(this.coursiers.dateRecrutement),
          typeContrat: this.coursiers.typeContrat,
          montantRamassage: this.coursiers.montantRamassage,
          montantLivraison: this.coursiers.montantLivraison,
          MarqueVehicule: this.coursiers.MarqueVehicule,
          immatriculationVehicule: this.coursiers.immatriculationVehicule,
          agenceId: this.coursiers.agence.id,
          isActive: this.coursiers.user.isActive,
        });
      });

    this.coursierForm.disable();
  }

  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  getAllAgences() {
    this.coursierService
      .getAllAgences()
      .subscribe((response) => (this.listAgences = response));
  }

  compare() {
    let dateRecrutement = new Date(
      this.coursierForm.get('dateRecrutement').value
    );
    let dateNaissance = new Date(this.coursierForm.get('dateNaissance').value);
    let dateActuel = new Date();
    if (dateNaissance > dateActuel) {
      this.dateNaissanceError = true;
    } else {
      this.dateNaissanceError = false;
    }
    if (dateRecrutement > dateActuel) {
      this.dateRecrutementError = true;
    } else {
      this.dateRecrutementError = false;
    }
    if (dateRecrutement < dateNaissance) {
      this.dateRecrutementError2 = true;
    } else {
      this.dateRecrutementError2 = false;
    }
  }


  goBack(): void {
    this.location.back();
  }

  enableCoursierForm() {
    this.coursierForm.enable();
    this.hidden = false;
  }

  setValidity() {
    this.coursierForm
      .get('password')
      .setValidators([
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ]);
    this.coursierForm.get('password').updateValueAndValidity();
  }

  updateCoursier(){
    return this.coursierService.updateCoursier(this.route.params.id,this.coursierForm.value).subscribe(
      (response)=>{
        this.sweetAlertService.modificationSucces('coursier modifié avec succés');
        this.router.navigateByUrl(`admin/coursier`)
      },
      (error)=>{
        this.sweetAlertService.modificationFailure(error.message)
      }
    )
  }


  Confirm() {
    const alertTitle = 'Confirmation des modifications';
    const alertMessage = 'voulez vous confirmez vos modification !';
    this.sweetAlertService
      .confirmStandard(alertTitle, alertMessage, '', '', null)
      .then((result) => {
        if (result.isConfirmed) {
          this.updateCoursier();
        }
      });
  }

}
