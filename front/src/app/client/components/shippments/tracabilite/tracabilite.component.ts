import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPaginationMeta, IPaginationLinks } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShippmentsClientService } from '../shippments-client.service';

@Component({
  selector: 'app-tracabilite',
  templateUrl: './tracabilite.component.html',
  styleUrls: ['./tracabilite.component.scss']
})
export class TracabiliteComponent implements OnInit {
  colisData: any[];
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
   * -first pre-generated url to first list in colisData
   * -last pre-generated url to laste list in colisData
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
  searchColisTerm: string;

  /**
   * enabel sipnner
   */
  btnSpinner: boolean = false;

  constructor(
    private router: Router,
    public sweetalertService: SweetAlertService,
    private shipmentsClientService: ShippmentsClientService) {  
  /**
    * init isLoading to false
  */
    this.isLoading = false;

    /**
     * init mataData to 0
     * init metaLinks to 0
     */
    this._colisErrorAndInitialis();
  }

  ngOnInit(): void {
    this.getPaginatedColis()
  }
  /**
 * load all colis interne
 */
  getPaginatedColis() {
    this.isLoading = true;
    setTimeout(() => {
      this.shipmentsClientService.getPaginateColisTracabilite().subscribe(
        (response) => {
          this._colisResponse(response);
        },
        (error) => {
          this._colisErrorAndInitialis(error);
        }
      );
    }, 330);
  }
  /**
   * display error
   * initialis
   *  -colisData to []
   *  -metaData to 0
   *  -metaLinks to ''
   * @param error
   */
  private _colisErrorAndInitialis(error?: any) {
    this.colisData = [];
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
 * load coliseData from response
 * load metaDAta from response
 * load metaLinks from response
 * after loading turn isloading tu false
 * @param response
 */
  private _colisResponse(response: Pagination<any>) {
    console.log("🚀 ~ _colisResponse ~ response", response)
    this.colisData = response.items;
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }
  funcPaginateColis(link: string, page?: number): void {
    this.isLoading = true;
    setTimeout(() => {
      this.shipmentsClientService.funcPaginateColisOfUser(link, page).subscribe(
        (response) => {
        console.log("🚀 ~ file: tracabilite.component.ts ~ line 126 ~ TracabiliteComponent ~ setTimeout ~ response", response)
          this._colisResponse(response);
        },
        (error) => {
          this._colisErrorAndInitialis(error);
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
  searchTermUpdateColis(searchColis: string): void {
    this.colisData =[]
    this.isLoading = true;
    setTimeout(() => {
      this.shipmentsClientService.searchColisOfUser(searchColis).subscribe(
        (response) => {
          this._colisResponse(response);
        },
        (error) => {
          this._colisErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  print(id: number) {
    return this.shipmentsClientService.printBordereau(id).subscribe({
      next: (response) => {
        this.openFile(response, 'application/pdf');
      },
      error: (error) => { this.sweetalertService.basicWarning(error.message) }
    });
  }
  detailColis(tracking: string){
    this.redirectTo(`recherche/${tracking}`)
  }
  openFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your pop-up blocker and try again!')
    }
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }
}
