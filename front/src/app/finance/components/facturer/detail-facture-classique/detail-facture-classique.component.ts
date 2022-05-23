import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { FacturerService } from '../facturer.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detail-facture-classique',
  templateUrl: './detail-facture-classique.component.html',
  styleUrls: ['./detail-facture-classique.component.scss'],
})
export class DetailFactureClassiqueComponent implements OnInit {
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
      .getOneFactureClassique(this.route.params.id)
      .subscribe((resp) => {
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
