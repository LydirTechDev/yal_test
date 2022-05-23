// probleme dans l'ajout de l'agence !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  IPaginationMeta,
  IPaginationLinks,
} from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { CommuneService } from '../commune/commune.service';
import { ICommune } from '../commune/i-commune';
import { IWilaya } from '../wilaya/i-wilaya';
import { WilayaService } from '../wilaya/wilaya.service';
import { AgenceService } from './agence.service';
import { AgencesTypesEnum } from './agencesTypesEnum';
import { IAgence } from './i-agence';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-agence',
  templateUrl: './agence.component.html',
  styleUrls: ['./agence.component.scss'],
})
export class AgenceComponent implements OnInit {
  /**
   *
   */
  breadCrumbItems: Array<{}>;

  /**
   * communes list all or communes selected by id wilaya
   */
  communesList: ICommune[];

  /**
   * wilayas list all wilayas
   */
  wilayaList: IWilaya[];

  /**
   * agence data for tabel
   * all agence or unique agence by search or by dispaly paginate
   */
  agenceData: IAgence[];
  /**
   * include page
   * -itemConts nb item selected in agenceData
   * -totalItem total item selected in agenceData
   * -itemPerPage nb item selected per page in agenceData
   * -totapPage nb page generated selected in agenceData
   * -currentPage current Page selected in agenceData
   */
  metaData: IPaginationMeta;

  /**
   * -first pre-generated url to first list in agenceData
   * -last pre-generated url to laste list in agenceData
   * -previous pre-generated url to previous list from currentPage
   * -next pre-generated url to next list from currentPage
   */
  metaLinks: IPaginationLinks;

  /**
   * turn to true if agenceData is loading
   * else to to false
   * dispaly spinner in tabel
   */
  isLoading: boolean;

  /**
   * save value of input search
   */
  searchAgenceTerm: string;

  /**
   * form for create agence
   */
  agenceForm: FormGroup;

  /**
   * seabel spinner
   */
  btnSpinner: boolean;

  /**
   * turn to true form isd submited
   */
  submitted: boolean;
  /**
   * Type Agence enum to array [type, name]
   */

  wilayaAgence: any = '';
  communeAgence: any = '';

  typeAgences: any[] = [
    { type: AgencesTypesEnum.bureau, name: AgencesTypesEnum.bureau },
    { type: AgencesTypesEnum.hub, name: AgencesTypesEnum.hub },
    { type: AgencesTypesEnum.centreRetour, name: AgencesTypesEnum.centreRetour },
    { type: AgencesTypesEnum.caisseRegional, name: AgencesTypesEnum.caisseRegional },
    { type: AgencesTypesEnum.caisseCentral, name: AgencesTypesEnum.caisseCentral },
  ];

  /**
   * AgenceComponante
   * @param agenceService
   * @param formBuilder
   * @param modalService
   * @param communeService
   * @param sweetalertService
   * @param wilayaService
   */
  constructor(
    public agenceService: AgenceService,
    public formBuilder: FormBuilder,
    public modalService: NgbModal,
    public communeService: CommuneService,
    public sweetalertService: SweetAlertService,
    public wilayaService: WilayaService,
    private router: Router
  ) {
    /**
     * init isLoading to false
     */
    this.isLoading = false;

    /**
     * init wilayaList from Api
     */
    this._getAllWilaya();

    /**
     * init agenceData
     */
    this._agencesErrorAnInitialis();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Gestion du patrimoine' },
      { label: 'agence', active: true },
    ];

    /**
     * init agenceForm
     */
    this.agenceForm = this.formBuilder.group({
      wilaya: [],
      nom: [, [Validators.required]],
      adresse: [, [Validators.required]],
      type: [, [Validators.required]],
      nrc: [, [Validators.required]],
      nif: [, [Validators.required]],
      nis: [, [Validators.required]],
      nAI: [, [Validators.required]],
      communeId: [, Validators.required],
      prixRamassageZoneOne:[, Validators.required],
      prixRamassageZoneTwo:[, Validators.required],
      prixLivraisonZoneOne: [, Validators.required],
      prixLivraisonZoneTwo: [, Validators.required],
      communeZoneOne:[, Validators.required],
    });

