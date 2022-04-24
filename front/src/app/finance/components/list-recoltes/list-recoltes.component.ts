import { Component, OnInit } from '@angular/core';
import {
  IPaginationMeta,
  IPaginationLinks,
} from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FinanceService } from '../../finance.service';

@Component({
  selector: 'app-list-recoltes',
  templateUrl: './list-recoltes.component.html',
  styleUrls: ['./list-recoltes.component.scss'],
})
export class ListRecoltesComponent implements OnInit {
  status = {
    recue: { text: 'Reçue', color: 'success' },
    nonRecue: { text: 'Non reçue', color: 'danger' },
  };
  recolteData: any[];
  /**
   * include page
   * -itemConts nb item selected in wilayaData
   * -totalItem total item selected in wilayaData
   * -itemPerPage nb item selected per page in wilayaData
   * -totapPage nb page generated selected in wilayaData
   * -currentPage current Page selected in wilayaData
   */
  metaData: IPaginationMeta;

  /**
   * -first pre-generated url to first list inrecolteData
   * -last pre-generated url to laste list inrecolteData
   * -previous pre-generated url to previous list from currentPage
   * -next pre-generated url to next list from currentPage
   */
  metaLinks: IPaginationLinks;

  /**
   * turn to true if wilayaData is loading
   * else to to false
   */
  isLoading: boolean;

  /**
   * save value of input shearch
   */
  searchRecolteTerm: string;

  /**
   * enabel sipnner
   */
  btnSpinner: boolean = false;
  constructor(
    private financeService: FinanceService,
    public sweetalertService: SweetAlertService
  ) {
    /**
     * init isLoading to false
     */
    this.isLoading = false;

    /**
     * init mataData to 0
     * init metaLinks to 0
     */

    this._recoltesErrorAndInitialis();
  }

  ngOnInit(): void {
    this.getPaginatedRecolte();
  }
  /**
   * load all recolte interne
   */
  getPaginatedRecolte() {
    this.isLoading = true;
    setTimeout(() => {
      this.financeService.getPaginateAllRecolte().subscribe(
        (response) => {
          console.log(
            '🚀 ~ file: list-recoltes.component.ts ~ line 80 ~ ListRecoltesComponent ~ setTimeout ~ response',
            response
          );
          this._recoltesResponse(response);
        },
        (error) => {
          this._recoltesErrorAndInitialis(error);
        }
      );
    }, 330);
  }
  /**
   * display error
   * initialis
   *  -recolteData to []
   *  -metaData to 0
   *  -metaLinks to ''
   * @param error
   */
  private _recoltesErrorAndInitialis(error?: any) {
    this.recolteData = [];
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
  /**
   * loadrecolteeData from response
   * load metaDAta from response
   * load metaLinks from response
   * after loading turn isloading tu false
   * @param response
   */
  private _recoltesResponse(response: Pagination<any>) {
    console.log('🚀 ~ _recoltesResponse ~ response', response);
    this.recolteData = response.items;

    response.items.forEach((recolte) => {
      console.log(
        '🚀 ~ file: list-recoltes.component.ts ~ line 131 ~ ListRecoltesComponent ~ response.items.forEach ~ element',
        recolte
      );
      if (recolte.shipment == 0) {
        recolte.shipment = recolte.shipmentCs;
      }
    });
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }
  funcPaginateRecolte(link: string, page?: number): void {
    this.isLoading = true;
    setTimeout(() => {
      this.financeService.funcPaginateAllRecolte(link, page).subscribe(
        (response) => {
          this._recoltesResponse(response);
        },
        (error) => {
          this._recoltesErrorAndInitialis(error);
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
   * @param searchRecolteTerm void
   */
  searchTermUpdateRecolte(searchRecolte: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.financeService.searchRecolte(searchRecolte).subscribe(
        (response) => {
          this._recoltesResponse(response);
        },
        (error) => {
          this._recoltesErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  print(id: number, typeRtc: string) {
    return this.financeService.printRecolte(id, typeRtc).subscribe({
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
  calculateDiff(dateSent) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    const res = Math.floor(
      (Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ) -
        Date.UTC(
          dateSent.getFullYear(),
          dateSent.getMonth(),
          dateSent.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );
    console.log(
      '🚀 ~ file: list-recoltes.component.ts ~ line 186 ~ ListRecoltesComponent ~ calculateDiff ~ res',
      res
    );
    return res;
  }
}
