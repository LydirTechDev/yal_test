import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import Swal from 'sweetalert2';
import { FinanceOpsService } from '../finance-ops.service';

@Component({
  selector: 'app-create-recolte-desk',
  templateUrl: './create-recolte-desk.component.html',
  styleUrls: ['./create-recolte-desk.component.scss']
})
export class CreateRecolteDeskComponent implements OnInit {
  coursiers: any[] = [];
  nbrColis = 0;
  listColis = [];
  montant = 0;

  constructor(
    private sweetalertService: SweetAlertService,
    private financeOpsService: FinanceOpsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getRecoltesDeskInformation()
  }

  getRecoltesDeskInformation() {
    this.financeOpsService.getRecoltesDeskInformation().subscribe(resp => {
      console.log('rec', resp)
      console.log("🚀 ~ file: create-recolte.component.ts ~ line 58 ~ CreateRecolteComponent ~ this.financeOpsService.getRecoltesOfCoursiers ~ resp", resp)
      this.montant = resp.montant
      this.listColis = resp.listColisDeskLivre
      this.nbrColis = this.listColis.length

    },
      (error) => {
      console.log("🚀 ~ file: create-recolte-desk.component.ts ~ line 44 ~ CreateRecolteDeskComponent ~ getRecoltesDeskInformation ~ error", error)
      })
  }
  createRecolteDesk() {
    const title = 'Valider la récolte';
    const alertMessage = 'voulez vous confirmer la réception de la récolte!'
    const successTitle = 'Validé avec succés'
    const errorTitle = "Validation echouée"
    const action = this.financeOpsService.createRecolteDesk()
    this.sweetalertService.confirmStandard(title, alertMessage, successTitle, '', null).then(
      (result) => {
        if (result.value) {
          action.toPromise().then(
            (response) => {
              console.log("🚀 ~ CreateRecolteComponent ~ validateReceptionRecolte ~ response", response)
              this.openFile(response, "application/pdf")
              this.ngOnInit()
            },
            (error) => Swal.fire(errorTitle, 'Erreur confirmation', 'error')
          )
          return result.value
        }
      });
  }
  openFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your pop-up blocker and try again!')
    }
  }
}
