import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Router,
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { EmployeService } from '../employe.service';

@Component({
  selector: 'app-detail-employe',
  templateUrl: './detail-employe.component.html',
  styleUrls: ['./detail-employe.component.scss'],
})
export class DetailEmployeComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    _route: ActivatedRoute,
    private sweetAlertService: SweetAlertService,
    private employeService: EmployeService
  ) {
    this.route = _route.snapshot;
  }

  
  typeEmploye =[ 
    { text: 'operations',value:236429359 },
    { text: 'finance',value:548965156 },
  ];
  route: ActivatedRouteSnapshot;
  breadCrumbItems: Array<{}>;
  employe: any;
  listAgences = [];
  listDepartement = [];
  listFonction = [];
  listBanque = [];
  dateNaissanceError: boolean;
  dateRecrutementError: boolean;
  dateRecrutementError2: boolean;
  hidden: boolean = true;
  emailPattern =
    '^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$';

  employeForm = this.formBuilder.group({
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
    nss: [, Validators.compose([Validators.required])],
    numCompteBancaire: [, Validators.compose([Validators.required])],
    genre: [, Validators.compose([Validators.required])],
    groupeSanguin: [, Validators.compose([Validators.required])],
    dateRecrutement: ['', Validators.compose([Validators.required])],
    typeContrat: [, Validators.compose([Validators.required])],
    typeUser: [, Validators.compose([Validators.required])],
    isActive: [, Validators.compose([Validators.required])],
    departementId: [, Validators.compose([Validators.required])],
    fonctionId: [, Validators.compose([Validators.required])],
    banqueId: [, Validators.compose([Validators.required])],
    agenceId: [, Validators.compose([Validators.required])],
  });
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Gestion des employés' },
      { label: 'detail employé', active: true },
    ];
   
    
    this.getAllAgences();
    this.getAllDepartement();
    this.getAllBanques();

    this.employeService
      .getOneEmployeById(this.route.params.id)
      .subscribe((employes) => {
        this.employe = employes;
        if (this.employe.user.isActive == true) {
          this.employe.user.isActive = 'Actif';
        } else {
          this.employe.user.isActive = 'Inactif';
        }
        this.employeForm.patchValue({
          email: this.employe.user.email,
          nom: this.employe.nom,
          prenom: this.employe.prenom,
          dateNaissance: this.formatDate(this.employe.dateNaissance),
          lieuNaissance: this.employe.lieuNaissance,
          adresse: this.employe.adresse,
          numTelephone: this.employe.numTelephone,
          nss: this.employe.nss,
          numCompteBancaire: this.employe.numCompteBancaire,
          genre: this.employe.genre,
          groupeSanguin: this.employe.groupeSanguin,
          dateRecrutement: this.formatDate(this.employe.dateRecrutement),
          typeContrat: this.employe.typeContrat,
          typeUser: this.employe.user.typeUser,
          isActive: this.employe.user.isActive,
          departementId: this.employe.fonction.departement.id,
          fonctionId: this.employe.fonction.id,
          banqueId: this.employe.banque.id,
          agenceId: this.employe.agence.id,
        });
        this.getFonctionsByDepartementId();
        this.employeForm.disable()
      });

  }


getAllAgences() {
  this.employeService
    .getAllAgences()
    .subscribe((response) => (this.listAgences = response));
}

getFonctionsByDepartementId(){
  this.employeService.getFonctionByDepartementId(this.employeForm.get('departementId').value).subscribe(
    (fonctions)=>{
      this.listFonction = fonctions
    }
  )
}

getAllDepartement() {
  this.employeService
    .getAllDepartement()
    .subscribe((response) => (this.listDepartement = response));
}
getAllBanques(){
  this.employeService
  .getAllBanques()
  .subscribe(
    (response)=>{
      this.listBanque=response;
    }
    )
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
  compare() {
    let dateRecrutement = new Date(
      this.employeForm.get('dateRecrutement').value
    );
    let dateNaissance = new Date(this.employeForm.get('dateNaissance').value);
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
  enableEmployeForm() {
    this.employeForm.enable();
    this.hidden = false;
  }
  setValidity() {
    this.employeForm
      .get('password')
      .setValidators([
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ]);
    this.employeForm.get('password').updateValueAndValidity();
  }

  onChangeDepartement() {
    this.employeService
      .getFonctionByDepartementId(this.employeForm.get('departementId').value)
      .subscribe((response) => {
        this.listFonction = response;
        this.employeForm.get('fonctionId').setValue(null);
      });
  }

  updateEmploye(){
    return this.employeService.updateEmploye(this.route.params.id,this.employeForm.value).subscribe(
      (response)=>{
        this.sweetAlertService.modificationSucces('employé modifié avec succés');
        this.router.navigateByUrl(`admin/employé`)
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
          this.updateEmploye();
        }
      });
  }

}
