import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmployeService } from '../employe.service';
import { Location } from '@angular/common';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajouter-employe',
  templateUrl: './ajouter-employe.component.html',
  styleUrls: ['./ajouter-employe.component.scss'],
})
export class AjouterEmployeComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private employeService: EmployeService,
    private location: Location,
    private router: Router,
    private sweetAlertService: SweetAlertService
  ) {}

  typeEmploye = [
    { text: 'Operations', value: 236429359 },
    { text: 'Caissier agence', value: 2548965156 },
    { text: 'Caissier regional', value: 1548965156 },
    { text: 'Admin finance', value: 548965156 },
    { text: 'Admin', value: 963734 },
    { text: 'Service client', value: 2363594520 },
  ];
  breadCrumbItems: Array<{}>;
  listAgences = [];
  listDepartement = [];
  listFonction = [];
  listBanque = [];
  dateNaissanceError: boolean;
  dateRecrutementError: boolean;
  dateRecrutementError2: boolean;
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
    password: [
      ,
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25),
      ]),
    ],
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
      { label: 'ajouter employé', active: true },
    ];

    this.getAllAgences();
    this.getAllDepartement();
    this.getAllBanques();
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

  getAllAgences() {
    this.employeService
      .getAllAgences()
      .subscribe((response) => (this.listAgences = response));
  }

  getAllDepartement() {
    this.employeService
      .getAllDepartement()
      .subscribe((response) => (this.listDepartement = response));
  }

  onChangeDepartement() {
    this.employeService
      .getFonctionByDepartementId(this.employeForm.get('departementId').value)
      .subscribe(
        (response) => {
          this.listFonction = response;
          this.employeForm.get('fonctionId').setValue(null);
        },
        (error) => {
          this.listFonction = [];
          this.employeForm.get('fonctionId').setValue(null);
        }
      );
  }

  getAllBanques() {
    this.employeService.getAllBanques().subscribe((response) => {
      this.listBanque = response;
    });
  }

  goBack(): void {
    this.location.back();
  }

  createEmploye() {
    return this.employeService.createEmploye(this.employeForm.value).subscribe(
      (response) => {
        this.sweetAlertService.modificationSucces('Crée avec succés');
        this.router.navigateByUrl(`admin/employé`);
      },
      (error) => {
        this.sweetAlertService.modificationFailure(error.message);
      }
    );
  }

  Confirm() {
    console.log(
      '🚀 ~ file: ajouter-employe.component.ts ~ line 142 ~ AjouterEmployeComponent ~ Confirm ~ this.employeForm.value',
      this.employeForm.value
    );
    const alertTitle = 'Confirmation de la création';
    const alertMessage = "voulez vous confirmez l'ajout de l'employé";
    this.sweetAlertService
      .confirmStandard(alertTitle, alertMessage, '', '', null)
      .then((result) => {
        if (result.isConfirmed) {
          this.createEmploye();
        }
      });
  }
}
