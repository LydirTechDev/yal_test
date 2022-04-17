import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../shipments-ops.service';

@Component({
  selector: 'app-create-agence-sac',
  templateUrl: './create-agence-sac.component.html',
  styleUrls: ['./create-agence-sac.component.scss']
})
export class CreateAgenceSacComponent implements OnInit {
  selected: string[] = [];
  agence: any[] = []
  listeColisPresVersAgence: string[] = [];
  count: number = 0;
  formdata: FormGroup;
  agenceSelected: FormGroup
  constructor(
    private shipmentService: ShipmentsOpsService ,
    private router: Router,
    public sweetalertService: SweetAlertService
    
  ) { 
  }

  ngOnInit(): void {
    this.agenceSelected = new FormGroup({
      agenceSelect: new FormControl()
    })
    this.formdata = new FormGroup({
      tracking: new FormControl()
    })
    this.getListAgences()

  }
  fillSac() {
    const express_reg = new RegExp(/^\d{8}$/, 'i')
    const track = this.formdata.value["tracking"];
    console.log(track)
    if (!express_reg.test(track).toString()) {
      this.sweetalertService.backgroundRed()
      this.formdata.reset()
    } else if (!this.listeColisPresVersAgence.includes(track.toLowerCase())) {
      this.sweetalertService.backgroundRed()
      this.formdata.reset()
    } else {
      const index = this.listeColisPresVersAgence.indexOf(track.toLowerCase());
      console.log(index)
      if (index > -1) {
        this.listeColisPresVersAgence.splice(index, 1);
        this.count += 1
        this.selected.push(track)
        this.formdata.reset()
        this.sweetalertService.backgroundGreen()
        console.log('last', this.listeColisPresVersAgence)
      } else {
        this.sweetalertService.basicWarning("Verifier les informations")
      }
    }
  }
  createSac() {
    if (this.selected.length <= 0) {
      this.sweetalertService.basicWarning("Oops c'est vide")
    } else {
      const stationSelected = this.agenceSelected.value['agenceSelect']
      this.shipmentService.createSacVersAgence(this.selected, stationSelected)
        .subscribe(resp => {
        console.log("🚀 ~ file: create-agence-sac.component.ts ~ line 69 ~ CreateAgenceSacComponent ~ createSac ~ resp", resp)
          if (resp) {
            this.openFile(resp, "application/pdf")
            this.selected = [];
            this.count = 0;
            this.agenceSelected.reset()
            this.formdata.reset()
           
          }
        });

    }
  }
  getListAgences() {
    return this.shipmentService.getListAgencesInMyWilaya().then(async (resp) => {
      if (resp) {
        for await (const agence of resp) {
          this.agence.push({
            id: agence.id,
            nom: agence.nom,
            commune: agence.commune.nomLatin,
            codePostal: agence.commune.codePostal
          })
          console.log(this.agence)
        }
      } else this.agence = []
    });
  }
  getColiPresVersAgence(idAgence) {
    this.shipmentService.getColiPresVersAgence(idAgence).then(resp => {
      this.listeColisPresVersAgence = resp
      console.log(resp)
    })
  }
  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1)
    this.listeColisPresVersAgence.push(i.toLowerCase());
    this.count++
  }
  openFile(data: any, type: string) {
    console.log(type, data)
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      this.sweetalertService.basicWarning('Please disable your pop-up blocker and try again!')
    }
  }
}
