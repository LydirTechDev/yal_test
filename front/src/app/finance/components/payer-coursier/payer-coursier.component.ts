import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FinanceService } from '../../finance.service';

@Component({
  selector: 'app-payer-coursier',
  templateUrl: './payer-coursier.component.html',
  styleUrls: ['./payer-coursier.component.scss']
})
export class PayerCoursierComponent implements OnInit {

  constructor(
    private formBuilder:FormBuilder,
    private financeService:FinanceService,
    private sweetAlertService:SweetAlertService
  ) { }

  coursierData:any;
  coursierSelected:any;
  coursierLoaded: boolean;
  listColis:any;
  montant:number;
  nbrColis:number;
  coursierForm=this.formBuilder.group({
    coursierSelected:[]
  });

  ngOnInit(): void {
    this._getListCoursier()
  }

  private _getListCoursier() {
    this.financeService.getListCoursiersAttachedToMyStation().subscribe(
      (response) => {
      console.log("🚀 ~ file: payer-coursier.component.ts ~ line 29 ~ PayerCoursierComponent ~ _getListCoursier ~ response", response)

        this.coursierData = response;
      },
      (error) => {
        console.log(
          '🚀 ~ file: affecter-au-coursier.component.ts ~ line 51 ~ AffecterAuCoursierComponent ~ _getShipmentsPresLivraison ~ error',
          error
        );
      }
    );
  }

  getColisLivrerByCoursierId(coursier){
    this.financeService.getColisLivrerByCoursierId(coursier.id).subscribe(
      (response)=>{
        this.listColis=response;
        this.nbrColis=response.length;
        this.montant=(response.length) * coursier.montantLivraison;
        this.coursierSelected=this.coursierForm.value['coursierSelected'];
        this.coursierLoaded = true
      }
    )
  }

  changeCoursier() {
    this.nbrColis = 0;
    this.listColis = [];
    this.coursierLoaded = false;
    this.montant = 0;
    this.coursierSelected = {};
    this.coursierForm.reset('coursierSelected');
    this._getListCoursier();
  }

  payer(){
    this.financeService.payerShipmentOfCoursier(this.listColis).subscribe(
      (response)=>{
        this.openFile(response, "application/pdf")
        window.location.reload();
      },
      (error)=>{
        this.sweetAlertService.creationFailure(error);
      }
    )
  }

  Confirm() {
    const alertTitle = "Confirmation de paiement";
    const alertMessage = "voulez vous confirmez le paiement de coursier";
    this.sweetAlertService
      .confirmStandard(
        alertTitle,
        alertMessage,
        '',
        '',
        null
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.payer()
        }
      });
  }




  openFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your pop-up blocker and try again!')
    }
  }
}
