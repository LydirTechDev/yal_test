import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../../shipments-ops.service';

@Component({
  selector: 'app-receive-returns-coursier',
  templateUrl: './receive-returns-coursier.component.html',
  styleUrls: ['./receive-returns-coursier.component.scss']
})
export class ReceiveReturnsCoursierComponent implements OnInit {
  coursiers: any[] = []
  formdata: FormGroup
  formCoursierSelected: FormGroup
  liste_colis_retour: string[] = [];
  liste_colis_echec: string[] = [];
  liste_colis_tentative: string[] = [];

  selected: string[] = []
  count: number = 0;
  total: number = 0;
  constructor(
    private sweetAlerteService :SweetAlertService,
    private shipmentsOpsService: ShipmentsOpsService
  ) {

    this.formCoursierSelected = new FormGroup({
      coursierSelected: new FormControl()
    })
    this.formdata = new FormGroup({
      tracking: new FormControl()
    })
   }

  ngOnInit(): void {
    this.getCoursier()
  }
  newColis() {
    const express_reg = new RegExp(/^\d{8}$/, 'i')
    const track = this.formdata.value["tracking"];
    if (!express_reg.test(track).toString()) {
      this.sweetAlerteService.backgroundRed()
      this.formdata.reset()
    } else if (!this.liste_colis_retour.includes(track.toLowerCase())) {
      this.sweetAlerteService.backgroundRed()
      this.formdata.reset()

    } else {
      const index = this.liste_colis_retour.indexOf(track.toLowerCase());
      if (index > -1) {
        this.liste_colis_retour.splice(index, 1);
        this.count += 1
        this.selected.push(track)
        this.formdata.reset()
        this.sweetAlerteService.backgroundGreen()
      } else {
        this.sweetAlerteService.backgroundRed()
        this.sweetAlerteService.sipmleAlert('error', "Verifier les informations", '')
      }
    }
  }
  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1)
    this.liste_colis_retour.push(i.toLowerCase());
    this.count--
  }
  setPacakgesSlipReturnStation() {
    console.log('hakim' + this.selected)
    if (this.selected.length <= 0) {
      this.sweetAlerteService.sipmleAlert('info', "Oops c'est vide",'')
    } else {
      const expidie = this.shipmentsOpsService.setReturnStation(this.selected)
      console.log(typeof this.selected, this.selected)
      if (expidie) {
        this.sweetAlerteService.sipmleAlert('success', "Validé avec succes", '')
        this.selected = []
        this.liste_colis_retour = [];
        this.liste_colis_echec = [];
        this.liste_colis_tentative = [];
        this.count = 0;
        this.total = 0;
        this.formdata.reset()
        this.formCoursierSelected.reset()


      }
    }
  }
  getShipmentsReturnStation(coursierId) {
    return this.shipmentsOpsService.getShipmentsReturnStation(coursierId)
      .subscribe(
        resp => {
          console.log(resp);
          this.total = resp['listeShipmentsToReturn'].length
          this.liste_colis_retour = resp['listeShipmentsToReturn']
          this.liste_colis_echec = resp['listeShipmentsEchec']
          this.liste_colis_tentative = resp['listeShipmentsTentative']

        },
        error => {
          console.log(error);
          this.sweetAlerteService.sipmleAlert('error', 'Erreur de chargement','')
        }
      );
  }
  getCoursier() {
    return this.shipmentsOpsService.getCoursiersByStation().subscribe((resp) => {
      console.log(resp);
      this.coursiers = resp
    })
  }
}

