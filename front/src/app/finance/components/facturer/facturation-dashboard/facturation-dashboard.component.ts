import { Component, OnInit } from '@angular/core';
import { FacturerService } from '../facturer.service';

@Component({
  selector: 'app-facturation-dashboard',
  templateUrl: './facturation-dashboard.component.html',
  styleUrls: ['./facturation-dashboard.component.scss'],
})
export class FacturationDashboardComponent implements OnInit {
  constructor(private facturerService: FacturerService) {}

  sommeTotal: number;
  sommeTotalClassique: number;
  sommeTotalClassiquePayer: number;
  sommeTotalClassiqueNonPayer: number;
  sommeTotalEcommerce: number;
  sommeTotalEcommerceZero: number;
  sommeTotalEcommerceZeroPayer: number;
  sommeTotalEcommerceZeroNonPayer: number;
  nombreTotal: number;
  nombreTotalClassique: number;
  nombreTotalClassiquePayer: number;
  nombreTotalClassiqueNonPayer: number;
  nombreTotalEcommerce: number;



  ngOnInit(): void {
    this.facturerService.getStatistique().subscribe((response) => {
      this.sommeTotal=response[0].sommeTotal.sommeTotal;
      this.sommeTotalClassique=response[0].sommeTotalClassique.sommeTotalClassique;
      this.sommeTotalClassiquePayer=response[0].sommeTotalClassiquePayer.sommeTotalClassiquePayer;
      this.sommeTotalClassiqueNonPayer=response[0].sommeTotalClassiqueNonPayer.sommeTotalClassiqueNonPayer;
      this.sommeTotalEcommerce = response[0].sommeTotalEcommerce.sommeTotalEcommerce;
    /** 
      this.sommeTotalEcommerceZero = response[0].sommeTotalEcommerceZero.sommeTotalEcommerceZero;
      this.sommeTotalEcommerceZeroPayer = response[0].sommeTotalEcommerceZeroPayer.sommeTotalEcommerceZeroPayer;
      this.sommeTotalEcommerceZeroNonPayer = response[0].sommeTotalEcommerceZeroNonPayer.sommeTotalEcommerceZeroNonPayer;
      */
      this.nombreTotal=response[0].nombreTotal.nombreTotal;
      this.nombreTotalClassique=response[0].nombreTotalClassique.nombreTotalClassique;
      this.nombreTotalClassiquePayer=response[0].nombreTotalClassiquePayer.nombreTotalClassiquePayer;
      this.nombreTotalClassiqueNonPayer=response[0].nombreTotalClassiqueNonPayer.nombreTotalClassiqueNonPayer;
      this.nombreTotalEcommerce = response[0].nombreTotalEcommerce.nombreTotalEcommerce;

    });
  }
}
