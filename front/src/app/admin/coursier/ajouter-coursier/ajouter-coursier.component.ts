import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AgenceService } from '../../agence/agence.service';
import { Location } from '@angular/common';
import { CoursierService } from '../coursier.service';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { IAgence } from '../../agence/i-agence';


@Component({
  selector: 'app-ajouter-coursier',
  templateUrl: './ajouter-coursier.component.html',
  styleUrls: ['./ajouter-coursier.component.scss']
})
export class AjouterCoursierComponent implements OnInit {


  constructor(
    private formBuilder: FormBuilder,
    private agenceService:AgenceService,
    private location: Location,
    private coursierService:CoursierService,
    private router:Router,
    private sweetAlertService:SweetAlertService
  ) {}

  dateNaissanceError:boolean;
  dateRecrutementError:boolean;
  dateRecrutementError2:boolean;
  breadCrumbItems: Array<{}>;
  listAgences: IAgence[] = [];
  emailPattern="^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$";
  coursierForm=this.formBuilder.group({
    email:[,Validators.compose([Validators.required,Validators.pattern(this.emailPattern)])],
    password:[,Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(25)])],
    nom:['', Validators.compose([Validators.required, Validators.minLength(3),Validators.maxLength(30)])],
    prenom:['', Validators.compose([Validators.required, Validators.minLength(3),Validators.maxLength(30)])],
    dateNaissance:['', Validators.compose([Validators.required])],
    lieuNaissance:['', Validators.compose([Validators.required, Validators.minLength(5),Validators.maxLength(50)])],
    adresse:['', Validators.compose([Validators.required, Validators.minLength(10),Validators.maxLength(100)])],
    numTelephone:['', Validators.compose([Validators.required, Validators.minLength(10),Validators.maxLength(10)])],
    dateRecrutement:['', Validators.compose([Validators.required])],
    typeContrat:[, Validators.compose([Validators.required])],
    montantRamassage:['', Validators.compose([Validators.required])],
    montantLivraison:['', Validators.compose([Validators.required])],
    MarqueVehicule:['', Validators.compose([Validators.required, Validators.minLength(3),Validators.maxLength(30)])],
    immatriculationVehicule:['', Validators.compose([Validators.required])],
    agenceId:[, Validators.compose([Validators.required])],
    isActive:[, Validators.compose([Validators.required])]
  })

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Gestion des coursiers' },
      { label: 'ajouter coursier', active: true },
    ];
    this.getAllAgences();
  }

  getAllAgences(){
    this.agenceService.getAllAgences()
    .subscribe((response)=>(this.listAgences = response)
    )
  }


  goBack(): void {
    this.location.back();
  }

compare(){
  let dateRecrutement=new Date(this.coursierForm.get('dateRecrutement').value);
  let dateNaissance=new Date(this.coursierForm.get('dateNaissance').value);
  let dateActuel=new Date();
  if(dateNaissance>dateActuel){
    this.dateNaissanceError=true
}else{
    this.dateNaissanceError=false
  };
  if(dateRecrutement>dateActuel){
    this.dateRecrutementError=true
  }else{
    this.dateRecrutementError=false
  };
  if(dateRecrutement<dateNaissance){
    this.dateRecrutementError2=true
  }else{
    this.dateRecrutementError2=false
  }
}

createCoursier() {

  return this.coursierService.createCoursier(this.coursierForm.value).subscribe(
    (response) => {
      this.sweetAlertService.creationSucces(
        'Crée avec succés'
      );
      this.router.navigateByUrl(`admin/coursier`);
    },
    (error) => {
      this.sweetAlertService.creationFailure(error.message);
    }
  );
}

Confirm() {
  const alertTitle = "Confirmation de la création";
  const alertMessage = "voulez vous confirmez l'ajout de cousrsier";
  this.sweetAlertService
    .confirmStandard(
      alertTitle,
      alertMessage,
      '',
      '',
      null
    )
    .then((result) => {
      if (result.isConfirmed) {
        this.createCoursier()
      }
    });
}




}
