import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../shipments-ops.service';

@Component({
  selector: 'app-create-wilaya-sac',
  templateUrl: './create-wilaya-sac.component.html',
  styleUrls: ['./create-wilaya-sac.component.scss'],
})
export class CreateWilayaSacComponent implements OnInit {
  wilayasData: any[];

  selected: string[] = [];
  listeShipmentVersWilaya: string[] = [];
  count: number = 0;
  formdata: FormGroup;
  formWilayaSelected: FormGroup;

  constructor(
    private shipmentsOpsService: ShipmentsOpsService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {
    this.formWilayaSelected = new FormGroup({
      wilayaSelected: new FormControl(),
    });
    this.formdata = new FormGroup({
      tracking: new FormControl(),
    });
  }

  ngOnInit() {
    this.shipmentsOpsService.findAllWilaya().then((data) => {
      this.wilayasData = data;
      console.log(
        '🚀 ~ file: create-wilaya-sac.component.ts ~ line 21 ~ CreateWilayaSacComponent ~ ngOnInit ~ data',
        data
      );
    });
    console.log(this.wilayasData);
  }

  getColiVersWilya(wilayaId: number) {
    const wilayaS = this.wilayasData.filter((w) => {
      return w.id == this.formWilayaSelected.value['wilayaSelected'];
    });
    return this.shipmentsOpsService
      .getTrackingPresVersWilaya(wilayaId)
      .then((data) => {
        if (data.length == 0) {
          this.sweetAlertService.sipmleAlert(
            'info',
            'Pas de Colis vers',
            wilayaS[0].nomLatin
          );
        }
        this.listeShipmentVersWilaya = data;

      })
      .catch((error) => {
        console.log(
          '🚀 ~ file: create-wilaya-sac.component.ts ~ line 54 ~ CreateWilayaSacComponent ~ getColiVersWilya ~ error',
          error
        );
      })
      .finally(() => {
        console.log('*****************************');
      });
  }

  fillSac() {
    const express_reg = new RegExp(/^\d{8}$/, 'i');
    const tracking = this.formdata.value['tracking'];
    console.log(
      '🚀 ~ file: create-wilaya-sac.component.ts ~ line 58 ~ CreateWilayaSacComponent ~ fillSac ~ tracking',
      tracking
    );

    if (!express_reg.test(tracking).toString()) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else if (!this.listeShipmentVersWilaya.includes(tracking.toLowerCase())) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else {
      const index = this.listeShipmentVersWilaya.indexOf(
        tracking.toLowerCase()
      );
      console.log(
        '🚀 ~ file: create-wilaya-sac.component.ts ~ line 68 ~ CreateWilayaSacComponent ~ fillSac ~ index',
        index
      );
      if (index > -1) {
        this.listeShipmentVersWilaya.splice(index, 1);
        this.count += 1;
        this.selected.push(tracking);
        this.formdata.reset();
        this.sweetAlertService.backgroundGreen();
        console.log('last', this.listeShipmentVersWilaya);
      } else {
        this.sweetAlertService.sipmleAlert(
          'error',
          'Verifier les informations',
          'Verifier les ****informations'
        );
      }
    }
  }

  createSac() {
    if (this.selected.length <= 0) {
      this.sweetAlertService.sipmleAlert(
        'info',
        "Oops c'est vide",
        "Oops *** c'est vide"
      );
    } else {
      const wilayaSelected = this.formWilayaSelected.value['wilayaSelected'];
      console.log(
        '🚀 ~ file: create-wilaya-sac.component.ts ~ line 86 ~ CreateWilayaSacComponent ~ createSac ~ wilayaSelected',
        wilayaSelected
      );
      console.log(
        '🚀 ~ file: create-wilaya-sac.component.ts ~ line 72 ~ CreateWilayaSacComponent ~ fillSac ~ this.selected',
        this.selected
      );

      this.shipmentsOpsService
        .createSacVersWilaya(this.selected, wilayaSelected)
        .subscribe((data) => {
          if (data) {
            console.log(
              '🚀 ~ file: create-wilaya-sac.component.ts ~ line 92 ~ CreateWilayaSacComponent ~ createSac ~ data',
              data
            );
            this.openFile(data, 'application/pdf');
            this.sweetAlertService.sipmleAlert(
              'success',
              'Validé avec succes',
              ''
            );
            this.formWilayaSelected.reset()
            this.formdata.reset()
            this.count = 0
            this.selected = [];
            this.router.navigateByUrl('operations/create-wilaya-sac');
          }
        });
    }
  }

  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1);
    this.listeShipmentVersWilaya.push(i.toLowerCase());
    this.count--;
  }

  openFile(data: any, type: string) {
    console.log(type, data);
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your pop-up blocker and try again!');
    }
  }
}
