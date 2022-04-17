import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../shipments-ops.service';

@Component({
  selector: 'app-create-transfert-sac',
  templateUrl: './create-transfert-sac.component.html',
  styleUrls: ['./create-transfert-sac.component.scss']
})
export class CreateTransfertSacComponent implements OnInit {

  selected: string[] = [];
  station: any[] = []
  sacTransfert: string[];
  listeShipmentsTransfert: string[] = [];
  count: number = 0;
  formdata: FormGroup;
  stationSelected: FormGroup

  constructor(
    private shipmentsOpsService: ShipmentsOpsService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {
    this.stationSelected = new FormGroup({
      stationSelect: new FormControl(null)
    });
    this.formdata = new FormGroup({
      tracking: new FormControl()
    })

  }

  ngOnInit(): void {
    this.stationSelected.controls['stationSelect'].value
    console.log("🚀 ~ file: create-transfert-sac.component.ts ~ line 32 ~ CreateTransfertSacComponent ~ ngOnInit ~ this.stationSelected.controls['stationSelect'].value", this.stationSelected.controls['stationSelect'].value)
    this.getHubs()
    this.getShipmentsPresTransfert()
  }

  async getShipmentsPresTransfert() {
    await this.shipmentsOpsService.getShipmentsPresTransfert().then(
      (data) => {
        this.listeShipmentsTransfert = data
      },
      (error)=> {
        this.listeShipmentsTransfert = []
      }
    )
  }

  /**
   * Aretoucher
   */
  fillSac() {
    const express_reg = new RegExp(/^\d{8}$/, 'i')
    const track = this.formdata.value["tracking"];
    console.log(track)
    if (!express_reg.test(track).toString()) {
      this.sweetAlertService.backgroundRed()
      this.formdata.reset()
    } else if (!this.listeShipmentsTransfert.includes(track.toLowerCase())) {
      this.sweetAlertService.backgroundRed()
      this.formdata.reset()
    } else {
      const index = this.listeShipmentsTransfert.indexOf(track.toLowerCase());
      console.log(index)
      if (index > -1) {
        this.listeShipmentsTransfert.splice(index, 1);
        this.count += 1
        this.selected.push(track)
        this.formdata.reset()
        this.sweetAlertService.backgroundGreen()
        console.log('last', this.listeShipmentsTransfert)
      } else {
        this.sweetAlertService.sipmleAlert('error', "Verifier les informations", "Verifier les informations")
      }
    }
  }

  createSac() {
    if (this.selected.length <= 0) {
      this.sweetAlertService.sipmleAlert('info', "Oops c'est vide", "Oops c'est vide")
    } else {
      const stationSelected = this.stationSelected.value['stationSelect']
      console.log("🚀 ~ ###################################### ~ CreateTransfertSacComponent ~ createSac ~ stationSelected", stationSelected)
      this.shipmentsOpsService.createSacTransfertShipment(this.selected, stationSelected)
        .subscribe(resp => {
          if (resp) {
            this.openFile(resp, "application/pdf")
            this.sweetAlertService.sipmleAlert('success', "Validé avec succes", 'ssss')
            this.selected = []
            this.formdata.reset()
            this.stationSelected.reset()
            this.count= 0;
            this.router.navigateByUrl("operations/create-transfert-sac");
          }
        });
    }
  }
  
  async getHubs() {
    const resp = await this.shipmentsOpsService.getStationsHubs();
    for await (const station of resp) {
      console.log("🚀 ~ file: create-transfert-sac.component.ts ~ line 89 ~ CreateTransfertSacComponent ~ forawait ~ resp", resp);
      this.station.push({
        id: station.id,
        nom: station.nom,
        type: station.type,
      });
      console.log("🚀 ~ file: create-transfert-sac.component.ts ~ line 95 ~ CreateTransfertSacComponent ~ forawait ~ this.station", this.station);
    }
  }

  getColiTransfert() {
    this.shipmentsOpsService.getShipmentsPresTransfert().then(resp => {
      this.listeShipmentsTransfert = resp
      console.log(resp)
    })
  }

  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1)
    this.listeShipmentsTransfert.push(i.toLowerCase());
    this.count--
  }

  openFile(data: any, type: string) {
    console.log(type, data)
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your pop-up blocker and try again!')
    }
  }
}
