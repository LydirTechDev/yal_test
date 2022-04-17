import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { IPaginationMeta, IPaginationLinks } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FinanceService } from '../../finance.service';

@Component({
  selector: 'app-list-paiement-coursier',
  templateUrl: './list-paiement-coursier.component.html',
  styleUrls: ['./list-paiement-coursier.component.scss']
})
export class ListPaiementCoursierComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  pmtcData: any[];
  metaData: IPaginationMeta;
  metaLinks: IPaginationLinks;
  isLoading: boolean;
  pmtc: any;
  searchPmtcTerm: string;

  constructor(
    private readonly financeService: FinanceService,
    private sweetAlertService: SweetAlertService,
  ) {
    this.isLoading = false;
    /**
     * initialis metaData to 0
     * initialis metaLik to 0
     */
    this._pmtcErrorAndInitialis();

    /**
     * load and intialise pmtcData from Api
     */
    this.getAllPaginatePmtc();
  }


  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Payer coursier' },
      { label: 'Liste des Paiments', active: true },
    ];
    this.getAllPaginatePmtc();
  }

  searchTermUpdate(searchPmtcTerm: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.financeService.searchPmtc(searchPmtcTerm).subscribe(
        (response) => {
          this._pmtcResponse(response);
        },
        (error) => {
          this._pmtcErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  getAllPaginatePmtc() {
    this.isLoading = true;
    this.financeService.getPaginatePmtc().subscribe(
      (response) => {
      console.log("🚀 ~ getAllPaginatePmtc ~ response", response)
        if (response) {
          this._pmtcResponse(response);
        } else {
          this._pmtcResponse(null)
        }
      },
      (error) => {
        this._pmtcErrorAndInitialis(error);
      }
    );
  }


  funcPaginate(link: string, params?: number) {
    this.isLoading = true;
    setTimeout(() => {
      this.financeService.funcPaginate(link, params, this.searchPmtcTerm).subscribe(
        (response) => {
          this._pmtcResponse(response);
        },
        (error) => {
          console.log("🚀 ~ file: list-pmtc.component.ts ~ line 94 ~ ListPmtcComponent ~ setTimeout ~ error", error)
          this._pmtcErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  private _pmtcResponse(response: Pagination<any>) {
    this.pmtcData = response.items;
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }

  private _pmtcErrorAndInitialis(error?: any) {
    this.pmtcData = [];
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

  printPmtc(id: number) {
    return this.financeService.printPmtc(id).subscribe(
      (response) => {
        this.openFile(response, 'application/pdf');
      },
      () => { this.sweetAlertService.basicWarning('ce pmt ne contient pas de colis') }
    );
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
