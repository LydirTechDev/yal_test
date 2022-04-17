import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../shipments-ops.service';
import { ICoursier } from './i-coursier';

@Component({
  selector: 'app-affecter-au-coursier',
  templateUrl: './affecter-au-coursier.component.html',
  styleUrls: ['./affecter-au-coursier.component.scss'],
})
export class AffecterAuCoursierComponent implements OnInit {
  formCoursierSelected: FormGroup;
  formdata: FormGroup;

  count: number = 0;

  coursiers: any[] = [];
  selected: string[] = [];

  listeShipmentsPresLivraison: any[] = [];
  nbrShipmentPresLivraison = 0;

  constructor(
    private shipmentsOpsService: ShipmentsOpsService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {
    this.formCoursierSelected = new FormGroup({
      coursierSelected: new FormControl(),
    });

    this.formdata = new FormGroup({
      tracking: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.listeShipmentsPresLivraison = [];
    this._getListCoursier();
    this._getShipmentsPresLivraison();
  }

  assignedToCoursier() {
    const express_reg = new RegExp(/^\d{8}$/, 'i');
    const track = this.formdata.value['tracking'];
    if (!express_reg.test(track).toString()) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else if (
      !this.listeShipmentsPresLivraison.includes(track.toLowerCase())
    ) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else {
      const index = this.listeShipmentsPresLivraison.indexOf(
        track.toLowerCase()
      );
      if (index > -1) {
        this.listeShipmentsPresLivraison.splice(index, 1);
        this.count += 1;
        this.selected.push(track);
        this.formdata.reset();
        this.sweetAlertService.backgroundGreen();
        console.log('last', this.listeShipmentsPresLivraison);
      } else {
        this.sweetAlertService.basicConfirmWarning('Verifier les informations');
      }
    }
  }

  validateList() {
    if (this.selected.length <= 0) {
      this.sweetAlertService.basicConfirmWarning("Oops c'est vide");
    } else {
      const coursierSelected =
        this.formCoursierSelected.value['coursierSelected'];
      console.log(
        '🚀 ~ file: affecter-au-coursier.component.ts ~ line 84 ~ AffecterAuCoursierComponent ~ validateList ~ coursierSelected',
        coursierSelected
      );
      console.log(
        '🚀 ~ file: affecter-au-coursier.component.ts ~ line 84 ~ AffecterAuCoursierComponent ~ validateList ~ coursierSelected',
        this.selected
      );

      this.shipmentsOpsService
        .assignToCourier(this.selected, coursierSelected)
        .subscribe((resp) => {
          if (resp) {
            this.sweetAlertService.sipmleAlert('success', 'Validé avec succes', '', 'center', false);
            this.selected = [];
            this.count = this.selected.length;
            // this.router.navigateByUrl(
            //   'operations/assignToCourier'
            // );
          }
        });
    }
  }

  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1);
    this.listeShipmentsPresLivraison.push(i.toLowerCase());
    this.count--;
  }

  private _getListCoursier() {
    this.shipmentsOpsService.getCoursiersByStation().subscribe(
      (response) => {
        console.log(response);
        this.coursiers = response;
      },
      (error) => {
        console.log(
          '🚀 ~ file: affecter-au-coursier.component.ts ~ line 51 ~ AffecterAuCoursierComponent ~ _getShipmentsPresLivraison ~ error',
          error
        );
      }
    );
  }

  private _getShipmentsPresLivraison() {
    this.shipmentsOpsService.getShipmentsPresLivraison().subscribe(
      (response) => {
        console.log(
          '🚀 ~ file: affecter-au-coursier.component.ts ~ line 55 ~ AffecterAuCoursierComponent ~ _getShipmentsPresLivraison ~ response',
          response
        );
        this.listeShipmentsPresLivraison = response;
        this.nbrShipmentPresLivraison = response.length
      },
      (error) => {
        console.log(
          '🚀 ~ file: affecter-au-coursier.component.ts ~ line 51 ~ AffecterAuCoursierComponent ~ _getShipmentsPresLivraison ~ error',
          error
        );
      }
    );
  }
}
