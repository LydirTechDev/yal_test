import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { CoursierService } from '../../coursier.service';

@Component({
  selector: 'app-receive-shipments',
  templateUrl: './receive-shipments.component.html',
  styleUrls: ['./receive-shipments.component.scss'],
})
export class ReceiveShipmentsComponent implements OnInit {
  listeShipmentToReceive: string[] = [];
  selected: string[] = [];
  formdata: FormGroup;
  count: number = 0;

  constructor(
    private readonly coursierService: CoursierService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {
    this.formdata = new FormGroup({
      tracking: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.getShipmentsCoursierReceive();
  }

  getShipmentsCoursierReceive() {
    this.coursierService.getShipmentsCoursierReceive().subscribe(
      (responce) => {
        console.log(
          '🚀 ~ file: receive-shipments.component.ts ~ line 19 ~ ReceiveShipmentsComponent ~ getShipmentsCoursierReceive ~ responce',
          responce
        );
        this.listeShipmentToReceive = responce;
      },
      (error) => {
        console.log(
          '🚀 ~ file: receive-shipments.component.ts ~ line 20 ~ ReceiveShipmentsComponent ~ this.coursierService.getShipmentsCoursierReceive ~ error',
          error
        );
      }
    );
  }

  fillListCoursier() {
    const express_reg = new RegExp(/^\d{8}$/, 'i');
    const track = this.formdata.value['tracking'];
    console.log(track);
    if (!express_reg.test(track).toString()) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else if (!this.listeShipmentToReceive.includes(track.toLowerCase())) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else {
      const index = this.listeShipmentToReceive.indexOf(track.toLowerCase());
      console.log(index);
      if (index > -1) {
        this.listeShipmentToReceive.splice(index, 1);
        this.count += 1;
        this.selected.push(track);
        this.formdata.reset();
        this.sweetAlertService.backgroundGreen();
        console.log('last', this.listeShipmentToReceive);
      } else {
        this.sweetAlertService.sipmleAlert(
          'error',
          'Verifier les informations',
          '',
          'center'
        );
      }
    }
  }

  validateList() {
    if (this.selected.length <= 0) {
      this.sweetAlertService.sipmleAlert(
        'info',
        "Oops c'est vide",
        '',
        'center'
      );
    } else {
      this.coursierService.receivePackageSlip(this.selected).subscribe(
        (response) => {
          if (response == true) {
            this.sweetAlertService.sipmleAlert(
              'success',
              'Validé avec succes',
              '',
              'center'
            );
            this.selected = [];
            this.count = this.listeShipmentToReceive.length;
            this.router.navigateByUrl('coursier/receve-shipments');
          }
        },
        (error) => {
          console.log(
            '🚀 ~ file: receive-shipments.component.ts ~ line 105 ~ ReceiveShipmentsComponent ~ .subscribe ~ error',
            error
          );
        }
      );
    }
  }
  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1);
    this.listeShipmentToReceive.push(i.toLowerCase());
    this.count--;
  }
}
