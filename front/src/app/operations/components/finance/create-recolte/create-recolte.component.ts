import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import Swal from 'sweetalert2';
import { FinanceOpsService } from '../finance-ops.service';

@Component({
  selector: 'app-create-recolte',
  templateUrl: './create-recolte.component.html',
  styleUrls: ['./create-recolte.component.scss']
})
export class CreateRecolteComponent implements OnInit {
  coursiers: any[] = [];
  nbrColis = 0;
  coursierLoaded: boolean;
  ctl: any;
  listColis = [];
  montant = 0;
  coursiersSelect: FormGroup;

  constructor(
    private sweetalertService: SweetAlertService,
    private financeOpsService: FinanceOpsService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.coursiersSelect = new FormGroup({
      coursierSelected: new FormControl(),
    });
    this.getListCoursiers();
    this.coursierLoaded = false;
  }
  changeCoursier() {
    this.nbrColis = 0;
    this.coursiers = [];
    this.listColis = [];
    this.coursierLoaded = false;
    this.montant = 0;
    this.ctl = {};
    this.coursiersSelect.reset('coursierSelected');
    this.getListCoursiers();
  }

  getListCoursiers() {
    this.coursiers = [];
    this.coursiersSelect.reset('coursierSelected');
    return this.financeOpsService
      .getListCoursiersAttachedToMyStation()
      .subscribe(async (resp) => {
        for await (const coursier of resp) {
          this.coursiers.push({
            id: coursier.id,
            nom: coursier.nom,
            prenom: coursier.prenom,

          });
        }
        console.log(this.coursiers)

      })
  }
  getRecoltesCoursierInformation(Coursier) {
    this.financeOpsService.getRecoltesOfCoursiers(Coursier.id).subscribe(resp => {
      console.log('rec', resp)
      console.log("🚀 ~ file: create-recolte.component.ts ~ line 58 ~ CreateRecolteComponent ~ this.financeOpsService.getRecoltesOfCoursiers ~ resp", resp)
      this.montant = resp.montant
      this.listColis = resp.listColisOfCoursier
      this.coursierLoaded = true
      this.nbrColis = this.listColis.length
      this.ctl = this.coursiersSelect.value['coursierSelected'];

    },
      (error) => {
        this.coursierLoaded = false;

      })
  }
  validateReceptionRecolte() {
    const title = 'Valider la récolte';
    const alertMessage = 'voulez vous confirmer la réception de la récolte!'
    const successTitle = 'Validé avec succés'
    const errorTitle ="Validation echouée"
    const action = this.financeOpsService.validateReceptionRecolte(this.ctl.id)
    this.sweetalertService.confirmStandard(title, alertMessage, successTitle, '', null).then(
      (result) => {
        if (result.value) {
          action.toPromise().then(
            (response) => {
            console.log("🚀 ~ file: create-recolte.component.ts ~ line 91 ~ CreateRecolteComponent ~ validateReceptionRecolte ~ response", response)
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
