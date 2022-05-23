import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../../shipments-ops.service';

@Component({
  selector: 'app-remetre-colis-client',
  templateUrl: './remetre-colis-client.component.html',
  styleUrls: ['./remetre-colis-client.component.scss']
})
export class RemetreColisClientComponent implements OnInit {
  selected: string[] = [];
  client: any[] = [];
  sacTransfert: string[];
  /**
   * list sac du client selectionner
   */
  listeSacs: string[] = [];

  /**
   *
   */
  listColisOfSac: string[] = [];
  /**
   * nb colis du client selectionner
   */
  nbrColis = 0;
  /**
   * nb sac du clinet selectionner
   */
  nbrSacs = 0;
  /**
   * turn to true is any sac is loaded
   */
  sacLoaded: boolean;

  count: number = 0;
  formdata: FormGroup;
  clientSelected: FormGroup;
  formSac: FormGroup;
  clientLoaded: boolean;
  ctl: any;

  constructor(
    private shipmentOpsService: ShipmentsOpsService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {
    this.clientSelected = new FormGroup({
      clientSelect: new FormControl(),
    });
    this.formdata = new FormGroup({
      tracking: new FormControl(),
    });
    this.formSac = new FormGroup({
      sacTracking: new FormControl(),
    });
   }

  ngOnInit(): void {
    this.clientLoaded = false;
    this.sacLoaded = false;
    this.getListClients();
  }
  checkSack() {
    const express_reg = new RegExp(/^sac-\d{8}$/, 'i');
    const track = this.formSac.value['sacTracking'];
    console.log('track', track);
    if (express_reg.test(track)) {
      this.shipmentOpsService
        .getTrackingOfSacVersVendeur(track.toLowerCase())
        .subscribe(
          (resp) => {
          console.log("🚀 ~ file: remetre-colis-client.component.ts ~ line 75 ~ RemetreColisClientComponent ~ checkSack ~ resp", resp)
            if (resp) {
              this.listColisOfSac = resp;
              this.count = resp.length;
              this.sacLoaded = true;
              if (resp.length == 0) {
                this.sweetAlertService.sipmleAlert(
                  'info',
                  'Sac est vidé',
                  this.formSac.value['sacTracking']
                );
              }
            }else {
              this.sweetAlertService.sipmleAlert(
                'warning',
                'Sac Invalide',
                this.formSac.value['sacTracking']
              );
              this.listColisOfSac = [];
              this.formSac.reset()
              this.formdata.reset()
            }
            },
          (error) => {
            console.log(
              '🚀 ~ file: remetre-colis-au-client.component.ts ~ line 77 ~ RemetreColisAuClientComponent ~ checkSack ~ error',
              error
            );
          }
        );
    } else {
      this.sweetAlertService.sipmleAlert(
        'warning',
        'Sac Invalide',
        this.formSac.value['sacTracking']
      );
      this.listColisOfSac = [];
      this.formSac.reset()
      this.formdata.reset()
    }
  }

  viderSac() {
    const express_reg = new RegExp(/^\d{8}$/, 'i');
    const track = this.formdata.value['tracking'];
    console.log(track);
    if (!express_reg.test(track).toString()) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else if (!this.listColisOfSac.includes(track.toLowerCase())) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else {
      const index = this.listColisOfSac.indexOf(track.toLowerCase());
      console.log(index);
      if (index > -1) {
        this.listColisOfSac.splice(index, 1);
        this.count -= 1;
        this.selected.push(track.toLowerCase());
        this.formdata.reset();
        this.sweetAlertService.backgroundGreen();
        console.log('last', this.listColisOfSac);
      } else {
        this.sweetAlertService.sipmleAlert('error', 'Verifier les informations', '');
      }
    }
  }
  receptShipmentClient() {
    if (this.selected.length <= 0) {
      this.sweetAlertService.sipmleAlert('info', "Oops c'est vide", "");
    } else {
      const sacTracking = this.formSac.value['sacTracking'];
      const idClient = this.clientSelected.value['clientSelect'].id;
      this.shipmentOpsService
        .receptShipmentClient(this.selected, sacTracking, idClient)
        .subscribe((resp) => {
          if (resp) {
            this.openFile(resp, 'application/pdf');
            this.sweetAlertService.sipmleAlert('success', 'Validé avec succes',"");
            this.selected = [];
            this.formSac.reset();
            this.formdata.reset();
            this.nbrSacs -= 1;
            this.listeSacs.splice(
              this.selected.indexOf(sacTracking.toLowerCase()),
              1
            );
            this.count = 0;
            this.router.navigateByUrl(
              'operations/retour/remetre-au-client'
            );
          }
        });
    }
  }

  /**
   * liste clinent
   * @returns
   */
  getListClients() {
    this.client = [];
    this.clientSelected.reset('clientSelect');
    return this.shipmentOpsService
      .getListClientsAttachedToMyStation()
      .then(async (resp) => {
        for await (const client of resp) {
          this.client.push({
            id: client.id,
            nom: client.nomCommercial,
          });
        }
      });
  }

  /**
   * get client info sac cont and shipmnet cont
   */
  getSacsClientInformation(idClient) {
    this.shipmentOpsService.getSacsClientInformation(idClient.id).subscribe(
      (resp) => {
      console.log("🚀 ~ file: remetre-colis-client.component.ts ~ line 195 ~ RemetreColisClientComponent ~ getSacsClientInformation ~ resp", resp)
        for (const tracking of resp[0]) {
          console.log(
            '🚀 ~ file: remetre-colis-au-client.component.ts ~ line 122 ~ RemetreColisAuClientComponent ~ this.sacService.getSacsClientInformation ~ tracking',
            tracking
          );
          this.listeSacs.push(tracking);
        }
        this.nbrColis = parseInt(resp[1]);
        this.nbrSacs = resp[0].length;
        this.ctl = this.clientSelected.value['clientSelect'];

        if (resp[0].length >= 0) {
          this.clientLoaded = true;
        }
      },
      (error) => {
        console.log(
          '🚀 ~ file: remetre-colis-au-client.component.ts ~ line 129 ~ RemetreColisAuClientComponent ~ this.sacService.getSacsClientInformation ~ error',
          error
        );
        this.clientLoaded = false;
      }
    );
  }

  changeClient() {
    console.log('***********');
    this.nbrSacs = 0;
    this.nbrColis = 0;
    this.listeSacs = [];
    this.clientLoaded = false;
    this.listColisOfSac = [];
    this.count = 0;
    this.sacLoaded = false;
    this.formSac.reset('sacTracking');
    this.getListClients();
  }


  changeSac() {
    this.formSac.reset('sacTracking');
    this.listColisOfSac = [];
    this.formdata.reset('tracking');
    this.count = 0;
    this.sacLoaded = false;
  }
  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1);
    this.listColisOfSac.push(i.toLowerCase());
    this.count++;
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
