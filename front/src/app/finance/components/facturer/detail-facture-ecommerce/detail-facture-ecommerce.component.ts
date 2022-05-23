import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { FacturerService } from '../facturer.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-detail-facture-ecommerce',
  templateUrl: './detail-facture-ecommerce.component.html',
  styleUrls: ['./detail-facture-ecommerce.component.scss']
})
export class DetailFactureEcommerceComponent implements OnInit {
  constructor(
    private factureService: FacturerService,
    _route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    this.route = _route.snapshot;
  }
  route: ActivatedRouteSnapshot;
  facture: any;
  montantHoreTaxe: number;
  montantTva: number;
  montantTtc: number;
  montantTimbre: number;
  montantTotal: number;
  numFacture:string;

  ngOnInit(): void {
    this.factureService
      .getOneFactureEcommerce(this.route.params.id)
      .subscribe((resp) => {
        console.log("🚀 ~ file: detail-facture-ecommerce.component.ts ~ line 36 ~ DetailFactureEcommerceComponent ~ .subscribe ~ resp", resp)
        this.facture = resp;
        this.montantTva = this.facture[0].facture_montantTva;
        this.montantTtc = this.facture[0].facture_montantTtc;
        this.montantTimbre = this.facture[0].facture_montantTimbre;
        this.montantTotal = this.facture[0].facture_montantTotal;
        this.montantHoreTaxe=this.facture[0].facture_montantHoreTaxe;
        this.numFacture= this.facture[0].facture_numFacture
      });
  }

  goBack(): void {
    this.location.back();
  }
}
