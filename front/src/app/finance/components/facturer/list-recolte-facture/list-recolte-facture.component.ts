import { Component, OnInit } from '@angular/core';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FacturerService } from '../facturer.service';

@Component({
  selector: 'app-list-recolte-facture',
  templateUrl: './list-recolte-facture.component.html',
  styleUrls: ['./list-recolte-facture.component.scss']
})
export class ListRecolteFactureComponent implements OnInit {

  constructor(
    private facturerService:FacturerService,
    private sweetAlertService:SweetAlertService
  ) { }

  listRecolte:any;
  ngOnInit(): void {
    this.getRecolteFactureByUserId()
  }

  getRecolteFactureByUserId(){
    this.facturerService.getRecolteRegularisationOrfactureByUserId('facture').subscribe(
      (response)=>{
        this.listRecolte=response;
        console.log("🚀 ~ file: list-recolte-facture.component.ts ~ line 26 ~ ListRecolteFactureComponent ~ getRecolteFactureByUserId ~ response", response)
      },
    )
  }

  printRecolte(id:number){
    this.facturerService.printRecolteRegularisationOrFacture(id).subscribe(
      (response)=>{
        this.openFile(response, "application/pdf")
      },
      (error)=>{
        this.sweetAlertService.creationFailure('echec')
      }
    )
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
