import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FinanceService } from '../../finance.service';

@Component({
  selector: 'app-receive-recoltes',
  templateUrl: './receive-recoltes.component.html',
  styleUrls: ['./receive-recoltes.component.scss'],
})
export class ReceiveRecoltesComponent implements OnInit {
  count: number = 0;
  formdata: FormGroup;
  arrOfRct = [];
  listRctRecoltes = [];
  constructor(
    private financeService: FinanceService,
    public sweetAlertService: SweetAlertService
  ) {
    this.formdata = new FormGroup({
      rctTracking: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.getRecoltePresRecolte();
  }
  
  recieveRecoltesCheck() {
    const express_reg = new RegExp(/^rct-\d{3}\w{3}$/, 'i');
    const track = this.formdata.value['rctTracking'];
    if (!express_reg.test(track)) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else if (!this.listRctRecoltes.includes(track.toLowerCase())) {
      this.sweetAlertService.backgroundRed();
      this.formdata.reset();
    } else {
      const index = this.listRctRecoltes.indexOf(track.toLowerCase());
      if (index > -1) {
        this.listRctRecoltes.splice(index, 1);
        this.count += 1;
        this.arrOfRct.push(track);
        this.formdata.reset();
        this.sweetAlertService.backgroundGreen();
        console.log('last', this.listRctRecoltes);
      } else {
        this.sweetAlertService.basicWarning('Verifier les informations');
      }
    }
  }

  getRecoltePresRecolte() {
    return this.financeService.getRecoltePresRecolte().subscribe((resp) => {
      console.log("🚀 ~ file: receive-recoltes.component.ts ~ line 55 ~ ReceiveRecoltesComponent ~ returnthis.financeService.getRecoltePresRecolte ~ resp", resp)
      if (resp == null) {
        this.listRctRecoltes = [];
      } else {
        this.listRctRecoltes = resp;
      }
    });
  }
  setRecolteRecue() {
    if (this.arrOfRct.length <= 0) {
      this.sweetAlertService.sipmleAlert('info', 'Verifier', "Oops c'est vide");
    } else {
      this.financeService.setRecolteRecue(this.arrOfRct).subscribe((resp) => {
        if (resp) {
          this.sweetAlertService.sipmleAlert(
            'success',
            'Valider',
            'Validé avec succes'
          );
          this.arrOfRct = [];
          this.count = 0;
          this.getRecoltePresRecolte();
        }
      });
    }
  }

  deletSelectedRecolte(i: any) {
    this.arrOfRct.splice(this.arrOfRct.indexOf(i.toLowerCase()), 1);
    this.listRctRecoltes.push(i.toLowerCase());
    this.count--;
  }
}
