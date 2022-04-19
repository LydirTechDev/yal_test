import { Component, OnInit } from '@angular/core';
import { IPaginationLinks, IPaginationMeta } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FacturerService } from '../facturer.service';

@Component({
  selector: 'app-list-facture-payer',
  templateUrl: './list-facture-payer.component.html',
  styleUrls: ['./list-facture-payer.component.scss']
})
export class ListFacturePayerComponent implements OnInit {

  factureData: any[];
  metaData: IPaginationMeta;
  metaLinks: IPaginationLinks;
  isLoading: boolean;
  searchFactureTerm: string;
  breadCrumbItems: Array<{}>;

  constructor(
    private factureService:FacturerService,
    private sweetAlertService:SweetAlertService
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
         { label: 'Facture Payées', active: true },
       ];
    }

    searchTermUpdate(searchFactureTerm: string): void {
      this.isLoading = true;
      setTimeout(() => {
        this.factureService.searchFacture(searchFactureTerm,'oui').subscribe(
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
      this.factureService.getAllPaginateFacture('oui').subscribe(
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
        this.factureService.funcPaginate(link, params, this.searchFactureTerm,'oui').subscribe(
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


}
