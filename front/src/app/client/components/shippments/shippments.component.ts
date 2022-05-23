import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MDBModalRef,
} from 'angular-bootstrap-md';
import { ShippmentsClientService } from './shippments-client.service';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { Router } from '@angular/router';
import { IPaginationMeta, IPaginationLinks } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shippments',
  templateUrl: './shippments.component.html',
  styleUrls: ['./shippments.component.scss'],
})
export class ShippmentsComponent implements OnInit {
  totalShipmentsAaspirer = []
  shippmentForm: FormGroup;
  aspireForm: FormGroup;
  rangesubmit: boolean;
  wilayasData: any;
  communesData: any;
  serviceData: any;
  file: File;
  arrayBuffer: any;
  modalRef: MDBModalRef;
  colisData: any[];
  trad = {
    oui: true,
    non: false,
  };
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
    public formBuilder: FormBuilder,
    private shippmentsClientService: ShippmentsClientService,
    private sweetAlertService: SweetAlertService,
    private modalService: NgbModal,
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

  async ngOnInit() {
    this.aspireForm = this.formBuilder.group({
      fichier: new FormControl(null, Validators.compose([Validators.required])),
      serviceAspireId: new FormControl(null, Validators.compose([Validators.required])),
    })
    /**
     * init shippmentForm
     */
    this.shippmentForm = this.formBuilder.group({
      raisonSociale: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50)])],
      nom: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35),])],
      prenom: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35),])],
      telephone: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
      wilayaId: [, Validators.compose([Validators.required])],
      communeId: [, Validators.compose([Validators.required])],
      adresse: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      serviceId: [, Validators.compose([Validators.required])],
      numCommande: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(15),])],
      /**
       * , Validators.pattern('[a-zA-Z0-9]+')
       */
      designationProduit: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      prixVente: [0, Validators.compose([Validators.required])],
      prixEstimer: [1000, Validators.compose([Validators.required])],
      poids: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(150)])],
      longueur: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])],
      largeur: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])],
      hauteur: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])],
      livraisonGratuite: [false, Validators.required],
      ouvrireColis: [false, Validators.required],
      echange: [false, Validators.required],
      objetRecuperer: [''],
      livraisonStopDesck: [true, Validators.required],
      livraisonDomicile: [false, Validators.required],
    })

    /**
  * init service for curent user
  */
    this.shippmentsClientService.findServicesOfUser().then(
      (data) => {
        this.serviceData = data;
      }
    )
    /**
     * init wilayas data
     */
    this.shippmentsClientService.findAllWilaya().then(
      (data) => {
        this.wilayasData = data;
      }
    )
    this.rangesubmit = false;
    /**
     * Observe add shipmnets
     */
    this.getPaginatedColis()
  }
  closeModalAspirer() {
    this.modalService.dismissAll()
    this.aspireForm = this.formBuilder.group({
      fichier: new FormControl(null, Validators.compose([Validators.required])),
      serviceAspireId: new FormControl(null, Validators.compose([Validators.required])),
    })
  }
  closeModal() {
    this.modalService.dismissAll()
    this.shippmentForm = this.formBuilder.group({
      raisonSociale: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50)])],
      nom: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35),])],
      prenom: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35),])],
      telephone: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
      wilayaId: [, Validators.compose([Validators.required])],
      communeId: [, Validators.compose([Validators.required])],
      adresse: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      serviceId: [, Validators.compose([Validators.required])],
      numCommande: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(15),])],
      /**
       * , Validators.pattern('[a-zA-Z0-9]+')
       */
      designationProduit: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      prixVente: [0, Validators.compose([Validators.required])],
      prixEstimer: [1000, Validators.compose([Validators.required])],
      poids: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(150)])],
      longueur: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])],
      largeur: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])],
      hauteur: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])],
      livraisonGratuite: [false, Validators.required],
      ouvrireColis: [false, Validators.required],
      echange: [false, Validators.required],
      objetRecuperer: [''],
      livraisonStopDesck: [true, Validators.required],
      livraisonDomicile: [false, Validators.required],
    })
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
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true, backdrop: true });
  }
  openModalAspirer(content: any) {
    this.modalService.open(content, { size: 'md', centered: true, backdrop: true, });
  }

  validateShipment(shipmentId: number) {
    var shipmentsList: number[] = [];
    shipmentsList.push(shipmentId);
    const alertTitle = 'Confirmation de la validation';
    const alertMessage = "Voulez vous confirmer la validation du colis";
    this.sweetAlertService
      .confirmStandard(alertTitle, alertMessage, '', '', null)
      .then((result) => {
        if (result.isConfirmed) {
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
      });

  }

  validateAllShipment() {
    // console.log(this.colisData)
    const alertTitle = 'Confirmation de plusieurs colis ';
    const alertMessage = "Voulez vous confirmer la validation des colis de cette page";
    const ids: number[] = [];
    for (const el of this.colisData) {
      console.log("🚀 ~ file: shippments.component.ts ~ line 142 ~ ShippmentsComponent ~ validateAllShipment ~ el", el)
      ids.push(el.id);
    }

    this.sweetAlertService
      .confirmStandard(alertTitle, alertMessage, '', '', null)
      .then((result) => {
        if (result.isConfirmed) {
          this.shippmentsClientService.setShipmentsOnPreExpedier(ids)

            .subscribe({
              next: response => {
                FileSaver.saveAs(response, "Bordereaux.zip");
                this.getPaginatedColis()
                this.colisData = []
              },
              error: (error) =>
                console.log("🚀 ~ file: shippments-client.service.ts ~ line 49 ~ ShippmentsClientService ~ returnthis.http.post ~ error", error)
            });
        }
      });
  }

  showDetailShipment(shipmentId: number) {
    // this.shippmentsClientService.observAddShipments.next(index);
    this.router.navigateByUrl(`client/colis/${shipmentId}`);
  }

  async deleteShipment(shipment: any) {
    const errorTitle = "Suppression echouée"
    const action = this.shippmentsClientService.deleteshipment(shipment.id);
    await this.sweetAlertService.confirmStandard(`Confirmer la suppression du produit ${shipment.designationProduit}`
      , `destiner pour ${shipment.prenom} - ${shipment.nom}`, 'Supprimer avec success', '', action).then(
        (result) => {
          if (result.value) {
            action.toPromise().then(
              () => {
                this.getPaginatedColis()
              },
              (error) => Swal.fire(errorTitle, 'Erreur confirmation', 'error')
            )
            return result.value
          }
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
  validateAspiration() {
    if (this.aspireForm.valid) {
      console.log(this.aspireForm.value)
      const data = this.totalShipmentsAaspirer
      const serviceId = this.aspireForm.value['serviceAspireId']
      console.log("🚀 ~ file: shippments.component.ts ~ line 356 ~ validateAspiration ~ serviceId", serviceId)
      console.log("🚀 ~ file: shippments.component.ts ~ line 273 ~ this.getShipments ~ data", data)
      return this.shippmentsClientService.createShipmentByFile(serviceId, data).subscribe((resp) => {
        console.log("🚀 ~ file: shippments.component.ts ~ line 389 ~ this.shippmentsClientService.createShipmentByFile ~ resp", resp)
        console.log("🚀 ~ file: shippments.component.ts ~ line 389 ~ this.shippmentsClientService.createShipmentByFile ~ resp", typeof resp)
        if (resp == true) {
          this.colisData = [];
          this.getPaginatedColis();
          this.closeModalAspirer();
        } else {
          let messageError = ''
          resp.forEach(element => {
            messageError += element.shipment + ',' 
          });
          this.sweetAlertService.sipmleAlertConfirme('warning', 'Oops! des colis sont pas crées',
           ' Veillez verifier ces lignes '+ messageError.toString(), true)
          this.closeModalAspirer();
          this.getPaginatedColis();

        }
        // + '1234567891011121314151617181920212223242526272829303132333435363738394041424344454647484950123456789101112131415161718192021222324252627282930313233343536373839404142434445464748495012345678910111213141516171819202122232425262728293031323334353637383940414243444546474849501234567891011121314151617181920212223242526272829303132333435363738394041424344454647484950' 

      })
    }
  }
  async addfile(event) {
    console.log("🚀 ~ file: shippments.component.ts ~ line 351 ~ addfile ~ event", event)
    var bstr: string;
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      bstr = arr.join("");
      this.getShipments(bstr).then(data => {
        this.totalShipmentsAaspirer = data
        // this.aspireForm.value['fichier'] = data
      })
    }
  }

  async getShipments(bstr) {
    var wilayasList: any[] = [];
    var workbook = XLSX.read(bstr, { type: "binary" });
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];

    var wilayas = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: ' ' });
    //console.log(wilayas[0]['Nom']);
    let i = 0;
    wilayas.forEach(element => {
      i+= 1;
      const newB: any = {};
      newB.idRaw = i;
      newB.raisonSociale = element['Raison sociale'];
      newB.nom = element['Nom'];
      newB.prenom = element['Prénom'];
      newB.telephone = element['Téléphone'].toString().toLowerCase();
      newB.livraisonStopDesck = this.trad[element['Stop desk'].toLowerCase()];
      newB.wilaya = element['Wilaya'].toLowerCase();
      newB.commune = element['Commune'].toLowerCase();
      newB.adresse = element['Adresse'].toLowerCase();
      newB.numCommande = element['Numero_commande'].toString();
      newB.designationProduit = element['Designation'].toLowerCase();
      newB.prixVente = element['Prix de vente'];
      newB.prixEstimer = element['Prix estimer'];
      newB.livraisonGratuite = this.trad[element['livraison gratuite'].toLowerCase()];
      newB.poids = element['Poids(Kg)'];
      newB.largeur = element['Largeur(m)'];
      newB.longueur = element['Longueur(m)'];
      newB.hauteur = element['Hauteur(m)'];
      newB.echange = this.trad[element['FAIRE UN ECHANGE?'].toLowerCase()];
      newB.objetRecuperer = element['OBJET A RECUPERER'].toLowerCase();
      wilayasList.push(newB);

    });
    return wilayasList;
  }

  /**
 * Returns form
 */
  get form() {
    return this.shippmentForm.controls;
  }

  /**
   * Returns the type validation form
   */
  get type() {
    return this.shippmentForm.controls;
  }

  /**
 * Returns the range validation form
 */
  get range() {
    return this.shippmentForm.controls;
  }


  onChangeShippmentTypeDesk(value: boolean) {
    this.shippmentForm.controls['communeId'].reset()
    this.shippmentForm.controls['wilayaId'].reset()
    if (value === true) {
      this.shippmentForm.controls['livraisonDomicile'].setValue(false)
    } else {
      this.shippmentForm.controls['livraisonDomicile'].setValue(true)
    }
  }

  onChangeShippmentTypeHome(value: boolean) {
    this.shippmentForm.controls['communeId'].reset()
    this.shippmentForm.controls['wilayaId'].reset()
    if (value === true) {
      this.shippmentForm.controls['livraisonStopDesck'].setValue(false)

    } else {
      this.shippmentForm.controls['livraisonStopDesck'].setValue(true)
    }
  }

  onChangeShippmentEchange(value: boolean) {
    if (value === true) {
      this.shippmentForm.get('objetRecuperer').setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(50)])
      this.shippmentForm.get('objetRecuperer').updateValueAndValidity();

    } else {
      this.shippmentForm.get('objetRecuperer').clearValidators();
      this.shippmentForm.get('objetRecuperer').updateValueAndValidity()
    }
  }

  stepOneValide(): boolean {
    if (
      (this.shippmentForm.controls['nom'].valid && this.shippmentForm.controls['prenom'].valid &&
        this.shippmentForm.controls['telephone'].valid && this.shippmentForm.controls['raisonSociale'].valid) &&
      (this.shippmentForm.controls['livraisonStopDesck'].valid || this.shippmentForm.controls['livraisonDomicile'].valid)
    ) {
      return true;
    }
    return false;
  }
  aspirationValide(): boolean {
    if (this.aspireForm.controls['fichier'].valid && this.aspireForm.controls['serviceAspireId'].valid) {
      return true
    }
    return false
  }
  stepTwoValide(): boolean {
    if (this.shippmentForm.controls['livraisonStopDesck'].value === true) {
      this.shippmentForm.get('adresse').clearValidators();
      this.shippmentForm.get('adresse').updateValueAndValidity()
    } else {
      this.shippmentForm.get('adresse').setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
      this.shippmentForm.get('adresse').updateValueAndValidity();
    }
    if (this.shippmentForm.controls['echange'].value === true) {
      this.shippmentForm.get('objetRecuperer').setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(50)])
      this.shippmentForm.get('objetRecuperer').updateValueAndValidity();
    } else {
      this.shippmentForm.get('objetRecuperer').clearValidators();
      this.shippmentForm.get('objetRecuperer').updateValueAndValidity()
    }
    if (
      this.shippmentForm.controls['wilayaId'].valid && this.shippmentForm.controls['communeId'].valid &&
      this.shippmentForm.controls['serviceId'].valid && this.shippmentForm.controls['numCommande'].valid &&
      this.shippmentForm.controls['designationProduit'].valid && this.shippmentForm.controls['prixVente'].valid &&
      this.shippmentForm.controls['livraisonGratuite'].valid && this.shippmentForm.controls['adresse'].valid &&
      this.shippmentForm.controls['objetRecuperer'].valid

    ) {
      return true;
    }
    return false;
  }

  stepThreeValide(): boolean {
    if (
      this.shippmentForm.controls['poids'].valid && this.shippmentForm.controls['longueur'].valid &&
      this.shippmentForm.controls['largeur'].valid && this.shippmentForm.controls['hauteur'].valid
    ) {
      if (this.shippmentForm.value['livraisonDomicile'] === true &&
       ( this.shippmentForm.value['poids'] > 30 || (this.shippmentForm.value['longueur'] *
        this.shippmentForm.value['largeur'] * this.shippmentForm.value['hauteur'] * 200 >30)) ) {
        return false;
      }
      return true
    }
    return false;
  }

  onChangeWilaya() {
    this.shippmentForm.controls['communeId'].reset()
    this.shippmentsClientService.findCommunByWilayaTypeLivraison(this.shippmentForm.controls['wilayaId'].value, this.shippmentForm.controls['livraisonStopDesck'].value).then(
      (data) => {
        this.communesData = data;
      }
    )
  }
  createShipment(value?: string) {
    if (this.shippmentForm.valid) {
      console.log(this.shippmentForm.value)
      this.shippmentsClientService.creatShippment(this.shippmentForm.value).subscribe(
        (data) => {
          console.log("🚀 ~ file: shippments.component.ts ~ line 483 ~ createShipment ~ data", data)
          // this.shippmentsClientService.observAddShipments.next(+1)
          this.getPaginatedColis()
          this.modalService.dismissAll()
          this.btnSpinner = false;
          this.shippmentForm = this.formBuilder.group({
            raisonSociale: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50)])],
            nom: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35),])],
            prenom: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35),])],
            telephone: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
            wilayaId: [, Validators.compose([Validators.required])],
            communeId: [, Validators.compose([Validators.required])],
            adresse: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            serviceId: [, Validators.compose([Validators.required])],
            numCommande: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(15),])],
            /**
             * , Validators.pattern('[a-zA-Z0-9]+')
             */
            designationProduit: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
            prixVente: [0, Validators.compose([Validators.required])],
            prixEstimer: [1000, Validators.compose([Validators.required])],
            poids: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(150)])],
            longueur: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])],
            largeur: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])],
            hauteur: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])],
            livraisonGratuite: [false, Validators.required],
            ouvrireColis: [false, Validators.required],
            echange: [false, Validators.required],
            objetRecuperer: [''],
            livraisonStopDesck: [true, Validators.required],
            livraisonDomicile: [false, Validators.required],
          })

        },
        (error) => {
          console.log("🚀 ~ file: interne-shipment.component.ts ~ line 253 ~ InterneShipmentComponent ~ this.shipmentsOpsService.creatShippment ~ error", error)
          this.btnSpinner = false;
          this.sweetAlertService.basicConfirmWarning(error.message);
          console.log("🚀 ~ file: add-one-shippmnet.component.ts ~ line 179 ~ AddOneShippmnetComponent ~ createShipment ~ error", error)
        }
      );
    }
  }
  setValuePrixEstimer() {
    if (this.shippmentForm.get('prixVente').value >= 1000) {

      this.shippmentForm.patchValue({
        prixEstimer: this.shippmentForm.get('prixVente').value
      })

    } else {
      this.shippmentForm.patchValue({
        prixEstimer: 1000
      })
    }
  }

}
