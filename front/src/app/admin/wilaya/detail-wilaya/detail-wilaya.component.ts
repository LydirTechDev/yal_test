import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AgenceService } from '../../agence/agence.service';
import { WilayaService } from '../wilaya.service';
import { Location } from '@angular/common';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { IAgence } from '../../agence/i-agence';

@Component({
  selector: 'app-detail-wilaya',
  templateUrl: './detail-wilaya.component.html',
  styleUrls: ['./detail-wilaya.component.scss'],
})
export class DetailWilayaComponent implements OnInit {
  constructor(
    _route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private wilayaService: WilayaService,
    private agenceService: AgenceService,
    private location: Location,
    private router:Router,
    private sweetalertService: SweetAlertService
  ) {
    this.route = _route.snapshot;
  }

  route: ActivatedRouteSnapshot;
  breadCrumbItems: Array<{}>;
  wilayas: any;
  listAgences=[];
  hidden: boolean = true;
  wilayaForm = this.formBuilder.group({
    codeWilaya: [,Validators.compose([Validators.required,Validators.minLength(1),Validators.maxLength(2)])],
    nomLatin: [,Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(30)]) ],
    nomArabe: [,Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(30)])],
    agenceRetourId: [,Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(30)])],
    dureeReceptionRecolte: [, Validators.compose([Validators.required,])],

  });

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Gestion des wilaya' },
      { label: 'wilaya' },
      { label: 'Detail wilaya', active: true },
    ];
    this.getAgenceCentreRetour();

    this.wilayaService
      .findOneWilaya(this.route.params.id)
      .subscribe((resp) => {
        this.wilayas = resp;
        this.wilayaForm.patchValue({
          codeWilaya: this.wilayas.codeWilaya,
          nomLatin: this.wilayas.nomLatin,
          nomArabe: this.wilayas.nomArabe,
          agenceRetourId: this.wilayas.agenceRetour.id,
        });
        if (this.wilayas.dureeReceptionRecolte) {
          this.wilayaForm.patchValue({
            dureeReceptionRecolte: this.wilayas.dureeReceptionRecolte
          });
        }
        if (this.wilayas.agenceRetour) {
          this.wilayaForm.patchValue({
            agenceRetourId: this.wilayas.agenceRetour.id
          });
        }
      });
      this.wilayaForm.disable();
  }

  async getAgenceCentreRetour() {
    const resp = await this.agenceService.getStationsCentreRetour();
    console.log("🚀 ~ file: detail-wilaya.component.ts ~ line 64 ~ DetailWilayaComponent ~ getAgenceHub ~ resp", resp)
    for await (const agence of resp) {
      this.listAgences.push({
        id: agence.id,
        nom: agence.nom,
        type: agence.type,
      });
    }
}

enableWilayaForm() {
  this.wilayaForm.enable();
  this.hidden = false;
}

goBack(): void {
  this.location.back();
}

updateWilaya(){

  console.log("🚀 ~ file: detail-wilaya.component.ts ~ line 84 ~ DetailWilayaComponent ~ updateWilaya ~ this.wilayaForm.value", this.wilayaForm.value)
  return this.wilayaService.updateWilaya(this.route.params.id,this.wilayaForm.value).subscribe(
    (response)=>{
      this.sweetalertService.modificationSucces('Wilaya modifiée avec succés');
      this.router.navigateByUrl('admin/wilaya');
    },
    (error)=>{
      this.sweetalertService.modificationFailure(error.message)
    }
    );
}

Confirm() {
  const alertTitle = 'Confirmation des modifications';
  const alertMessage = 'voulez vous confirmez vos modification !';
  this.sweetalertService
    .confirmStandard(alertTitle, alertMessage,'','', null)
    .then((result) => {
      if (result.isConfirmed) {
        this.updateWilaya();
      }
    });
}

}
