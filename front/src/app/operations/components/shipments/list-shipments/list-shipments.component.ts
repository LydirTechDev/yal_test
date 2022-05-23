import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPaginationLinks, IPaginationMeta } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../shipments-ops.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-list-shipments',
  templateUrl: './list-shipments.component.html',
  styleUrls: ['./list-shipments.component.scss']
})
export class ListShipmentsComponent implements OnInit {

  constructor(
    private shipmentOpsService:ShipmentsOpsService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {

     /**
     * init isLoading to false
     */
      this.isLoading = false;

      /**
       * init mataData to 0
       * init metaLinks to 0
       */
      this._shipmentsErrorAndInitialis();
  }

  breadCrumbItems: Array<{}>;
  data = [];
  isLoading: boolean;
  metaData: IPaginationMeta;
  metaLinks: IPaginationLinks;
  searchShipmentTerm: string;
  shipmentData: any[];
  btnSpinner: boolean = false;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Opérations' },
      { label: 'Liste des colis', active: true },
    ];
    this.getPaginationShipments();
  }

  getPaginationShipments() {
    this.isLoading=true;
      this.shipmentOpsService.getPaginateShipments().subscribe(
        (response)=>{
          this._shipmentsResponse(response);
        },
        (error)=>{
          this._shipmentsErrorAndInitialis(error);
          this.sweetAlertService.sipmleAlertConfirme(
            'warning',
            'cannot load shipments',
            error.message,
            true
          );
        }
      );
  }

  searchTermUpdate(searchShipmentTerm: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.shipmentOpsService.searchShipments(searchShipmentTerm).subscribe(
        (response) => {
          this._shipmentsResponse(response);
        },
        (error) => {
          this._shipmentsErrorAndInitialis(error);
        }
      );
    },330)
  }

  funcPaginate(link: string, page?: number): void {
    this.isLoading = true;
    setTimeout(() => {
      this.shipmentOpsService.funcPaginate(link, page,this.searchShipmentTerm).subscribe(
        (response) => {
          this._shipmentsResponse(response);
        },
        (error) => {
          this._shipmentsErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  private _shipmentsResponse(response: Pagination<any>) {
    this.shipmentData = response.items;
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }

  private _shipmentsErrorAndInitialis(error?: any) {
    this.shipmentData = [];
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

  exportShipments(termToSearch:string) {
    if (!termToSearch) {
      termToSearch ='';
    }
    this.shipmentOpsService.ExportToExcel(termToSearch).subscribe(
      (response)=>{
        FileSaver.saveAs(response, "liste des colis.xlsx");
      }
    )
  }
  print(id: number) {
    return this.shipmentOpsService.printBordereau(id).subscribe({
      next: (response) => {
        this.openFile(response, 'application/pdf');
      },
      error: (error) => { this.sweetAlertService.basicWarning(error.message) }
    });
  }
  detailColis(tracking: string) {
    this.redirectTo(`recherche/${tracking}`)
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
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
