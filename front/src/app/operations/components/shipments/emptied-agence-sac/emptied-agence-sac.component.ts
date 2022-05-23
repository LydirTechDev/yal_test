import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../shipments-ops.service';

@Component({
  selector: 'app-emptied-agence-sac',
  templateUrl: './emptied-agence-sac.component.html',
  styleUrls: ['./emptied-agence-sac.component.scss']
})
export class EmptiedAgenceSacComponent implements OnInit {
  selected: string[] = [];
  listeShipmentsVersAgence: string[] = [];
  count: number = 0;
  formdata: FormGroup;
  formSacAgence: FormGroup;

  constructor(
    private shipmentsOpsService: ShipmentsOpsService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {
    this.formSacAgence = new FormGroup({
      sacTracking: new FormControl(),
    });
    this.formdata = new FormGroup({
      tracking: new FormControl(),
    });
  }

  ngOnInit(): void { }

  checkSack() {
    const express_reg = new RegExp(/^sac-\d{8}$/, 'i')
    const tracking = this.formSacAgence.value['sacTracking'];

    if (express_reg.test(tracking)) {
      this.shipmentsOpsService
        .getTrackingVersAgence(tracking.toLowerCase())
        .then(
          (data) => {
            if (data.length > 0) {
              this.sweetAlertService.sipmleAlert(
                'success',
                'Sac Valide',
                tracking
              );
              this.listeShipmentsVersAgence = data;
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
      !this.listeShipmentsVersAgence.includes(tracking.toLowerCase())
    ) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else {
      const index = this.listeShipmentsVersAgence.indexOf(
        tracking.toLowerCase()
      );
      console.log(index);
      if (index > -1) {
        this.listeShipmentsVersAgence.splice(index, 1);
        this.count -= 1;
        this.selected.push(tracking.toLowerCase());
        this.formdata.reset();
        this.sweetAlertService.backgroundGreen();
        console.log('last', this.listeShipmentsVersAgence);
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
    this.listeShipmentsVersAgence.push(i.toLowerCase());
    this.count++;
  }

  receptShipments() {
    if (this.selected.length <= 0) {
      this.sweetAlertService.sipmleAlert('info', "Oops c'est vide", '');
    } else {
      this.shipmentsOpsService
        .viderSacVersAgence(this.selected)
        .subscribe((resp) => {
          if (resp) {
            this.sweetAlertService.sipmleAlert(
              'success',
              'Validé avec succes',
              ''
            );
            this.selected = [];
            this.formdata.reset()
            this.formSacAgence.reset()
            this.router.navigateByUrl(
              'operations/vider-agence-sac'
            );
          }
        });
      console.log(typeof this.selected, this.selected);
    }
  }
}
