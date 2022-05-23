import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPaginationLinks, IPaginationMeta } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FacturerService } from '../facturer.service';

@Component({
  selector: 'app-list-facture-non-payer',
  templateUrl: './list-facture-non-payer.component.html',
  styleUrls: ['./list-facture-non-payer.component.scss']
})
export class ListFactureNonPayerComponent implements OnInit {

  factureData: any[];
  metaData: IPaginationMeta;
  metaLinks: IPaginationLinks;
  isLoading: boolean;
  searchFactureTerm: string;
  breadCrumbItems: Array<{}>;
  cheque=false;
  factureId:number
  nbrColis:number;


  constructor(
    private factureService:FacturerService,
    private sweetAlertService:SweetAlertService,
    private modalService:NgbModal,
    private formBuilder:FormBuilder,
    private router: Router,
  ) {

    this.isLoading = false;
    /**
     * initialis metaData to 0
     * initialis metaLik to 0
     */
    this._facturesErrorAndInitialis();

    /**
     * load and intialise userData from Api
     */
    this.getAllpaginateFacture();
  }
  paiementForm=this.formBuilder.group({
    moyenPayement:[,Validators.required],
    numeroCheque:[]
  })

    ngOnInit(): void {

      this.breadCrumbItems = [
         { label: 'Factures' },
         { label: 'Facture Payées', active: true },
       ];
    }

    searchTermUpdate(searchFactureTerm: string): void {
      this.isLoading = true;
      setTimeout(() => {
        this.factureService.searchFacture(searchFactureTerm,'non','classique').subscribe(
          (response) => {
            this._facturesResponse(response);
          },
          (error) => {
            this._facturesErrorAndInitialis(error);
          }
        );
      }, 330);
    }

    getAllpaginateFacture() {
      this.isLoading = true;
      this.factureService.getAllPaginateFacture('non','classique').subscribe(
        (response) => {
          this._facturesResponse(response);
          console.log("🚀 ~ file: list-facture-non-payer.component.ts ~ line 80 ~ ListFactureNonPayerComponent ~ getAllpaginateFacture ~ response", response)
        },
        (error) => {
          this._facturesErrorAndInitialis(error);
        }
      );
    }

    funcPaginate(link: string, params?: number) {
      this.isLoading = true;
      setTimeout(() => {
        this.factureService.funcPaginate(link, params, this.searchFactureTerm,'non','classique').subscribe(
          (response) => {
            this._facturesResponse(response);
          },
          (error) => {
            this._facturesErrorAndInitialis(error);
          }
        );
      }, 330);
    }

    private _facturesResponse(response: Pagination<any>) {
      this.factureData = response.items;
      this.metaData = response.meta;
      this.metaLinks = response.links;
      this.isLoading = false;
    }

    private _facturesErrorAndInitialis(error?: any) {
      this.factureData = [];
      this.metaData = {
        itemCount: 0,
        totalItems: 0,
        itemsPerPage: 0,
        totalPages: 0,
        currentPage: 0,
      };
      this.metaLinks = {
        first: '',
        previous: '',
        next: '',
        last: '',
      };
      this.isLoading = false;
    }


    openModal(content: any,id) {
      this.modalService.open(content, { backdrop: true, size: 'md',centered:true });
      this.factureId=id;
    }

    changeMoyenPaiement(moyen){
      if(moyen=='cheque'){
        this.cheque=true
        this.paiementForm.get('numeroCheque').setValidators(Validators.required);
        this.paiementForm.get('numeroCheque').updateValueAndValidity()
      }else{
        this.cheque=false
        this.paiementForm.get('numeroCheque').setValidators(null);
        this.paiementForm.get('numeroCheque').updateValueAndValidity()
      }
    }

    payer() {
      this.factureService.payerFacture(this.factureId,this.paiementForm.value).subscribe(
        (response)=>{
          this.sweetAlertService.creationSucces('facture payée avec succès');
          this.router.navigateByUrl(`finance/list-facture-payer`);
         this.modalService.dismissAll();
        },
        (erro)=>{
          this.sweetAlertService.creationFailure('paiement de facture echouée')
        }
      )
    }

    Confirm() {
      const alertTitle = 'Confirmation de paiement';
      const alertMessage = 'voulez vous confirmez votre paiement !';
      this.sweetAlertService
        .confirmStandard(alertTitle, alertMessage, '', '', null)
        .then((result) => {
          if (result.isConfirmed) {
            this.payer();
          }
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



    printFacture(id:number){
      this.factureService.printFactureClassique(id).subscribe(
        (response)=>{
          this.openFile(response, "application/pdf")
        },
        (error)=>{
          this.sweetAlertService.creationFailure('echec')
        }
      )
      }


      showDetail(id: number) {
        this.router.navigateByUrl(`finance/facture/detail-facture-classique/${id}`);
      }


}
