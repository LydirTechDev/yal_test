import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../../shipments-ops.service';

@Component({
  selector: 'app-vider-wilaya-sac-retour',
  templateUrl: './vider-wilaya-sac-retour.component.html',
  styleUrls: ['./vider-wilaya-sac-retour.component.scss']
})
export class ViderWilayaSacRetourComponent implements OnInit {
  selected: string[] = [];
  listeColisRetourWilaya: string[] = [];
  count: number = 0;
  formdata: FormGroup;
  formSac: FormGroup;
  constructor(
    private shipmentOpsService: ShipmentsOpsService,
    private sweetAlerteService: SweetAlertService,
    private router: Router
  ) {
    this.formSac = new FormGroup({
      sacTracking: new FormControl()
    })
    this.formdata = new FormGroup({
      tracking: new FormControl()
    })
   }

  ngOnInit(): void {
  }
  checkSack() {
    this.listeColisRetourWilaya = [];
    const express_reg = new RegExp(/^sac-\d{3}\w{3}$/, 'i')
    const track = this.formSac.value["sacTracking"];
    if (express_reg.test(track)) {
      this.shipmentOpsService.getTrackingReturnWilaya(track.toLowerCase()).subscribe(
        (resp) => {
          if (resp) {
            this.listeColisRetourWilaya = resp
            this.count = resp.length;
          } else {
         
            this.sweetAlerteService.sipmleAlert(
              'warning',
              'Sac Invalide',
              this.formSac.value['sacTracking']
            );
            this.listeColisRetourWilaya = [];
            this.formSac.reset()
            this.formdata.reset()
          }
        })
    }
    else {
      this.sweetAlerteService.sipmleAlert(
        'warning',
        'Format Tracking invalide',
        this.formSac.value['sacTracking']
      );
      this.formSac.reset()
      this.formdata.reset()
    }
  }
  viderSac() {
    const express_reg = new RegExp(/^\d{8}$/, 'i')
    const track = this.formdata.value["tracking"];
    if (!express_reg.test(track).toString()) {
      this.sweetAlerteService.backgroundRed()
      this.formdata.reset()
    } else if (!this.listeColisRetourWilaya.includes(track.toLowerCase())) {
      this.sweetAlerteService.backgroundRed()
      this.formdata.reset()
    } else {
      const index = this.listeColisRetourWilaya.indexOf(track.toLowerCase());
      console.log(index)
      if (index > -1) {
        this.listeColisRetourWilaya.splice(index, 1);
        this.count -= 1
        this.selected.push(track.toLowerCase())
        this.formdata.reset()
        this.sweetAlerteService.backgroundGreen()
        console.log('last', this.listeColisRetourWilaya)
      } else {
        this.sweetAlerteService.sipmleAlert('error', "Verifier les informations","")
      }
    }
  }
  receptShipments() {
    if (this.selected.length <= 0) {
      this.sweetAlerteService.sipmleAlert('info', "Oops c'est vide","")
    } else {
      this.shipmentOpsService.viderSacRetourWilaya(this.selected).subscribe(resp => {
        if (resp) {
          this.sweetAlerteService.sipmleAlert('success', "Validé avec succes","");
          this.selected = [];
          this.formSac.reset()
          this.formdata.reset()
          this.count = 0;
          this.router.navigateByUrl("operations/retour/vidé-wilaya-sac-retour");
        }
      })
    }
  }
  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1)
    this.listeColisRetourWilaya.push(i.toLowerCase());
    this.count++
  }

}
