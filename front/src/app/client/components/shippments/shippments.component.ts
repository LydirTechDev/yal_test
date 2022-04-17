import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MDBModalRef,
  MDBModalService,
  MdbTableDirective,
  MdbTablePaginationComponent,
} from 'angular-bootstrap-md';
import { AddOneShippmnetComponent } from './add-one-shippmnet/add-one-shippmnet.component';
import { ShippmentsClientService } from './shippments-client.service';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { Router } from '@angular/router';
import { IPaginationMeta, IPaginationLinks } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
@Component({
  selector: 'app-shippments',
  templateUrl: './shippments.component.html',
  styleUrls: ['./shippments.component.scss'],
})
export class ShippmentsComponent implements OnInit {
  modalRef: MDBModalRef;
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

//

  constructor(

    private shippmentsClientService: ShippmentsClientService,
    private sweetAlertService: SweetAlertService,
    private modalService: MDBModalService,
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
    this._colisErrorAndInitialis();
  }

  ngOnInit() {
    /**
     * Observe add shipmnets
     */
    this.getPaginatedColis()
  }
  getPaginatedColis() {
    this.isLoading = true;
    setTimeout(() => {
      this.shippmentsClientService.getPaginatedShipmentsEnpreparation().subscribe(
        (response) => {
          this._colisResponse(response);
        },
        (error) => {
          this._colisErrorAndInitialis(error);
        }
      );
    }, 330);
  }
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
      this.shippmentsClientService.funcPaginateColisOfUserEnprepartion(link, page).subscribe(
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

  searchTermUpdateColis(searchColis: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.shippmentsClientService.searchColisOfUserEnPreparation(searchColis).subscribe(
        (response) => {
          this._colisResponse(response);
        },
        (error) => {
          this._colisErrorAndInitialis(error);
        }
      );
    }, 330);
  }



  //


  openAddOneShipmentModal() {
    this.modalRef = this.modalService.show(AddOneShippmnetComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: true,
      ignoreBackdropClick: true,
      class: 'modal-lg modal-dialog modal-dialog-top',
      containerClass: 'right',
      animated: true,
      scroll: true,
    });
  }




  // validateOneShipment(shipment: number) {
  //   var shipmentslist: number[] = [];
  //   shipmentslist.push(shipment);
  //   this.shippmentsClientService.setShipmentsOnPreExpedier(shipmentslist)
  //     .subscribe(
  //       (response) => {
  //       FileSaver.saveAs(response, "Bordereau.pdf");
  //     });
  //   const index = this.colisData.findIndex(item => item.id === shipment);
  //   // console.log(index, shipment)
  //   if (index > -1) {
  //     // console.log('index ele', index)
  //     this.colisData.splice(index, 1);
  //     // console.log('this.elemeeeent', this.colisData)
  //   }
  // }

  validateShipment(shipmentId: number) {
    var shipmentsList: number[] = [];
    shipmentsList.push(shipmentId);
    this.shippmentsClientService.setShipmentsOnPreExpedier(shipmentsList)
    .subscribe({
      next: response => {
        this.openFile(response, "application/pdf")
        this.colisData = []
        this.getPaginatedColis()
      },
      error: (error) =>
        console.log("🚀 ~ file: shippments-client.service.ts ~ line 49 ~ ShippmentsClientService ~ returnthis.http.post ~ error", error)
    });
  }

  validateAllShipment() {
    // console.log(this.colisData)
    const ids: number[] = [];
    for (const el of this.colisData) {
      // console.log("🚀 ~ file: shippments.component.ts ~ line 142 ~ ShippmentsComponent ~ validateAllShipment ~ el", el)
      ids.push(el.id);
    }
    // console.log(ids)
    this.shippmentsClientService.setShipmentsOnPreExpedier(ids);
    // .subscribe(response => {
    //   FileSaver.saveAs(response, "Bordereaux.zip");
    //   this.colisData = [];
    // });
  }

  showDetailShipment(shipmentId: number) {
    // this.shippmentsClientService.observAddShipments.next(index);
    this.router.navigateByUrl(`client/colis/${shipmentId}`);
  }

  async deleteShipment( shipment: any) {
    return await this.sweetAlertService.confirm(
      `Confirmer la suppression du produit ${shipment.designationProduit}`,
      `destiner pour ${shipment.prenom} - ${shipment.nom}`,
      `${shipment.designationProduit}`,
      'Supprimer avec succser',
      this.shippmentsClientService.deleteshipment(shipment.id)
    );
    //     ).then(
    //       () => {
    //         this.shippmentsClientService.observAddShipments.next(+1)
    //       }
    //     )
    // }
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
