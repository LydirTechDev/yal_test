import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import {
  IPaginationLinks,
  IPaginationMeta,
} from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { JourSemaineEnum } from 'src/app/core/models/JourSemaineEnum';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ICreateWilaya } from '../wilaya/i-create-wilaya';
import { IWilaya } from '../wilaya/i-wilaya';
import { WilayaService } from '../wilaya/wilaya.service';
import { CommuneService } from './commune.service';
import { ICommune } from './i-commune';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-commune',
  templateUrl: './commune.component.html',
  styleUrls: ['./commune.component.scss'],
})
export class CommuneComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  submitted: boolean;
  //test aspiration
  file: File;
  arrayBuffer: any;
  /**
   * commune data for table
   * all commune o unique wilaya by search or display by paginate
   */
  communeData: ICommune[];

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
   * -first pre-generated url to first list in wilayaData
   * -last pre-generated url to laste list in wilayaData
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
  searchCommuneTerm: string;

  /**
   * enabel sipnner
   */
  btnSpinner: boolean = false;

  /**
   * all wilaya
   */
  wilayasList: IWilaya[];

  /**
   * form for create commune
   */
  communeForm: FormGroup;

  /**
   * when change status of communeLivrable
   */
  private _valueChange: boolean;

  /**
   * all days of week
   */
  joureeSemain: any[] = [
    { journee: JourSemaineEnum.Samedi, nom: JourSemaineEnum.Samedi },
    { journee: JourSemaineEnum.Dimanche, nom: JourSemaineEnum.Dimanche },
    { journee: JourSemaineEnum.Lundi, nom: JourSemaineEnum.Lundi },
    { journee: JourSemaineEnum.Mardi, nom: JourSemaineEnum.Mardi },
    { journee: JourSemaineEnum.Mercredi, nom: JourSemaineEnum.Mercredi },
    { journee: JourSemaineEnum.Jeudi, nom: JourSemaineEnum.Jeudi },
    { journee: JourSemaineEnum.Vendredi, nom: JourSemaineEnum.Vendredi },
  ];

  /**
   * CommuneComponente Dependencies
   * wilayaService for all function to interact with Api
   * @param wilayaService
   *
   * modalService use to display form for create New Wilaya or update
   * @param modalService
   *
   * formBuilder
   * @param formBuilder
   *
   * sweetalertService for all alerte and confirm alert
   * @param sweetalertService
   *
   * @param wilayaService
   *
   * @param communeService
   *
   */
  constructor(
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    public sweetalertService: SweetAlertService,
    public wilayaService: WilayaService,
    public communeService: CommuneService,
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
    this._communeErrorAndInitialis();
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion du patrimoine' },
      { label: 'commune', active: true },
    ];

    /**
     * init communeForm
     */
    this.communeForm = this.formBuilder.group({
      wilayaId: ['', [Validators.required]],
      nomLatin: ['', [Validators.required]],
      nomArabe: ['', [Validators.required]],
      codePostal: ['', [Validators.required]],
      livrable: [false, [Validators.required]],
      journeeLivraison: [[], Validators.required],
      livraisonStopDesck: [false, Validators.required],
      livraisonDomicile: [false, Validators.required],
      stockage: [false, Validators.required],
    });

    /**
     * load and init communeData from Api
     */
    this.getPaginatedCommune();
  }

  /**
   * load all commune
   */
  getPaginatedCommune(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.communeService.getPaginateCommune().subscribe(
        (response) => {
          this._communesResponse(response);
        },
        (error) => {
          this._communeErrorAndInitialis(error);
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
   * @param searchCommuneTerm void
   */
  searchTermUpdate(searchCommuneTerm: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.communeService.searchCommunes(searchCommuneTerm).subscribe(
        (response) => {
          this._communesResponse(response);
        },
        (error) => {
          this._communeErrorAndInitialis(error);
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
      this.communeService.funcPaginate(link, page, this.searchCommuneTerm).subscribe(
        (response) => {
          this._communesResponse(response);
        },
        (error) => {
          this._communeErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  /**
   * validate communeForm and passe value to communeService
   * display return response or error
   * @returns
   */
  createCommune(): Observable<ICreateWilaya> | boolean {
    if (!this._validateFirstStep()) {
      return false;
    } else {
      this.btnSpinner = true;
      this.communeService.createCommune(this.communeForm.value).subscribe(
        (commune) => {
          this.sweetalertService.sipmleAlert(
            'success',
            commune.nomLatin,
            'Ajouter avec succses'
          );
          this.getPaginatedCommune();
          this.btnSpinner = false;
          this.communeForm.reset;
          this.modalService.dismissAll();
        },
        (error) => {
          this.sweetalertService.basicWarning(error);
          this.btnSpinner = false;
          console.log(error);
        }
      );
    }
  }
  /**
   * Modal Open
   * @param content modal content
   */
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg' });
    this.wilayaService.getAllWilaya().subscribe((data) => {
      this.wilayasList = data;
    });
  }

  /**
   * if commune Livrable is false
   *  - set journeeLivraison to []
   *  - set livraisonDomicile to false
   *  - set stockage to false
   * - value is value of Commune livrable
   * @param value boolean
   */
  onValueChange(value: boolean) {
    this._valueChange = value;
    this.communeForm.get('journeeLivraison').setValue([]);
    this.communeForm.get('livraisonDomicile').setValue(false);
    this.communeForm.get('stockage').setValue(false);
  }

  /**
   * validate first step for create commune
   * if contition is true return true else return false
   * @returns boolean
   */
  private _validateFirstStep(): boolean {
    if (
      this.communeForm.get('wilayaId').valid &&
      this.communeForm.get('nomLatin').valid &&
      this.communeForm.get('nomArabe').valid &&
      this.communeForm.get('codePostal').valid
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * load communeData from response
   * load metaDAta from response
   * load metaLinks from response
   * after loading turn isloading tu false
   * @param response
   */
  private _communesResponse(response: Pagination<ICommune>) {
    this.communeData = response.items;
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
  private _communeErrorAndInitialis(error?: any) {
    this.communeData = [];
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
   * validate second step for create commune
   * if condition is true return true
   * @returns boolean
   */
  private _validateSecondStep(): boolean {
    if (this.communeForm.get('livraisonDomicile').valid || !this.valueChange) {
      if (
        this.communeForm.get('livrable').value == true &&
        this.communeForm.get('journeeLivraison').invalid
      ) {
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * getter for validation second step
   */
  get validateSecondeStep(): boolean {
    return this._validateSecondStep();
  }
  /**
   * getter for valueChange
   */
  get valueChange(): boolean {
    return this._valueChange;
  }
  /**
   * getter for validate first step
   */
  get validateFirstStep(): boolean {
    return this._validateFirstStep();
  }

  /**
   * getter for communeForm controls
   */
  get form() {
    return this.communeForm.controls;
  }


  detailCommune(id: number) {
    this.router.navigateByUrl(`admin/commune/detail_commune/${id}`)
  }
  async addfile(event) {
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
      this.getCommunes(bstr).then(data => {
        this.communeService.createCommuneByFile(data).subscribe(resp => {
          this.communeData = [];
          this.getPaginatedCommune();
        })
      });
    }
  }

  async getCommunes(bstr) {
    var communesList: any[] = [];
    var workbook = XLSX.read(bstr, { type: "binary" });
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    var trad = {
      Oui: true,
      Non: false

    }
    var communes = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: ' ' });
    //console.log(communes[0]['Nom']);
    communes.forEach(element => {

      const newEl: any = {};
      newEl.codePostal = (element['Code postal']).toString();
      newEl.nomLatin = element['Nom latin'];
      newEl.nomArabe = element['Nom arab'];
      newEl.journeeLivraison = element['Journée livraison'].split("\\s*,\\s*");
      for (const i of newEl.journeeLivraison) {
        console.log(i)
        var match = i.split(',')
      }
      newEl.journeeLivraison = match;
      newEl.livraisonDomicile = element['Livraison domicile'].toUpperCase() == 'OUI' ? true : false;
      newEl.livraisonStopDesck = element['Livraison stopdesk'].toUpperCase() == 'OUI' ? true : false;
      newEl.stockage = element['stockage'].toUpperCase() == 'OUI' ? true : false;
      newEl.livrable = element['Livrable'].toUpperCase() == 'OUI' ? true : false;
      newEl.wilayaId = element['wilaya'];
      communesList.push(newEl);
    });
    return communesList;
  }

}
