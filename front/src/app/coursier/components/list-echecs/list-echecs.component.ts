import { Component, OnInit } from '@angular/core';
import { ShippmentsClientService } from 'src/app/client/components/shippments/shippments-client.service';
import { IPaginationMeta, IPaginationLinks } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { CoursierService } from '../../coursier.service';

@Component({
  selector: 'app-list-echecs',
  templateUrl: './list-echecs.component.html',
  styleUrls: ['./list-echecs.component.scss']
})
export class ListEchecsComponent implements OnInit {
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
    public sweetalertService: SweetAlertService,
    private shipmentsCoursierService: CoursierService
  ) { /**
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
 * load all colis
 */
  getPaginatedColis() {
    this.isLoading = true;
    setTimeout(() => {
      this.shipmentsCoursierService.getPaginateColisCoursierEchecs().subscribe(
        (response) => {
        console.log("🚀 ~ file: list-echecs.component.ts ~ line 75 ~ ListEchecsComponent ~ setTimeout ~ response", response)
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
      this.shipmentsCoursierService.funcPaginateColisCoursierEchecs(link, page).subscribe(
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
    this.isLoading = true;
    setTimeout(() => {
      this.shipmentsCoursierService.searchColisCoursierEchecs(searchColis).subscribe(
        (response) => {
          this._colisResponse(response);
        },
        (error) => {
          this._colisErrorAndInitialis(error);
        }
      );
    }, 330);
  }

}
