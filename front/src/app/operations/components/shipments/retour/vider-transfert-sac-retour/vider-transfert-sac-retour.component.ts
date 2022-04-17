import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../../shipments-ops.service';

@Component({
  selector: 'app-vider-transfert-sac-retour',
  templateUrl: './vider-transfert-sac-retour.component.html',
  styleUrls: ['./vider-transfert-sac-retour.component.scss']
})
export class ViderTransfertSacRetourComponent implements OnInit {
  selected: string[] = [];
  listeColisEnTransfertRetour: string[] = [];
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
    this.listeColisEnTransfertRetour = [];
    const express_reg = new RegExp(/^sac-\d{3}\w{3}$/, 'i')
    const track = this.formSac.value["sacTracking"];
    if (express_reg.test(track)) {
      this.shipmentOpsService.getTrackingReturnTransfert(track.toLowerCase()).subscribe(
        (resp) => {
          if (resp) {
            this.listeColisEnTransfertRetour = resp
            this.count = resp.length;
            if (resp.length == 0) {
              this.sweetAlerteService.sipmleAlert(
                'info',
                'Sac est vidé',
                this.formSac.value['sacTracking']
              );
            }
          }else{
            this.sweetAlerteService.sipmleAlert(
              'warning',
              'Sac Invalide',
              this.formSac.value['sacTracking']
            );
            this.listeColisEnTransfertRetour = [];
            this.formSac.reset()
            this.formdata.reset()
          }
           })
    }
  }
  viderSac() {
    const express_reg = new RegExp(/^\d{8}$/, 'i')
    const track = this.formdata.value["tracking"];
    console.log(track)
    if (!express_reg.test(track).toString()) {
      this.sweetAlerteService.backgroundRed()
      this.formdata.reset()
    } else if (!this.listeColisEnTransfertRetour.includes(track.toLowerCase())) {
      this.sweetAlerteService.backgroundRed()
      this.formdata.reset()
    } else {
      const index = this.listeColisEnTransfertRetour.indexOf(track.toLowerCase());
      console.log(index)
      if (index > -1) {
        this.listeColisEnTransfertRetour.splice(index, 1);
        this.count -= 1
        this.selected.push(track.toLowerCase())
        this.formdata.reset()
        this.sweetAlerteService.backgroundGreen()
        console.log('last', this.listeColisEnTransfertRetour)
      } else {
        this.sweetAlerteService.sipmleAlert('error', "Verifier les informations","")
      }
    }
  }
  receptShipment() {
    if (this.selected.length <= 0) {
      this.sweetAlerteService.sipmleAlert('info', "Oops c'est vide","")
    } else {
      this.shipmentOpsService.viderSacTransfertRetour(this.selected).subscribe(resp => {
        if (resp) {
          this.sweetAlerteService.sipmleAlert('success', "Validé avec succes","");
          this.selected = [];
          this.formSac.reset()
          this.count = 0;
          this.router.navigateByUrl("operations/retour/vidé-transfert-sac-retour");
        }
      })
    }
  }
  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1)
    this.listeColisEnTransfertRetour.push(i.toLowerCase());
    this.count++
  }
}
