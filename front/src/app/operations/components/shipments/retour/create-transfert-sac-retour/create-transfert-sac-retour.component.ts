import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../../shipments-ops.service';

@Component({
  selector: 'app-create-transfert-sac-retour',
  templateUrl: './create-transfert-sac-retour.component.html',
  styleUrls: ['./create-transfert-sac-retour.component.scss']
})
export class CreateTransfertSacRetourComponent implements OnInit {
  stationDestination: number;
  selected: string[] = [];
  station: any[] = []
  sacTransfert: string[];
  listeColisTransfert: string[] = [];
  count: number = 0;
  formdata: FormGroup;
  stationSelected: FormGroup
  constructor(
    private shipmentOpsService: ShipmentsOpsService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {
    this.stationSelected = new FormGroup({
      stationSelect: new FormControl()
    })
    this.formdata = new FormGroup({
      tracking: new FormControl()
    })
   }

  ngOnInit(): void {
    this.getStationsCentreRetour()
  }
  fillSac() {
    const express_reg = new RegExp(/^\d{8}$/, 'i')
    const track = this.formdata.value["tracking"];
    console.log(track)
    if (!express_reg.test(track).toString()) {
      this.sweetAlertService.backgroundRed()
      this.formdata.reset()
    } else if (!this.listeColisTransfert.includes(track.toLowerCase())) {
      this.sweetAlertService.backgroundRed()
      this.formdata.reset()
    } else {
      const index = this.listeColisTransfert.indexOf(track.toLowerCase());
      console.log(index)
      if (index > -1) {
        this.listeColisTransfert.splice(index, 1);
        this.count += 1
        this.selected.push(track)
        this.formdata.reset()
        this.sweetAlertService.backgroundGreen()
        console.log('last', this.listeColisTransfert)
      } else {
        this.sweetAlertService.sipmleAlert('error', "Verifier les informations","")
      }
    }
  }
  createSac() {
    if (this.selected.length <= 0) {
      this.sweetAlertService.sipmleAlert('info', "Oops c'est vide","")
    } else {
      const stationSelected = this.stationSelected.value['stationSelect']
      this.shipmentOpsService.createSacTransfertRetour(this.selected, stationSelected)
        .subscribe(resp => {
          if (resp) {
            this.openFile(resp, "application/pdf")
            this.sweetAlertService.sipmleAlert('success', "Validé avec succes","")
            this.selected = []
            this.count = 0;
            this.stationSelected.reset()
            this.formdata.reset()
            this.router.navigateByUrl("operations/retour/create-transfert-sac-retour");
          }
        });

    }
  }
  async getStationsCentreRetour() {
    const stations = await this.shipmentOpsService.getStationsTransfertRetour()
    for await (const station of stations) {
        this.station.push({
          id: station.id,
          stationName: station.nom,
          type: station.type,
        })
      };
  }
  getColiTransfertRetour(idStation) {
    this.shipmentOpsService.getTrackingPresTranfsertRetour(idStation).subscribe(resp => {
      this.listeColisTransfert = resp
      console.log(resp)
    })
  }
  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1)
    this.listeColisTransfert.push(i.toLowerCase());
    this.count++
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
