import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import Swal from 'sweetalert2';
import { ServiceClientService } from '../service-client.service';

@Component({
  selector: 'app-create-recolte-cs',
  templateUrl: './create-recolte-cs.component.html',
  styleUrls: ['./create-recolte-cs.component.scss'],
})
export class CreateRecolteCsComponent implements OnInit {
  coursiers: any[] = [];
  nbrColis = 0;
  listColis = [];
  montant = 0;

  constructor(
    private sweetalertService: SweetAlertService,
    private readonly serviceClientService: ServiceClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRecoltesCsInformation();
  }

  getRecoltesCsInformation() {
    this.serviceClientService.getRecoltesCsInformation().subscribe(
      (resp) => {
        console.log('rec', resp);
        console.log(
          '🚀 ~ file: create-recolte.component.ts ~ line 58 ~ CreateRecolteComponent ~ this.serviceClientService.getRecoltesOfCoursiers ~ resp',
          resp
        );
        this.montant = resp.montant;
        this.listColis = resp.listColisCs;
        this.nbrColis = this.listColis.length;
      },
      (error) => {
        console.log(
          '🚀 ~ file: create-recolte-cs.component.ts ~ line 44 ~ CreateRecolteCsComponent ~ getRecoltesCsInformation ~ error',
          error
        );
      }
    );
  }
  createRecolteCs() {
    const title = 'Valider la récolte';
    const alertMessage = 'voulez vous confirmer la réception de la récolte!';
    const successTitle = 'Validé avec succés';
    const errorTitle = 'Validation echouée';
    const action = this.serviceClientService.createRecolteCs();
    this.sweetalertService
      .confirmStandard(title, alertMessage, successTitle, '', null)
      .then((result) => {
        if (result.value) {
          action.toPromise().then(
            (response) => {
              console.log(
                '🚀 ~ CreateRecolteComponent ~ validateReceptionRecolte ~ response',
                response
              );
              this.openFile(response, 'application/pdf');
              this.ngOnInit();
            },
            (error) => Swal.fire(errorTitle, 'Erreur confirmation', 'error')
          );
          return result.value;
        }
      });
  }
  openFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your pop-up blocker and try again!');
    }
  }
}