    /**
     * load abd init agenceData from Api
     */
    this.getPaginateAgence();
  }

  /**
   * load all paginate agence
   */
  getPaginateAgence(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.agenceService.getPaginateAgence().subscribe(
        (response) => {
          this._agencesResponse(response);
        },
        (error) => {
          this._agencesErrorAnInitialis(error);
        }
      );
    }, 330);
  }

  /**
   * search only with string params
   * inculed search reloations
   * @param searchAgenceTerm
   */
  searchTermUpdate(searchAgenceTerm: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.agenceService.searchAgences(searchAgenceTerm).subscribe(
        (response) => {
          this._agencesResponse(response);
        },
        (error) => {
          this._agencesErrorAnInitialis(error);
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
      this.agenceService.funcPaginate(link, page, this.searchAgenceTerm).subscribe(
        (response) => {
          this._agencesResponse(response);
        },
        (error) => {
          this._agencesErrorAnInitialis(error);
        }
      );
    }, 330);
  }

  /**
   * on selecte or change wilaya
   * load commune by wilaya id
   * put wilaya name nomLatin to address
   */
  onChangWilaya() {
    this.communeService
      .getCommunsByWilayaId(this.agenceForm.get('wilaya').value)
      .subscribe(
        (response) => {
          this.communesList = response;
        },
        (error) => {
          this.sweetalertService.sipmleAlertConfirme(
            'warning',
            'pas de commune pour la wilaya de',
            ''
          );
        }
      );
    let wilayas = this.wilayaList;
    const t = wilayas.filter((wil) => {
      return wil.id == this.agenceForm.get('wilaya').value;
    });
    this.agenceForm.get('adresse').setValue(t[0].nomLatin + ', ');
  }

  /**
   * on change commune
   * put commune name to adresse
   */
  onChangCommune() {
    let commune = this.communesList;
    const t1 = commune.filter((com) => {
      return com.id == this.agenceForm.get('communeId').value;
    });
    let wilayas = this.wilayaList;
    const t = wilayas.filter((wil) => {
      return wil.id == this.agenceForm.get('wilaya').value;
    });
    this.agenceForm
      .get('adresse')
      .setValue(t[0].nomLatin + ', ' + t1[0].nomLatin + ', ');
  }

  /**
   * validate agence form and passe value to agence service
   * display return response or arror
   * @returns
   */
  createAgence() {
    if (!this.agenceForm.valid) {
      this.submitted = true;
      return;
    } else {
      this.btnSpinner = true;
      console.log(this.agenceForm.value);
      this.agenceService.createAgence(this.agenceForm.value).subscribe(
        (data) => {
          this.sweetalertService.sipmleAlert(
            'success',
            data.nom,
            'Ajouter avec succser'
          );
          this.getPaginateAgence();
          this.btnSpinner = false;
          this.agenceForm.reset;
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

  private _filterCommuneById(id: number): ICommune {
    const commune = this.communesList.filter((commune) => {
      return commune.id == id;
    });
    return commune[0];
  }
  private _filterWilayaById(id: number): IWilaya {
    const wilaya = this.wilayaList.filter((wilaya) => {
      return wilaya.id == id;
    });
    return wilaya[0];
  }
  /**
   * Modal Open
   * @param content modal content
   */
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  /**
   * load agenceData from response
   * load metaData from response
   * load metaLink from response
   * after loading tur isLoading to false
   * @param response
   */
  private _agencesResponse(response: Pagination<IAgence>) {
    console.log("🚀 ~ file: agence.component.ts ~ line 330 ~ AgenceComponent ~ _agencesResponse ~ response", response)
    this.agenceData = response.items;
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }

  /**
   * display error
   * initialis
   *  -agenceData to []
   *  -metaData to 0
   *  -metaLinks to ''
   * @param error
   */
  private _agencesErrorAnInitialis(error?: any) {
    this.agenceData = [];
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
   *
   * @returns
   */
  private _validateFirstStep(): boolean {
    if (this.agenceForm.get('wilaya').valid &&
      this.agenceForm.get('nom').valid &&
      this.agenceForm.get('adresse').valid &&
      this.agenceForm.get('type').valid &&
      this.agenceForm.get('nrc').valid &&
      this.agenceForm.get('nis').valid &&
      this.agenceForm.get('nif').valid &&
      this.agenceForm.get('nAI').valid &&
      this.agenceForm.get('communeId').valid ) {
      this.wilayaAgence = this._filterWilayaById(
        this.agenceForm.get('wilaya').value
      ).nomLatin;
      this.communeAgence = this._filterCommuneById(
        this.agenceForm.get('communeId').value
      ).nomLatin;
      return true;
    }
    return false;
  }

  private _validateSecondStep(): boolean {
    if (this.agenceForm.get('prixRamassageZoneOne').valid &&
      this.agenceForm.get('prixRamassageZoneTwo').valid &&
      this.agenceForm.get('prixLivraisonZoneOne').valid &&
      this.agenceForm.get('prixLivraisonZoneTwo').valid &&
      this.agenceForm.get('communeZoneOne').valid) {
      return true;
    }
    return false;
  }
  /**
   * private function to load all wilaya
   */
  private _getAllWilaya(): void {
    this.wilayaService.getAllWilaya().subscribe(
      (response) => {
        this.wilayaList = response;
      },
      (error) => {
        this.sweetalertService.sipmleAlertConfirme(
          'warning',
          'can not load wilayas',
          error.message,
          true
        );
      }
    );
  }
  get validateFirstStep(): boolean {
    return this._validateFirstStep();
  }

  get validateSecondStep(): boolean {
    return this._validateSecondStep();
  }
  get form() {
    return this.agenceForm.controls;
  }

  showDetail(id: number) {
    this.router.navigateByUrl(`admin/agence/detail_agence/${id}`);
  }

  //
    //test aspiration
  file: File;
  arrayBuffer: any;
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
      this.getFonction(bstr).then(data => {
          this.agenceService.createFonctionByFile(data).subscribe( resp =>{
            this.agenceData = [];
            this.getPaginateAgence()
          })
      });
    }
  }

  async getFonction(bstr) {
    var wilayasList: any[] = [];
    var workbook = XLSX.read(bstr, { type: "binary" });
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];

    var wilayas = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: ' ' });
    //console.log(wilayas[0]['Nom']);
    wilayas.forEach(element => {
      const newB: any = {};
      newB.nom = (element['nom']).toString();
      newB.departement = +element['departementId'];
      wilayasList.push(newB);

    });
    return wilayasList;
  }
}
