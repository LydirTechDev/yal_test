import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../../shipments-ops.service';

@Component({
  selector: 'app-create-client-sac-retour',
  templateUrl: './create-client-sac-retour.component.html',
  styleUrls: ['./create-client-sac-retour.component.scss']
})
export class CreateClientSacRetourComponent implements OnInit {
  selected: string[] = [];
  client: any[] = []
  sacTransfert: string[];
  listeColisARetires: string[] = [];
  countListeColisARetires= 0;
  count: number = 0;
  formdata: FormGroup;
  clientSelected: FormGroup
  constructor(
    private shipmentOpsService: ShipmentsOpsService,
    private sweetAlerteService: SweetAlertService,
    private router: Router
  ) {
    this.clientSelected = new FormGroup({
      clientSelect: new FormControl()
    })
    this.formdata = new FormGroup({
      tracking: new FormControl()
    })
   }

  ngOnInit(): void {
    this.getListClients()

  }
  fillSac() {
    const express_reg = new RegExp(/^\d{8}$/, 'i')
    const track = this.formdata.value["tracking"];
    console.log(track)
    if (!express_reg.test(track).toString()) {
      this.sweetAlerteService.backgroundRed()
      this.formdata.reset()
    } else if (!this.listeColisARetires.includes(track.toLowerCase())) {
      this.sweetAlerteService.backgroundRed()
      this.formdata.reset()
    } else {
      const index = this.listeColisARetires.indexOf(track.toLowerCase());
      console.log(index)
      if (index > -1) {
        this.listeColisARetires.splice(index, 1);
        this.count += 1
        this.selected.push(track)
        this.formdata.reset()
        this.sweetAlerteService.backgroundGreen()
        console.log('last', this.listeColisARetires)
      } else {
        this.sweetAlerteService.sipmleAlert('error', "Verifier les informations","")
      }
    }
  }
  createSac() {
    if (this.selected.length <= 0) {
      this.sweetAlerteService.sipmleAlert('info', "Oops c'est vide", "")
    } else {
      this.shipmentOpsService.createSacRetourClient(this.selected)
        .subscribe(resp => {
          if (resp) {
            this.openFile(resp, "application/pdf")
            this.sweetAlerteService.sipmleAlert('success', "Validé avec succes", "")
            this.selected = []
            this.formdata.reset()
            this.clientSelected.reset()
            this.count = 0;
            this.router.navigateByUrl("operations/retour/creer-client-sac-retour");
          }
        });

    }
  }
  getListClients() {
    return this.shipmentOpsService.getListClientsAttachedToMyStation().then(async (resp) => {
      for await (const client of resp) {
        console.log(resp)
        this.client.push({
          id: client.id,
          nom: client.nomCommercial,
        })
      }
    });
  }
  getColiPresARetire(idClient) {
    this.shipmentOpsService.getColiPresARetire(idClient).then(resp => {
      this.listeColisARetires = resp
      this.countListeColisARetires =resp.length
      console.log(resp)
    })
  }
  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1)
    this.listeColisARetires.push(i.toLowerCase());
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