import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WilayaService } from './wilaya.service';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import {
  IPaginationLinks,
  IPaginationMeta,
} from 'src/app/core/interfaces/paginations';
import { IWilaya } from './i-wilaya';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { Router } from '@angular/router';
import { AgenceService } from '../agence/agence.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-wilaya',
  templateUrl: './wilaya.component.html',
  styleUrls: ['./wilaya.component.scss'],
})
export class WilayaComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  submitted: boolean;
  wilayaForm: FormGroup;
  btnSpinner: boolean = false;
  //test aspiration
  file: File;
  arrayBuffer: any;
  /**
   * wilaya data for table
   * all wilaya or unique wilaya by search or listWilaya by paginate
   */
  wilayaData: IWilaya[];

  listAgences = [];

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
  searchWilayaTerm: string;

  /**
   * WilayaComponente Dependencies
   * wilayaService for all function to interact with Api
   * @param wilayaService
   *
   * formBuilder
   * @param formBuilder
   *
   * sweetalertService for all alerte and confirm alert
   * @param sweetalertService
   *
   * modalService use to display form for create New Wilaya or update
   * @param modalService
   */
  constructor(
    public wilayaService: WilayaService,
    public formBuilder: FormBuilder,
    public sweetalertService: SweetAlertService,
    private modalService: NgbModal,
    private router: Router,
    private agenceService: AgenceService
  ) {
    /**
     * Initailise isloading to false
     */
    this.isLoading = false;
    /**
     * initialis metaData to 0
     * initialis metaLik to 0
     */
    this._wilayaErrorAndInitialis();
  }

  /**
   * init wilayaFrom and load wilayaData
   */
  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion du patrimoine' },
      { label: 'List wilaya', active: true },
    ];

    this.getAgenceHub();

    /**
     * init WilayaForm
     */
    this.wilayaForm = this.formBuilder.group({
      codeWilaya: [
        '',
        [
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.minLength(2),
          Validators.maxLength(2),
        ],
      ],
      nomLatin: [
        ,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ]),
      ],
      nomArabe: [
        ,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ]),
      ],
      agenceRetourId: [
        ,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ]),
      ],
    });

    /**
     * load and init wilayaData from api
     */
    this.getPaginateWilaya();
  }

  /**
   * load all wilayaData
   */
  getPaginateWilaya() {
    this.isLoading = true;
    setTimeout(() => {
      this.wilayaService.getPaginateWilaya().subscribe(
        (response) => {
          this._wilayasResponse(response);
        },
        (error) => {
          this._wilayaErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  /**
   * serach only with strings prams
   *  -code wilaya
   *  -nom latin
   *  -nom arabe
   * @param searchWilayaTerm
   */
  searchTermUpdate(searchWilayaTerm: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.wilayaService.searchWilayas(searchWilayaTerm).subscribe(
        (response) => {
          this._wilayasResponse(response);
        },
        (error) => {
          this._wilayaErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  /**
   * used for paginate
   * @param link
   * @param page
   */
  funcPaginate(link: string, page?: number): void {
    this.isLoading = true;
    setTimeout(() => {
      this.wilayaService.funcPaginate(link, page, this.searchWilayaTerm).subscribe(
        (response) => {
          this._wilayasResponse(response);
        },
        (error) => {
          this._wilayaErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  /**
   * validate wilayaFrom and passe value to WilayaSerive
   * dispay return response or error
   * @returns
   */
  createWilaya() {
    if (!this.wilayaForm.valid) {
      this.submitted = true;
      return;
    } else {
      this.btnSpinner = true;
      this.wilayaService.createWilaya(this.wilayaForm.value).subscribe(
        async (wilaya) => {
          if (wilaya) {
            this.sweetalertService.sipmleAlert(
              'success',
              wilaya.nomLatin,
              'Ajouter avec succses'
            );
            this.getPaginateWilaya();
            this.btnSpinner = false;
            this.wilayaForm.reset;
            this.modalService.dismissAll();
          }
        },
        (error) => {
          this.sweetalertService.basicWarning(error.message);
          this.btnSpinner = false;
        }
      );
    }
  }

  /**
   * load wilayadata from response
   * load metadata from response
   * load metaLinks from response
   * after loading turn isLoading to false
   * @param response
   */
  private _wilayasResponse(response: Pagination<IWilaya>) {
    this.wilayaData = response.items;
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }

  /**
   * display error
   * turn isLoading to false
   * initialis
   *  -wilayaData
   *  -metaData
   *  -metaLinks
   * @param error
   */
  private _wilayaErrorAndInitialis(error?: any) {
    this.wilayaData = [];
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
   * function to open modal
   * @param content
   */
  openModal(content: any) {
    this.modalService.open(content, { backdrop: true, size: 'lg' });
  }

  /**
   * get
   */
  get form() {
    return this.wilayaForm.controls;
  }

  showDetail(id: number) {
    this.router.navigateByUrl(`admin/wilaya/detail_wilaya/${id}`);
  }

  async getAgenceHub() {
    const resp = await this.agenceService.getStationsHubs();
    for await (const agence of resp) {
      this.listAgences.push({
        id: agence.id,
        nom: agence.nom,
        type: agence.type,
      });
    }
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
      this.getWilayas(bstr).then(data => {
          this.wilayaService.createWilayaByFile(data).subscribe( resp =>{
            this.wilayaData = [];
            this.getPaginateWilaya()
          })
      });
    }
  }

  async getWilayas(bstr) {
    var wilayasList: any[] = [];
    var workbook = XLSX.read(bstr, { type: "binary" });
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];

    var wilayas = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: ' ' });
    //console.log(wilayas[0]['Nom']);
    wilayas.forEach(element => {
      const newB: any = {};
      newB.codeWilaya = (element['Code wilaya']).toString();
      newB.nomArabe = element['Nom arab'];
      newB.nomLatin = element['Nom latin'];
      wilayasList.push(newB);

    });
    return wilayasList;
  }
}
