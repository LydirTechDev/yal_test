import { Component, OnInit } from '@angular/core';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FacturerService } from '../facturer.service';

@Component({
  selector: 'app-recolte-facture',
  templateUrl: './recolte-facture.component.html',
  styleUrls: ['./recolte-facture.component.scss']
})
export class RecolteFactureComponent implements OnInit {

  constructor(
    private facturerService:FacturerService,
    private sweetAlertService:SweetAlertService
  ) { }

  listFacture:any;
  montantTotal:number;
  nbrFacture:number;

  ngOnInit(): void {

    this.getFactureEspeceNonRecolter()
  }

  getFactureEspeceNonRecolter(){
    this.facturerService.getFactureEspeceNonRecolter().subscribe(
      (response)=>{
        this.nbrFacture=response[0].length;
        this.listFacture=response[0];
        this.montantTotal= response[1].montantTotal
      }
    )
  }

  creerRecolteFacture() {
    this.facturerService.creerRecolteFacture().subscribe((response) => {
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
          this.creerRecolteFacture();
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
