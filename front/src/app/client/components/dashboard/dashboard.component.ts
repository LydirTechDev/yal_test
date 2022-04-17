import { Component, OnInit } from '@angular/core';
import { ShippmentsClientService } from '../shippments/shippments-client.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statistique = {
    paiement: 0,
    enRoute: 0,
    presExpidie: 0,
    tentativeEchoue: 0,
    Retour: 0,
    colisAretire: 0,
  };

  constructor(private shippmentsClientService: ShippmentsClientService) { }

  ngOnInit(): void {
    this.getStatistiqueClient()
  }
  getStatistiqueClient() {
    return this.shippmentsClientService.getStatistiqueClient().then(resp =>{
      this.statistique = resp
    }
    )
  }

}
