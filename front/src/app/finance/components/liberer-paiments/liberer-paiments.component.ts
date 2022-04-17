import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import Swal from 'sweetalert2';
import { FinanceService } from '../../finance.service';

@Component({
  selector: 'app-liberer-paiments',
  templateUrl: './liberer-paiments.component.html',
  styleUrls: ['./liberer-paiments.component.scss']
})
export class LibererPaimentsComponent implements OnInit {
  listClients = [];
  listDateRecolte = [];
  listRecolte = [];
  nbrColis = 0;
  totalRamasse = 0;
  gain = 0;
  netClient = 0;

  formData: FormGroup;

  constructor(
    private financeService: FinanceService,
    public sweetalertService: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.getInformationsPaiementToLiberer();
    this.formData = new FormGroup({
      client:  new FormControl(),
      recolte:  new FormControl(),
      dateRecolte:  new FormControl(),
    }) 

  }
  
getInformationsPaiementToLiberer() {
  this.financeService.getInformationsPaiementToLiberer().subscribe(resp => {
    this.gain = resp['gain'],
    this.totalRamasse = resp['totalRamasse']
    this.netClient = resp['netClient']
    this.nbrColis = resp['nbrColis']
    this.listClients = resp['listClients']
    this.listDateRecolte = resp['listDateRecolte']
    this.listRecolte = resp['listRecolte']
  })
}

libererParDateRecolte() {
  const dateRec = this.formData.value['dateRecolte']
  if (dateRec == null) {
    this.sweetalertService.basicWarning('Oops! Selectionner une date')
  } else {
    const title = 'Libérer les paiements';
    const alertMessage = 'voulez vous confirmer la libération pour toutes les récoltes de cette date!'
    const successTitle = 'Validé avec succés'
    const errorTitle = "Validation echouée"
     const action = this.financeService.libererParDateRecolte(dateRec);
    this.sweetalertService.confirmStandard(title, alertMessage, successTitle, '', null).then(
      (result) => {
        if (result.value) {
          action.toPromise().then(
            () => {
              Swal.fire(successTitle, '', 'success')
              this.formData.reset();
              this.getInformationsPaiementToLiberer()
            },
            (error) => Swal.fire(errorTitle, 'Erreur confirmation', 'error')
          )
          return result.value
        }
      });
  }
}
libererParIdRecolte() {
  const tracking = this.formData.value['recolte']
  if (tracking == null ) {
    this.sweetalertService.basicWarning('Oops! Selectionner une récolte')
  }else {
    const express_reg = new RegExp(/^rec-\d{3}\w{3}$/, 'i')
    if (!express_reg.test(tracking)) {
      const title = 'Libérer les paiements';
      const alertMessage = 'voulez vous confirmer la libération pour cette récolte !'
      const successTitle = 'Validé avec succés'
      const errorTitle = "Validation echouée"
      const action = this.financeService.libererParIdRecolte(tracking);
      this.sweetalertService.confirmStandard(title, alertMessage, successTitle, '', null).then(
        (result) => {
          if (result.value) {
            action.toPromise().then(
              () => {
                Swal.fire(successTitle, '', 'success')
                this.formData.reset();
                this.getInformationsPaiementToLiberer()
              },
              (error) => Swal.fire(errorTitle, 'Erreur confirmation', 'error')
            )
            return result.value
          }
        });
  }
  }
}
libererParClient(){
  const clientId = this.formData.value['client']
  if (clientId == null) {
    this.sweetalertService.basicWarning('Oops! Selectionner une récolte')
  } else {
    const title = 'Libérer les paiements';
    const alertMessage = 'voulez vous confirmer la libération pour ce client !'
    const successTitle = 'Validé avec succés'
    const errorTitle = "Validation echouée"
    const action = this.financeService.libererParClient(clientId);
    this.sweetalertService.confirmStandard(title, alertMessage, successTitle, '', null).then(
      (result) => {
        if (result.value) {
          action.toPromise().then(
            () => {
              Swal.fire(successTitle, '', 'success')
              this.formData.reset();
              this.getInformationsPaiementToLiberer()
            },
            (error) => Swal.fire(errorTitle, 'Erreur confirmation', 'error')
          )
          return result.value
        }
      });
  }
}
}

