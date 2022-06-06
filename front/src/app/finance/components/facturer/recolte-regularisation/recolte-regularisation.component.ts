import { Component, OnInit } from '@angular/core';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FacturerService } from '../facturer.service';

@Component({
  selector: 'app-recolte-regularisation',
  templateUrl: './recolte-regularisation.component.html',
  styleUrls: ['./recolte-regularisation.component.scss']
})
export class RecolteRegularisationComponent implements OnInit {

  constructor(
    private facturerService:FacturerService,
    private sweetAlertService:SweetAlertService
  ) { }

  listPmt:any;
  montantTotal:number;
  nbrPmts:number

  ngOnInit(): void {

    this.getPmtRegularisationNonRecolter()
  }

  getPmtRegularisationNonRecolter(){
    this.facturerService.getPmtRegularisationNonRecolter().subscribe(
      (response)=>{
        this.listPmt=response[0];
        this.nbrPmts=response[0].length;
        this.montantTotal= -response[1].montantTotal
      }
    )
  }

  creerRecolteRegularisation() {
    this.facturerService.creerRecolteRegularisation().subscribe((response) => {
      this.openFile(response, 'application/pdf');
      // this.router.navigate(['finance/proceder-paiement']);
    });
  }

  Confirm() {
    const alertTitle = 'Confirmation de création de récolte';
    const alertMessage = 'voulez vous confirmez !';
    this.sweetAlertService
      .confirmStandard(alertTitle, alertMessage, '', '', null)
      .then((result) => {
        if (result.isConfirmed) {
          this.creerRecolteRegularisation();
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
