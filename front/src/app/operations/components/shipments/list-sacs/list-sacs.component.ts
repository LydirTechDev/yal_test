import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPaginationMeta, IPaginationLinks } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../shipments-ops.service';

@Component({
  selector: 'app-list-sacs',
  templateUrl: './list-sacs.component.html',
  styleUrls: ['./list-sacs.component.scss']
})
export class ListSacsComponent implements OnInit {

  constructor(
    private shipmentOpsService: ShipmentsOpsService,
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
    this._sacsErrorAndInitialis();
  }
  breadCrumbItems: Array<{}>;
  data = [];
  isLoading: boolean;
  metaData: IPaginationMeta;
  metaLinks: IPaginationLinks;
  searchSacTerm: string;
  sacData: any[];
  btnSpinner: boolean = false;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Opérations' },
      { label: 'Liste des sacs', active: true },
    ];
    this.getPaginationSacs();
  }

  getPaginationSacs() {
    this.isLoading = true;
    this.shipmentOpsService.getPaginateSacs().subscribe(
      (response) => {
      console.log("🚀 ~ file: list-sacs.component.ts ~ line 51 ~ ListSacsComponent ~ getPaginationSacs ~ response", response)
        this._sacsResponse(response);
      },
      (error) => {
        this._sacsErrorAndInitialis(error);
        this.sweetAlertService.sipmleAlertConfirme(
          'warning',
          'cannot load sacs',
          error.message,
          true
        );
      }
    );
  }

  searchTermUpdate(searchSacTerm: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.shipmentOpsService.searchSacs(searchSacTerm).subscribe(
        (response) => {
          this._sacsResponse(response);
        },
        (error) => {
          this._sacsErrorAndInitialis(error);
        }
      );
    }, 330)
  }

  funcPaginate(link: string, page?: number): void {
    this.isLoading = true;
    setTimeout(() => {
      this.shipmentOpsService.funcPaginateSac(link, page, this.searchSacTerm).subscribe(
        (response) => {
          this._sacsResponse(response);
        },
        (error) => {
          this._sacsErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  private _sacsResponse(response: Pagination<any>) {
    this.sacData = response.items;
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }

  private _sacsErrorAndInitialis(error?: any) {
    this.sacData = [];
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

  // exportSacs(termToSearch: string) {
  //   if (!termToSearch) {
  //     termToSearch = '';
  //   }
  //   this.shipmentOpsService.ExportSacToExcel(termToSearch).subscribe(
  //     (response) => {
  //       FileSaver.saveAs(response, "liste des colis.xlsx");
  //     }
  //   )
  // }
  print(id: number) {
    return this.shipmentOpsService.printManifestSac(id).subscribe({
      next: (response) => {
        this.openFile(response, 'application/pdf');
      },
      error: (error) => { this.sweetAlertService.basicWarning(error.message) }
    });
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
