import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../../shipments-ops.service';

@Component({
  selector: 'app-vider-agence-sac-retour',
  templateUrl: './vider-agence-sac-retour.component.html',
  styleUrls: ['./vider-agence-sac-retour.component.scss']
})
export class ViderAgenceSacRetourComponent implements OnInit {
  selected: string[] = [];
  listeColisRetourVersAgence: string[] = [];
  count: number = 0;
  formdata: FormGroup;
  formSac: FormGroup;
  constructor(
    private shipmentOpsService: ShipmentsOpsService,
    private sweetAlertService: SweetAlertService,
    private router: Router) {
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
    const express_reg = new RegExp(/^sac-\d{8}$/, 'i')
    const track = this.formSac.value["sacTracking"];
    if (express_reg.test(track)) {
      this.shipmentOpsService.getTrackingReturnVersAgence(track.toLowerCase()).subscribe(
       (resp) => {
          if (resp) {
            this.listeColisRetourVersAgence = resp
            this.count = resp.length;
            if (resp.length== 0) {
              this.sweetAlertService.sipmleAlert(
                'info',
                'Sac est vidé',
                this.formSac.value['sacTracking']
              );
            }
          } else {
            this.sweetAlertService.sipmleAlert(
              'warning',
              'Sac Invalide',
              this.formSac.value['sacTracking']
            );
            this.listeColisRetourVersAgence = [];
            this.formSac.reset()
            this.formdata.reset()
          }
        })
    } else {
      this.sweetAlertService.sipmleAlert(
        'warning',
        'Format Tracking invalide',
        this.formSac.value['sacTracking']
      );
    }
  }
  viderSac() {
    const express_reg = new RegExp(/^\d{8}$/, 'i')
    const track = this.formdata.value["tracking"];
    if (!express_reg.test(track).toString()) {
      this.sweetAlertService.backgroundRed()
      this.formdata.reset()
    } else if (!this.listeColisRetourVersAgence.includes(track.toLowerCase())) {
      this.sweetAlertService.backgroundRed()
      this.formdata.reset()
    } else {
      const index = this.listeColisRetourVersAgence.indexOf(track.toLowerCase());
      console.log(index)
      if (index > -1) {
        this.listeColisRetourVersAgence.splice(index, 1);
        this.count -= 1
        this.selected.push(track.toLowerCase())
        this.formdata.reset()
        this.sweetAlertService.backgroundGreen()
        console.log('last', this.listeColisRetourVersAgence)
      } else {
        this.sweetAlertService.sipmleAlert('error', "Verifier les informations", "")
      }
    }
  }
  receptPackageSlip() {
    if (this.selected.length <= 0) {
      this.sweetAlertService.sipmleAlert('info', "Oops c'est vide", "")
    } else {
      this.shipmentOpsService.viderSacRetourVersAgence(this.selected).subscribe(resp => {
        if (resp) {
          this.sweetAlertService.sipmleAlert('success', "Validé avec succes", "");
          this.selected = [];
          this.formSac.reset()
          this.formdata.reset()
          this.count = 0;
          this.router.navigateByUrl("operations/retour/vidé-agence-sac-retour");
        }
      })
    }
  }
  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1)
    this.listeColisRetourVersAgence.push(i.toLowerCase());
    this.count++
  }

}