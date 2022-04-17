import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../../shipments-ops.service';

@Component({
  selector: 'app-create-wilaya-sac-retour',
  templateUrl: './create-wilaya-sac-retour.component.html',
  styleUrls: ['./create-wilaya-sac-retour.component.scss']
})
export class CreateWilayaSacRetourComponent implements OnInit {
  wilayaDestination: number;
  selected: string[] = [];
  wilaya: any[] = []
  listeColisPresRetourVersWilaya: string[] = [];
  count: number = 0;
  formdata: FormGroup;
  formWilayaSelected: FormGroup
  constructor(
    private shipmentOpsService: ShipmentsOpsService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {
    this.formWilayaSelected = new FormGroup({
      wilayaSelected: new FormControl()
    })
    this.formdata = new FormGroup({
      tracking: new FormControl()
    })
   }

  ngOnInit(): void {
    this.getWilayasOfMyCentre()
  }

  fillSac() {
    const express_reg = new RegExp(/^\d{8}$/, 'i')
    const track = this.formdata.value["tracking"];
    console.log(track)
    if (!express_reg.test(track).toString()) {
      this.sweetAlertService.backgroundRed()
      this.formdata.reset()
    } else if (!this.listeColisPresRetourVersWilaya.includes(track.toLowerCase())) {
      this.sweetAlertService.backgroundRed()
      this.formdata.reset()
    } else {
      const index = this.listeColisPresRetourVersWilaya.indexOf(track.toLowerCase());
      console.log(index)
      if (index > -1) {
        this.listeColisPresRetourVersWilaya.splice(index, 1);
        this.count += 1
        this.selected.push(track)
        this.formdata.reset()
        this.sweetAlertService.backgroundGreen()
        console.log('last', this.listeColisPresRetourVersWilaya)
      } else {
        this.sweetAlertService.sipmleAlert('error', "Verifier les informations","")
      }
    }
  }
  createSac() {
    if (this.selected.length <= 0) {
      this.sweetAlertService.sipmleAlert('info', "Oops c'est vide","")
    } else {
      const wilayaSelected = this.formWilayaSelected.value['wilayaSelected']
      this.shipmentOpsService.createSacRetourVersWilaya(this.selected, wilayaSelected).subscribe(resp => {
        if (resp) {
          this.sweetAlertService.sipmleAlert('success', "Validé avec succes","")
          this.openFile(resp, "application/pdf")
          this.count = 0;
          this.selected = []
          this.formWilayaSelected.reset()
          this.formdata.reset()
          this.router.navigateByUrl("operations/retour/create-wilaya-sac-retour");
        }
      }
      );
    }
  }
  getWilayasOfMyCentre() {
    return this.shipmentOpsService.getWilayasOfMyCentre().then(async (resp) => {
      console.log(resp)
      if (resp !== null) {
        for await (const wilaya of resp) {
          this.wilaya.push({ id: wilaya.id, code: wilaya.codeWilaya, nomLatin: wilaya.nomLatin })
        }
      }
    });
  }
  getColiVersWilya(idWilaya) {
    const wilayaS = this.wilaya.filter((w) => {
      return w.id == this.formWilayaSelected.value['wilayaSelected'];
    });
    return this.shipmentOpsService.getTrackingPresRetourVersWilaya(idWilaya).then((data) => {
      if (data.length == 0) {
        this.sweetAlertService.sipmleAlert(
          'info',
          'Pas de Colis en retour vers', wilayaS[0].nomLatin
        );
      }
      this.listeColisPresRetourVersWilaya = data

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
  deletselected(i) {
    this.selected.splice(this.selected.indexOf(i.toLowerCase()), 1)
    this.listeColisPresRetourVersWilaya.push(i.toLowerCase());
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
