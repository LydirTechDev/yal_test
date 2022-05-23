import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPaginationLinks, IPaginationMeta } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FacturerService } from '../facturer.service';

@Component({
  selector: 'app-list-facture-ecommerce',
  templateUrl: './list-facture-ecommerce.component.html',
  styleUrls: ['./list-facture-ecommerce.component.scss']
})
export class ListFactureEcommerceComponent implements OnInit {

  factureData: any[];
  metaData: IPaginationMeta;
  metaLinks: IPaginationLinks;
  isLoading: boolean;
  searchFactureTerm: string;
  breadCrumbItems: Array<{}>;
  factureId:number;
  espece = {
    true: { text: 'Oui' },
    false: { text: 'Non' },
  };


  constructor(
    private factureService:FacturerService,
    private sweetAlertService:SweetAlertService,
    private router: Router,
    private modalService:NgbModal
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

    ngOnInit(): void {

      this.breadCrumbItems = [
         { label: 'Factures' },
         { label: 'Factures e-coomerce', active: true },
       ];
    }

    searchTermUpdate(searchFactureTerm: string): void {
      this.isLoading = true;
      setTimeout(() => {
        this.factureService.searchFacture(searchFactureTerm,'oui','ecommerce').subscribe(
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
      this.factureService.getAllPaginateFacture('oui','ecommerce').subscribe(
        (response) => {
          this._facturesResponse(response);
        },
        (error) => {
          this._facturesErrorAndInitialis(error);
        }
      );
    }

    funcPaginate(link: string, params?: number) {
      this.isLoading = true;
      setTimeout(() => {
        this.factureService.funcPaginate(link, params, this.searchFactureTerm,'oui','ecommerce').subscribe(
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


    openFile(data: any, type: string) {
      let blob = new Blob([data], { type: type });
      let url = window.URL.createObjectURL(blob);
      let pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert('Please disable your pop-up blocker and try again!');
      }
    }
    printFactureDetail(){
      this.factureService.printFactureEcommerceDetail(this.factureId).subscribe(
        (response)=>{
          this.openFile(response, "application/pdf");
          this.modalService.dismissAll();
        },
        (error)=>{
          this.sweetAlertService.creationFailure('echec')
        }
      )
      }

      printFactureSimplifier(){
        this.factureService.printFactureEcommerceSimplifier(this.factureId).subscribe(
          (response)=>{
            this.openFile(response, "application/pdf");
            this.modalService.dismissAll();
          },
          (error)=>{
            this.sweetAlertService.creationFailure('echec')
          }
        )
        }

      openModal(content: any,id:number) {
        this.modalService.open(content, { backdrop: true, size: 'md',centered:true });
        this.factureId=id;
      }

    showDetail(id: number) {
      this.router.navigateByUrl(`finance/facture/detail-facture-ecommerce/${id}`);
    }


}
