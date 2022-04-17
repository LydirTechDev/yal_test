import { Component, OnInit } from '@angular/core';
import { FormBuilder, RequiredValidator, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { JourSemaineEnum } from 'src/app/core/models/JourSemaineEnum';
import { WilayaService } from '../../wilaya/wilaya.service';
import { CommuneService } from '../commune.service';
import { Location } from '@angular/common';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';

@Component({
  selector: 'app-detail-commune',
  templateUrl: './detail-commune.component.html',
  styleUrls: ['./detail-commune.component.scss']
})
export class DetailCommuneComponent implements OnInit {

  constructor(
    private communeService:CommuneService,
    private formBuilder:FormBuilder,
    private wilayaService:WilayaService,
    _route: ActivatedRoute,
    private location:Location,
    private sweetalertService:SweetAlertService,
    private router:Router,

  )
  {
     this.route = _route.snapshot;
   }

  route: ActivatedRouteSnapshot;
  breadCrumbItems: Array<{}>;
  listWilaya = [];
  communes:any;
  communeLivrable:Boolean;
  hidden:boolean=true;

  journeeSemaine: any[] = [
    { journee: JourSemaineEnum.Samedi, nom: JourSemaineEnum.Samedi },
    { journee: JourSemaineEnum.Dimanche, nom: JourSemaineEnum.Dimanche },
    { journee: JourSemaineEnum.Lundi, nom: JourSemaineEnum.Lundi },
    { journee: JourSemaineEnum.Mardi, nom: JourSemaineEnum.Mardi },
    { journee: JourSemaineEnum.Mercredi, nom: JourSemaineEnum.Mercredi },
    { journee: JourSemaineEnum.Jeudi, nom: JourSemaineEnum.Jeudi },
    { journee: JourSemaineEnum.Vendredi, nom: JourSemaineEnum.Vendredi },
  ];

    communeForm= this.formBuilder.group({
      wilayaId:['',Validators.compose([Validators.required])],
      nomLatin:['',Validators.compose([Validators.required])],
      nomArabe:['',Validators.compose([Validators.required])],
      codePostal:['',Validators.compose([Validators.required])],
      livrable:['',Validators.compose([Validators.required])],
      livraisonStopDesck:['',Validators.compose([Validators.required])],
      livraisonDomicile:['',Validators.compose([Validators.required])],
      stockage:['',Validators.compose([Validators.required])],
      journeeLivraison:[[],Validators.compose([Validators.required])],
    })



  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Gestion des communes' },
      { label: 'Communes' },
      { label: 'Detail commune', active: true },
    ];

    this.getAllWilaya();
    this.communeForm.disable();

    this.communeService
    .getCommuneById(this.route.params.id)
    .subscribe((communes) => {
      this.communes=communes;
      this.communeForm.patchValue({
        wilayaId:this.communes.wilaya.id,
        nomLatin:this.communes.nomLatin,
        nomArabe:this.communes.nomArabe,
        codePostal:this.communes.codePostal,
        livrable:this.communes.livrable,
        livraisonStopDesck:this.communes.livraisonStopDesck,
        livraisonDomicile:this.communes.livraisonDomicile,
        stockage:this.communes.stockage,
        journeeLivraison:this.communes.journeeLivraison
      });

      this.communeLivrable=this.communes.livrable;
  })
}


  getAllWilaya() {
    this.wilayaService
      .getAllWilaya()
      .subscribe((resp) => (this.listWilaya = resp));
  }



  changeValueOfLivrable()
  {
    this.communeLivrable=!this.communeLivrable;
    this.communeForm.get('livraisonStopDesck').setValue(false);
    this.communeForm.get('livraisonDomicile').setValue(this.communeLivrable);
    this.communeForm.get('stockage').setValue(false);
    this.communeForm.get('journeeLivraison').setValue(null);
    this.communeForm.get('livrable').valueChanges.subscribe(checked => {
      if (checked) {
        this.communeForm.get('journeeLivraison').setValidators([Validators.required]);
      } else {
        this.communeForm.get('journeeLivraison').setValidators(null);
      }
      this.communeForm.get('journeeLivraison').updateValueAndValidity();
    });
}

  changeValueDomicile(){
    if(this.communeForm.get('livraisonDomicile').value==true){
      this.communeForm.get('livraisonStopDesck').setValue(true)
    }
  }

  changeValueStopDesck(){
    if(this.communeForm.get('livraisonStopDesck').value==true){
      this.communeForm.get('livraisonDomicile').setValue(true)
    }
  }

  enableCommuneForm() {
    this.communeForm.enable();
    this.hidden = false;
  }

  goBack(): void {
    this.location.back();
  }

  updateCommune() {

   return this.communeService.updateCommune(this.route.params.id, this.communeForm.value).subscribe(
      (response) => {
        this.sweetalertService.modificationSucces(
          'Commune modifiée avec succés'
        );
        this.router.navigateByUrl(`admin/commune`);
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
      .confirmStandard(alertTitle, alertMessage, '', '', null)
      .then((result) => {
        if (result.isConfirmed) {
          this.updateCommune();
        }
      });
  }





}
