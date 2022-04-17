import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { IPaginationMeta, IPaginationLinks } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { IZone } from './i-zone';
import { ZoneService } from './zone.service';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss'],
})
export class ZoneComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  /**
   * zone data for table
   * all zone o unique wilaya by search or display by paginate
   */
  zoneData: IZone[];

  /**
   * include page
   * -itemConts nb item selected in zoneData
   * -totalItem total item selected in zoneData
   * -itemPerPage nb item selected per page in zoneData
   * -totapPage nb page generated selected in zoneData
   * -currentPage current Page selected in zoneData
   */
  metaData: IPaginationMeta;

  /**
   * -first pre-generated url to first list in zoneData
   * -last pre-generated url to laste list in zoneData
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
  searchZoneTerm: string;

  /**
   * enabel sipnner
   */
  btnSpinner: boolean = false;

  /**
   *
   * @param modalService
   * @param zoneService
   */
  constructor(
    public modalService: NgbModal, private zoneService: ZoneService) {
    /**
     * init isLoading to false
     */
    this.isLoading = false;

    /**
     * init mataData to 0
     * init metaLinks to 0
     */
    this._zoneErrorAndInitialis();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Parametre logindtiques' },
      { label: 'liste zones', active: true },
    ];

    /**
     * load and init zoneData from Api
     */
    this.getPaginatedCommune();
  }

  /**
   * load all zone
   */
  getPaginatedCommune(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.zoneService.getPaginateZones().subscribe(
        (response) => {
          this._zonesResponse(response);
        },
        (error) => {
          this._zoneErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  /**
   * search only with string params
   * @param searchCommuneTerm void
   */
  searchTermUpdate(searchCommuneTerm: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.zoneService.searchZones(searchCommuneTerm).subscribe(
        (response) => {
          this._zonesResponse(response);
        },
        (error) => {
          this._zoneErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  /**
   * used for paginate
   * @param link string
   * @param page number
   */
  funcPaginate(link: string, page?: number): void {
    this.isLoading = true;
    setTimeout(() => {
      this.zoneService.funcPaginate(link, page, this.searchZoneTerm).subscribe(
        (response) => {
          this._zonesResponse(response);
        },
        (error) => {
          this._zoneErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  /**
   * Modal Open
   * @param content modal content
   */
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  /**
   * load zoneData from response
   * load metaDAta from response
   * load metaLinks from response
   * after loading turn isloading tu false
   * @param response
   */
  private _zonesResponse(response: Pagination<IZone>) {
    console.log("🚀 ~ file: zone.component.ts ~ line 157 ~ ZoneComponent ~ _zonesResponse ~ response", response)
    this.zoneData = response.items;
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }

  /**
   * display error
   * initialis
   *  -communeData to []
   *  -metaData to 0
   *  -metaLinks to ''
   * @param error
   */
  private _zoneErrorAndInitialis(error?: any) {
    this.zoneData = [];
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
