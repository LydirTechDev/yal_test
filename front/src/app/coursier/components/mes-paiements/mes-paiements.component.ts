import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPaginationMeta, IPaginationLinks } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { CoursierService } from '../../coursier.service';

@Component({
  selector: 'app-mes-paiements',
  templateUrl: './mes-paiements.component.html',
  styleUrls: ['./mes-paiements.component.scss']
})
export class MesPaiementsComponent implements OnInit {
  pmtsData: any[];
  metaData: IPaginationMeta;
  metaLinks: IPaginationLinks;
  isLoading: boolean;
  searchPmtTerm: string;

  constructor(
    private readonly coursierService: CoursierService,
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
      this.coursierService.getAllPaginatePmt().subscribe(
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
      this.coursierService.funcPaginatePmt(link, page, searchPmtTerm).subscribe(
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
      this.coursierService.searchPmt(searchPmtTerm).subscribe(
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
    console.log("🚀 ~ file: mes-paiements.component.ts ~ line 137 ~ MesPaiementsComponent ~ detailPmt ~ tracking", tracking)
    this.router.navigateByUrl(`coursier/detail-list-paiement/${tracking}`)
  }
}
