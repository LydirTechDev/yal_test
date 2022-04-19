import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IPaginationLinks,
  IPaginationMeta,
} from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FinanceService } from '../../finance.service';

@Component({
  selector: 'app-list-paiements',
  templateUrl: './list-paiements.component.html',
  styleUrls: ['./list-paiements.component.scss'],
})
export class ListPaiementsComponent implements OnInit {
  pmtsData: any[];
  metaData: IPaginationMeta;
  metaLinks: IPaginationLinks;
  isLoading: boolean;
  searchPmtTerm: string;

  constructor(
    private readonly financeService: FinanceService,
    private readonly sweetalertService: SweetAlertService,
    private router: Router,
  ) {
    this.isLoading = false;
    this._pmtsErrorAndInitialis();
  }

  ngOnInit(): void {
    this.getPaginatedColis();
  }

  getPaginatedColis() {
    this.isLoading = true;
    setTimeout(() => {
      this.financeService.getAllPaginatePmt().subscribe(
        (response) => {
          console.log(
            '🚀 ~ file: list-paiements.component.ts ~ line 32 ~ ListPaiementsComponent ~ setTimeout ~ response',
            response
          );
          this._pmtsResponse(response);
        },
        (error) => {
          this._pmtsErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  print(pmtTraking: string) {
    return this.financeService.printPmt(pmtTraking).subscribe({
      next: (response) => {
        this.openFile(response, 'application/pdf');
      },
      error: (error) => {
        this.sweetalertService.basicWarning(error.message);
      },
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

  funcPaginatePmt(
    link: string,
    page?: number,
    searchPmtTerm?: string
  ): void {
    this.isLoading = true;
    setTimeout(() => {
      this.financeService.funcPaginatePmt(link, page, searchPmtTerm).subscribe(
        (response) => {
          this._pmtsResponse(response);
        },
        (error) => {
          this._pmtsErrorAndInitialis(error);
        }
      );
    }, 330);
  }
  /**
   * search only with string params
   *  - code postal
   *  - nom latin
   *  - nom arabe
   *  - nom Latin Wilaya
   *  - nom Arabe Wilaya
   *  - code Wilaya
   * @param searchColisTerm void
   */
  searchTermUpdatePmt(searchPmtTerm: string): void {
    console.log(
      '🚀 ~ file: list-paiements.component.ts ~ line 96 ~ ListPaiementsComponent ~ searchTermUpdatePmt ~ searchPmtTerm',
      searchPmtTerm
    );
    this.isLoading = true;
    setTimeout(() => {
      this.financeService.searchPmt(searchPmtTerm).subscribe(
        (response) => {
          console.log(
            '🚀 ~ file: list-paiements.component.ts ~ line 104 ~ ListPaiementsComponent ~ setTimeout ~ response',
            response
          );
          this._pmtsResponse(response);
        },
        (error) => {
          this._pmtsErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  private _pmtsResponse(response: Pagination<any>) {
    this.pmtsData = response.items;
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }

  private _pmtsErrorAndInitialis(error?: any) {
    this.pmtsData = [];
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

  detailPmt(tracking) {
    this.router.navigateByUrl(`client/paiement/${tracking}`)
  }
}
