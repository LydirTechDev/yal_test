import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../shipments-ops.service';

@Component({
  selector: 'app-transit-sac',
  templateUrl: './transit-sac.component.html',
  styleUrls: ['./transit-sac.component.scss']
})
export class TransitSacComponent implements OnInit {
  formdata: FormGroup
  liste_sac_pres_transit: string[] = [];
  arr: string[] = []
  count: number = 0;
  constructor(
    private shipmentsOpsService: ShipmentsOpsService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {
    this.formdata = new FormGroup({
      tracking: new FormControl()
    })
   }

  ngOnInit(): void {
    this.getSacPresTransit();
  }
  newSac() {
    const express_reg = new RegExp(/^sac-\d{3}\w{3}$/, 'i')
    const track = this.formdata.value["tracking"];
    if (!express_reg.test(track).toString()) {
      this.sweetAlertService.backgroundRed()
      this.formdata.reset()
    } else if (!this.liste_sac_pres_transit.includes(track.toLowerCase())) {
      console.log("🚀 ~ file: recieve-packages.component.ts ~ line 32 ~ RecievePackagesComponent ~ newColis ~ track", track)
      this.sweetAlertService.backgroundRed()
      this.formdata.reset()
    } else {
      const index = this.liste_sac_pres_transit.indexOf(track.toLowerCase());
      if (index > -1) {
        this.liste_sac_pres_transit.splice(index, 1);
        this.count += 1
        this.arr.push(track)
        this.formdata.reset()
        this.sweetAlertService.backgroundGreen()
        console.log('last', this.liste_sac_pres_transit)
      } else {
        this.sweetAlertService.sipmleAlert('error', "Verifier les informations","")
      }
    }
  }
  deletselected(i) {
    this.arr.splice(this.arr.indexOf(i.toLowerCase()), 1)
    this.liste_sac_pres_transit.push(i.toLowerCase());
    this.count--
  }
  transiterSacs() {
    if (this.arr.length <= 0) {
      this.sweetAlertService.sipmleAlert('info', "Oops c'est vide","")
    } else {
        this.shipmentsOpsService.transiterSacs(this.arr).then(
        resp =>{
          if (resp) {
            this.sweetAlertService.sipmleAlert('success', "Validé avec succes", "")
            this.arr = []
            this.count = 0
            this.getSacPresTransit();
          }
        }
      )

    }
  }
  getSacPresTransit() {
    return this.shipmentsOpsService.getSacPresTransit()
      .then(
        resp => {
          console.log(resp);
          this.liste_sac_pres_transit = resp
        },
        error => {
          console.log(error);
          this.sweetAlertService.sipmleAlert('error', 'Erreur de chargement', '')
        }
      );
  }
}
