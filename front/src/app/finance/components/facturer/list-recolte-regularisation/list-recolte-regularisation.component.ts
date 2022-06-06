import { Component, OnInit } from '@angular/core';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FacturerService } from '../facturer.service';

@Component({
  selector: 'app-list-recolte-regularisation',
  templateUrl: './list-recolte-regularisation.component.html',
  styleUrls: ['./list-recolte-regularisation.component.scss']
})
export class ListRecolteRegularisationComponent implements OnInit {

  constructor(
    private facturerService:FacturerService,
    private sweetAlertService:SweetAlertService
  ) { }

  listRecolte:any;
  ngOnInit(): void {
    this.getRecolteRegularisationByUserId()
  }

  getRecolteRegularisationByUserId(){
    this.facturerService.getRecolteRegularisationOrfactureByUserId('régularisation').subscribe(
      (response)=>{
        this.listRecolte=response;
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
