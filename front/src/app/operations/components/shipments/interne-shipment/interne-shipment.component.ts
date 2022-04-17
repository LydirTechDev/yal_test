import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPaginationLinks, IPaginationMeta } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ShipmentsOpsService } from '../shipments-ops.service';

@Component({
  selector: 'app-interne-shipment',
  templateUrl: './interne-shipment.component.html',
  styleUrls: ['./interne-shipment.component.scss']
})
export class InterneShipmentComponent implements OnInit {
  colisData: any[];
  // IInterneColis
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
  shippmentForm: FormGroup;
  wilayasData: any;
  communesData: any;
  agencesData: any;
  usersData: any

  constructor(    
    private router: Router,
    public formBuilder: FormBuilder,
    public sweetalertService: SweetAlertService,
    private modalService: NgbModal,
   private shipmentsOpsService: ShipmentsOpsService) { 
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
    this.getPaginatedColis();
    this.shipmentsOpsService.findAllWilaya().then(
      (data) => {
        this.wilayasData = data;
      })
    this.shippmentForm = this.formBuilder.group({
      wilayaId: [, Validators.compose([Validators.required])],
      communeId: [, Validators.compose([Validators.required])],
      agenceId: [, Validators.compose([Validators.required])],
      userId: [, Validators.compose([Validators.required])],
      designation: ['', Validators.compose([Validators.required, Validators.minLength(3),
      Validators.maxLength(50)])],
    });

  }
  /**
 * function to open modal
 * @param content
 */
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg' ,centered: true, backdrop: true });
  }
  /**
* function to close modal
* @param content
*/
closeModal() {
  this.modalService.dismissAll()
  this.shippmentForm.reset();
}
  /**
   * load all colis interne
   */
  getPaginatedColis() {
    this.isLoading = true;
    setTimeout(() => {
      this.shipmentsOpsService.getPaginateColis().subscribe(
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
   * load coliseData from response
   * load metaDAta from response
   * load metaLinks from response
   * after loading turn isloading tu false
   * @param response
   */
  private _colisResponse(response: Pagination<any>) {
    this.colisData = response.items;
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }
  /**
 * used for paginate
 * @param link string
 * @param page number
 */
  funcPaginateColisInterne(link: string, page?: number): void {
    this.isLoading = true;
    setTimeout(() => {
      this.shipmentsOpsService.funcPaginateColisInterneOfUser(link, page).subscribe(
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
   * search only with string params
   *  - code postal
   *  - nom latin
   *  - nom arabe
   *  - nom Latin Wilaya
   *  - nom Arabe Wilaya
   *  - code Wilaya
   * @param searchColisTerm void
   */
  searchTermUpdateColisInterne(searchColisInterne: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.shipmentsOpsService.searchColisInterneOfUser(searchColisInterne).subscribe(
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
  onChangeWilaya() {
    this.shippmentForm.controls['communeId'].reset()
    this.shipmentsOpsService.findCommunByWilayaTypeLivraison(
      this.shippmentForm.controls['wilayaId'].value, 1)
      .then(
        (data) => {
          this.communesData = data;
        }
      )
  }
  onChangeCommune() {
    this.shippmentForm.controls['agenceId'].reset()
    this.shipmentsOpsService.findAgencesByCommune(
      this.shippmentForm.controls['communeId'].value)
      .then(
        (data) => {
          this.agencesData = data;
        }
      )
  }
  onChangeAgence() {
    this.shippmentForm.controls['userId'].reset()
    this.shipmentsOpsService.findUserByAgence(
      this.shippmentForm.controls['agenceId'].value)
      .then(
        (data) => {
          this.usersData = data;
        }
      )
  }
  formValid(): boolean {
    if (this.shippmentForm.controls['wilayaId'].valid && this.shippmentForm.controls['communeId'].valid &&
      this.shippmentForm.controls['designation'].valid) {
      return true;
    }
    return false;
  }
  createShipment() {
    if (this.shippmentForm.valid) {
      console.log('valide')
      this.shipmentsOpsService.creatShippment(this.shippmentForm.value).subscribe({
        next: response => {
          this.shipmentsOpsService.observAddShipments.next(+1)
          this.shippmentForm.reset();
          this.openFile(response, "application/pdf")
          this.getPaginatedColis(),
            this.btnSpinner = false;
          this.modalService.dismissAll()
        },
        error: (error) => {
        console.log("🚀 ~ file: interne-shipment.component.ts ~ line 253 ~ InterneShipmentComponent ~ this.shipmentsOpsService.creatShippment ~ error", error)
          this.btnSpinner = false;
          this.sweetalertService.basicConfirmWarning(error.message);}
      });
    }
  }
  print(id: number) {
    return this.shipmentsOpsService.printBordereau(id).subscribe({
      next: (response) => {
        this.openFile(response, 'application/pdf');
      },
      error: (error) => {this.sweetalertService.basicConfirmWarning(error.message)}
    });
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
