import { Component, OnInit } from '@angular/core';
import { FacturerService } from '../facturer.service';

@Component({
  selector: 'app-regularisation',
  templateUrl: './regularisation.component.html',
  styleUrls: ['./regularisation.component.scss']
})
export class RegularisationComponent implements OnInit {

  constructor(
    private facturerService:FacturerService
  ) { }

  listClient:any;

  ngOnInit(): void {

    this.getClientHaveCredit()
  }

  getClientHaveCredit(){
    this.facturerService.getClientHaveCredit().subscribe(
      (response)=>{
        this.listClient=response;
      }
    )
  }

  payeClient(clientId: any) {
    this.facturerService.regulariserClient(clientId).subscribe((response) => {
      this.openFile(response, 'application/pdf');
      // this.router.navigate(['finance/proceder-paiement']);
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
