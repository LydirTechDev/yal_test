import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../shipments-ops.service';

@Component({
  selector: 'app-emptied-transfert-sac',
  templateUrl: './emptied-transfert-sac.component.html',
  styleUrls: ['./emptied-transfert-sac.component.scss'],
})
export class EmptiedTransfertSacComponent implements OnInit {
  selected: string[] = [];
  listeShipmentEnTransfert: string[] = [];
  count: number = 0;
  formdata: FormGroup;
  formSacTransfert: FormGroup;

  constructor(
    private shipmentsOpsService: ShipmentsOpsService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {
    this.formSacTransfert = new FormGroup({
      sacTracking: new FormControl(),
    });
    this.formdata = new FormGroup({
      tracking: new FormControl(),
    });
  }

  ngOnInit() { }

  checkSack() {
    const express_reg = new RegExp(/^sac-\d{3}\w{3}$/, 'i');
    const tracking = this.formSacTransfert.value['sacTracking'];
    if (express_reg.test(tracking)) {
      this.formSacTransfert.controls['sacTracking'].disable;
      this.shipmentsOpsService
        .getTrackingEnTransfert(tracking.toLowerCase())
        .subscribe(
          (data) => {
          console.log("🚀 ~ file: emptied-transfert-sac.component.ts ~ line 43 ~ EmptiedTransfertSacComponent ~ checkSack ~ data", data)
            if (data.length > 0) {
              this.listeShipmentEnTransfert = data;
              this.count = data.length;
            } else {
              this.sweetAlertService.sipmleAlert(
                'warning',
                'Sac Invalide',
                this.formSacTransfert.value['sacTracking']
              );
              this.listeShipmentEnTransfert = [];
            }
          },
          (error) => {
            this.listeShipmentEnTransfert = [];
            this.sweetAlertService.sipmleAlert(
              'warning',
              'Sac Invalide',
              this.formSacTransfert.value['sacTracking']
            );
          },
          // () => {
          //   this.listeShipmentEnTransfert = [];
          //   this.sweetAlertService.sipmleAlert(
          //     'success',
          //     'Sac Trouver',
          //     this.formSacTransfert.value['sacTracking']
          //   );
          // }
        );
    }
  }

  viderSac() {
    const express_reg = new RegExp(/^\d{8}$/, 'i');
    const tracking = this.formdata.value['tracking'];
    if (!express_reg.test(tracking).toString()) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else if (
      !this.listeShipmentEnTransfert.includes(tracking.toLowerCase())
    ) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else {
      const index = this.listeShipmentEnTransfert.indexOf(
        tracking.toLowerCase()
      );
      if (index > -1) {
        this.listeShipmentEnTransfert.splice(index, 1);
        this.count -= 1;
        this.selected.push(tracking.toLowerCase());
        this.formdata.reset();
        this.sweetAlertService.backgroundGreen();
      } else {
        this.sweetAlertService.sipmleAlert(
          'error',
          'Verifier les informations',
          ''
        );
      }
    }
  }

  receptPackageSlip() {
    if (this.selected.length <= 0) {
      this.sweetAlertService.sipmleAlert('info', 'Oops sac vide', '');
    } else {
      this.shipmentsOpsService.viderSacTransfert(this.selected).subscribe(
        (resp) => {
          if (resp) {
            this.sweetAlertService.sipmleAlert(
              'success',
              'Validé avec succes',
              ''
            );
            this.selected = [];
            this.formdata.reset()
            this.formSacTransfert.reset()
            this.router.navigateByUrl('operations/vidé-transfert-sac');
          }
        },
        (error) => {
          this.sweetAlertService.sipmleAlert('info', 'Erreur', error.message);
        }
      );
    }
  }

  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1);
    this.listeShipmentEnTransfert.push(i.toLowerCase());
    this.count++;
  }
}
