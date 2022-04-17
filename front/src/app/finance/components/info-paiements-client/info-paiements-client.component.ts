import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { FinanceService } from '../../finance.service';

@Component({
  selector: 'app-info-paiements-client',
  templateUrl: './info-paiements-client.component.html',
  styleUrls: ['./info-paiements-client.component.scss'],
})
export class InfoPaiementsClientComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  nbShipmentDomicile = 0;
  nbShipmentStopDesk = 0;
  totalShipmentLivrer = 0;
  prixVenteShipment = 0;
  totalTarifLivraisonDomicile = 0;
  totalTarifLivraisonStopDesk = 0;
  recolter = 0;
  netPayerClient = 0;
  fraiRetoure = 0;
  totalFraiCOD = 0;
  clientInfo: {} = {};
  route: ActivatedRouteSnapshot;

  constructor(
    private readonly router: Router,
    private readonly _route: ActivatedRoute,
    private readonly financeService: FinanceService
  ) {
    this.route = _route.snapshot;
  }

  ngOnInit(): void {
    this.financeService
      .getSoldeClient(this.route.params.id)
      .subscribe((response) => {
        console.log(
          '🚀 ~ file: info-paiements-client.component.ts ~ line 22 ~ InfoPaiementsClientComponent ~ this.financeService.getSoldeClient ~ response',
          response
        );
        this.nbShipmentDomicile = response['nbShipmentDomicile'];
        this.nbShipmentStopDesk = response['nbShipmentStopDesk'];
        this.totalShipmentLivrer = response['totalShipmentLivrer'];
        this.totalTarifLivraisonDomicile =
          response['totalTarifLivraisonDomicile'];
        this.totalTarifLivraisonStopDesk =
          response['totalTarifLivraisonStopDesk'];
        this.recolter = response['recolter'];
        this.netPayerClient = response['netPayerClient'];
        this.fraiRetoure = response['fraiRetoure'];
        this.totalFraiCOD = response['totalFraiCOD'];
        this.clientInfo = response['clientInfo'];
      });
  }

  payeClient(clientId: any) {
    this.financeService.payerClient(clientId).subscribe((response) => {
      this.openFile(response, 'application/pdf');
      this.router.navigate(['finance/proceder-paiement']);
    });
  }

  cancel() {
    this.router.navigate(['finance/proceder-paiement']);
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
