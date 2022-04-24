import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { CoursierService } from '../../coursier.service';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.scss'],
})
export class PickupComponent implements OnInit {
  formdata: FormGroup;
  liste_colis_pres_exp: string[] = [];
  arr: string[] = [];
  count: number = 0;

  constructor(
    private coursierService: CoursierService,
    private sweetAlertService: SweetAlertService
  ) {
    this.formdata = new FormGroup({
      tracking: new FormControl(),
    });
  }
  ngOnInit(): void {
    this.getColisPresExpedition();
  }

  recieveShipments() {
    const express_reg = new RegExp(/^\d{8}$/, 'i');
    const track = this.formdata.value['tracking'];
    console.log(
      '🚀 ~ file: receive-shipment.component.ts ~ line 33 ~ ReceiveShipmentComponent ~ recieveShipments ~ track',
      track
    );
    if (!express_reg.test(track).toString()) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else if (!this.liste_colis_pres_exp.includes(track.toLowerCase())) {
      console.log(
        '🚀 ~ file: receive-shipment.component.ts ~ line 40 ~ ReceiveShipmentComponent ~ recieveShipments ~ this.liste_colis_pres_exp',
        this.liste_colis_pres_exp
      );
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else {
      console.log(
        '🚀 ~ file: receive-shipment.component.ts ~ line 43 ~ ReceiveShipmentComponent ~ recieveShipments ~ track',
        track.toLowerCase()
      );
      const index = this.liste_colis_pres_exp.indexOf(track.toLowerCase());
      if (index > -1) {
        this.liste_colis_pres_exp.splice(index, 1);
        this.count += 1;
        this.arr.push(track);
        this.formdata.reset();
        this.sweetAlertService.backgroundGreen();
        console.log('last', this.liste_colis_pres_exp);
      } else {
        console.log(
          "🚀 ~ file: receive-shipment.component.ts ~ line 51 ~ ReceiveShipmentComponent ~ newColis ~ this.sweetAlertService.defaultAlert('error', Verifier les informations this.sweetAlertService.defaultAlert('error', Verifier les informations"
        );
      }
    }
  }

  deletSelectedShipment(i: any) {
    this.arr.splice(this.arr.indexOf(i.toLowerCase()), 1);
    this.liste_colis_pres_exp.push(i.toLowerCase());
    this.count--;
  }

  getColisPresExpedition() {
    return this.coursierService.getTrackingPresExp().subscribe(
      (resp) => {
        console.log(
          '🚀 ~ file: receive-shipment.component.ts ~ line 69 ~ ReceiveShipmentComponent ~ getColisPresExpedition ~ resp',
          resp
        );
        if (resp == null) {
          this.liste_colis_pres_exp = [];
        } else {
          this.liste_colis_pres_exp = resp;
        }
      },
      (error) => {
        this.sweetAlertService.sipmleAlert(
          'error',
          'Verifier',
          'Erreur de chargement'
        );
      }
    );
  }

  setShipmentExpedier() {
    if (this.arr.length <= 0) {
      this.sweetAlertService.sipmleAlert('info', 'Verifier', "Oops c'est vide");
    } else {
      const expidie = this.coursierService.setShipmentRamasser(this.arr);
      if (expidie) {
        this.sweetAlertService.sipmleAlert(
          'success',
          'Valider',
          'Validé avec succes'
        );
        this.arr = [];
        this.count = 0;
        this.getColisPresExpedition();
      }
    }
  }
}
