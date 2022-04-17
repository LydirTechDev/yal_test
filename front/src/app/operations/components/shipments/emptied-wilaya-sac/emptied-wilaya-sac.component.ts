import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../shipments-ops.service';

@Component({
  selector: 'app-emptied-wilaya-sac',
  templateUrl: './emptied-wilaya-sac.component.html',
  styleUrls: ['./emptied-wilaya-sac.component.scss'],
})
export class EmptiedWilayaSacComponent implements OnInit {
  selected: string[] = [];
  listeShipmentsVersWilaya: string[] = [];
  count: number = 0;
  formdata: FormGroup;
  formSacWilaya: FormGroup;

  constructor(
    private shipmentsOpsService: ShipmentsOpsService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {
    this.formSacWilaya = new FormGroup({
      sacTracking: new FormControl(),
    });
    this.formdata = new FormGroup({
      tracking: new FormControl(),
    });
  }

  ngOnInit(): void {}

  checkSack() {
    const express_reg = new RegExp(/^sac-\d{3}\w{3}$/, 'i');
    const tracking = this.formSacWilaya.value['sacTracking'];

    if (express_reg.test(tracking)) {
      this.shipmentsOpsService
        .getTrackingVersWilaya(tracking.toLowerCase())
        .subscribe(
          (data) => {
            if (data.length > 0) {
              this.sweetAlertService.sipmleAlert(
                'success',
                'Sac Valide',
                tracking
              );
              this.listeShipmentsVersWilaya = data;
              this.count = data.length;
            } else {
              this.sweetAlertService.sipmleAlert(
                'info',
                'Sac Invalide',
                tracking
              );
            }
          },
          (error) => {
            this.sweetAlertService.sipmleAlert('error', '', error.message);
          }
        );
    }
  }

  viderSac() {
    const express_reg = new RegExp(/^\d{8}$/, 'i');
    const tracking = this.formdata.value['tracking'];
    console.log(tracking);
    if (!express_reg.test(tracking).toString()) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else if (
      !this.listeShipmentsVersWilaya.includes(tracking.toLowerCase())
    ) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else {
      const index = this.listeShipmentsVersWilaya.indexOf(
        tracking.toLowerCase()
      );
      console.log(index);
      if (index > -1) {
        this.listeShipmentsVersWilaya.splice(index, 1);
        this.count -= 1;
        this.selected.push(tracking.toLowerCase());
        this.formdata.reset();
        this.sweetAlertService.backgroundGreen();
        console.log('last', this.listeShipmentsVersWilaya);
      } else {
        this.sweetAlertService.sipmleAlert(
          'error',
          'Verifier les informations',
          ''
        );
      }
    }
  }

  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1);
    this.listeShipmentsVersWilaya.push(i.toLowerCase());
    this.count++;
  }

  receptShipments() {
    if (this.selected.length <= 0) {
      this.sweetAlertService.sipmleAlert('info', "Oops c'est vide", '');
    } else {
      this.shipmentsOpsService
        .viderSacVersWilaya(this.selected)
        .subscribe((resp) => {
          if (resp) {
            this.sweetAlertService.sipmleAlert(
              'success',
              'Validé avec succes',
              ''
            );
            this.selected = [];
            this.formSacWilaya.reset()
            this.formdata.reset()
            this.router.navigateByUrl(
              'operations/vidé-wilaya-sac'
            );
          }
        });
      console.log(typeof this.selected, this.selected);
    }
  }
}
