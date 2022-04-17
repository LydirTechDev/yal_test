import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../../shipments-ops.service';

@Component({
  selector: 'app-create-agence-sac-retour',
  templateUrl: './create-agence-sac-retour.component.html',
  styleUrls: ['./create-agence-sac-retour.component.scss']
})
export class CreateAgenceSacRetourComponent implements OnInit {
  selected: string[] = [];
  agence: any[] = []
  sacTransfert: string[];
  listeColisPresVersAgence: string[] = [];
  count: number = 0;
  formdata: FormGroup;
  agenceSelected: FormGroup
  constructor(
    private shipmentOpsService: ShipmentsOpsService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) { 
    this.agenceSelected = new FormGroup({
      agenceSelect: new FormControl()
    })
    this.formdata = new FormGroup({
      tracking: new FormControl()
    })
  }

  ngOnInit(): void {
    this.getListAgences()
  }
  fillSac() {
    const express_reg = new RegExp(/^\d{8}$/, 'i')
    const track = this.formdata.value["tracking"];
    console.log(track)
    if (!express_reg.test(track).toString()) {
      this.sweetAlertService.backgroundRed()
      this.formdata.reset()
    } else if (!this.listeColisPresVersAgence.includes(track.toLowerCase())) {
      this.sweetAlertService.backgroundRed()
      this.formdata.reset()
    } else {
      const index = this.listeColisPresVersAgence.indexOf(track.toLowerCase());
      console.log(index)
      if (index > -1) {
        this.listeColisPresVersAgence.splice(index, 1);
        this.count += 1
        this.selected.push(track)
        this.formdata.reset()
        this.sweetAlertService.backgroundGreen()
        console.log('last', this.listeColisPresVersAgence)
      } else {
        this.sweetAlertService.sipmleAlert('error', "Verifier les informations", "")
      }
    }
  }
  createSac() {
    if (this.selected.length <= 0) {
      this.sweetAlertService.sipmleAlert('info', "Oops c'est vide", "")
    } else {
      const stationSelected = this.agenceSelected.value['agenceSelect']
      console.log("🚀 ~ file: create-sac-retour-vers-agence.component.ts ~ line 72 ~ CreateSacRetourVersAgenceComponent ~ createSac ~ stationSelected", stationSelected)
      this.shipmentOpsService.createSacRetourAgence(this.selected, stationSelected)
        .subscribe(resp => {
          if (resp) {
            this.openFile(resp, "application/pdf")
            this.sweetAlertService.sipmleAlert('success', "Validé avec succes", "")
            this.selected = [];
            this.count = 0;
            this.agenceSelected.reset()
            this.formdata.reset()
            this.router.navigateByUrl("operations/retour/creer-agence-sac-retour");
          }
        });

    }
  }
  getListAgences() {
    return this.shipmentOpsService.getListAgencesInMyWilaya().then(async (resp) => {
      for await (const agence of resp) {
        this.agence.push({
          id: agence.id,
          nom: agence.nom,
          commune: agence.commune.nomLatin,
          codePostal: agence.commune.codePostal
        })
        console.log(this.agence)
      }
    });
  }
  getColiPresVersAgence(idAgence) {
    const agence = this.agence.filter((a) => {
      return a.id == this.agenceSelected.value['agenceSelect'];
    });
    return this.shipmentOpsService.getColiPresReturnVersAgence(idAgence).then(resp => {
      if (resp.length == 0) {
        this.sweetAlertService.sipmleAlert(
          'info',
          'Pas de Colis en retour vers', agence[0].nom
        );
      }
      this.listeColisPresVersAgence = resp
      console.log(resp)
    })
  }
  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1)
    this.listeColisPresVersAgence.push(i.toLowerCase());
    this.count--
  }
  openFile(data: any, type: string) {
    console.log(type, data)
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your pop-up blocker and try again!')
    }
  }
}