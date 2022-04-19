import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PaiementsClientService } from '../paiements-client.service';

@Component({
  selector: 'app-detail-paiement',
  templateUrl: './detail-paiement.component.html',
  styleUrls: ['./detail-paiement.component.scss']
})
export class DetailPaiementComponent implements OnInit {
  
  route: ActivatedRouteSnapshot;
  listShipmentsDetail = []
  constructor(
    _route: ActivatedRoute,
    // private location: Location,
    private router: Router,
    private paiementClient: PaiementsClientService
  ) { 
    this.route = _route.snapshot;
  }

  ngOnInit(): void {
    console.log('eeeeeeeeeeeeeeeeeeeee', this.route.params.id)
    this.paiementClient
      .getPaiementDetails(this.route.params.id)
      .subscribe((resp) => {
        this.listShipmentsDetail = resp
      console.log("🚀 ~ file: detail-paiement.component.ts ~ line 27 ~ DetailPaiementComponent ~ .subscribe ~ resp", resp)
      })
  }

}
