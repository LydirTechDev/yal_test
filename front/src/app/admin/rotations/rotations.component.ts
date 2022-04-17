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
import { IWilaya } from '../wilaya/i-wilaya';
import { WilayaService } from '../wilaya/wilaya.service';
import { IZone } from '../zone/i-zone';
import { ZoneService } from '../zone/zone.service';
import { IRotation } from './i-rotation';
import { RotationService } from './rotation.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-rotations',
  templateUrl: './rotations.component.html',
  styleUrls: ['./rotations.component.scss'],
})
export class RotationsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  submitted: boolean;
  //test aspiration
  file: File;
  arrayBuffer: any;
  /**
   * form for create new roation
   */
  rotationForm: FormGroup;

  /**
   * include page
   * -itemConts nb item selected in rotationsData
   * -totalItem total item selected in rotationsData
   * -itemPerPage nb item selected per page in rotationsData
   * -totapPage nb page generated selected in rotationsData
   * -currentPage current Page selected in rotationsData
   */
  metaData: IPaginationMeta;

  /**
   * -first pre-generated url to first list in rotationsData
   * -last pre-generated url to laste list in rotationsData
   * -previous pre-generated url to previous list from currentPage
   * -next pre-generated url to next list from currentPage
   */
  metaLinks: IPaginationLinks;

  /**
   * turn to true if rotationsData is loading
   * else to to false
   */
  isLoading: boolean;


  /**
   * save value of input shearch
   */
  searchRotationTerm: string;

  /**
   * rotations data for tabel
   */
  rotationsData: IRotation[];

  /**
   * if true enabel spinner for a button
   */
  btnSpinner: boolean = false;

  /**
   * all wilayas
   */
  wilayasList: IWilaya[];

  /**
   * all zones
   */
  zonesList: IZone[];

  /**
   *
   * @param modalService
   * @param formBuilder
   * @param wilayaService
   * @param zoneService
   * @param rotationSerivce
   * @param sweetAlertService
   */
  constructor(
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private wilayaService: WilayaService,
    private zoneService: ZoneService,
    private rotationSerivce: RotationService,
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
    this._rotationsErrorAndInitialis();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Gestion des rotations' },
      { label: 'Rotations', active: true },
    ];

    /**
     * init and load rotaion data
     */

    this.getPaginateRotation();
    /**
     * init list wilayas
     */
    this.wilayaService.getAllWilaya().subscribe((data) => {
      this.wilayasList = data;
    });

    /**
     * init list zones
     */
    this.zoneService.getAllZones().subscribe((data) => {
      this.zonesList = data;
    });

    /**
     * init rotation form
     */
    this.rotationForm = this.formBuilder.group({
      wilayaDepartId: [, [Validators.required]],
      wilayaDestinationId: [, [Validators.required]],
      zoneId: [, [Validators.required]],
    });
  }

  /**
   * load all paginate rotations
   */
  getPaginateRotation(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.rotationSerivce.getPaginateRotations().subscribe(
        (response) => {
          this._rotationsResponse(response);
        },
        (error) => {
          this._rotationsErrorAndInitialis(error);
          this.sweetAlertService.sipmleAlertConfirme(
            'warning',
            'can not load rotations',
            error.message,
            true
          );
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
      this.rotationSerivce.searchRotations(searchAgenceTerm).subscribe(
        (response) => {
          this._rotationsResponse(response);
        },
        (error) => {
          this._rotationsErrorAndInitialis(error);
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
      this.rotationSerivce.funcPaginate(link, page, this.searchRotationTerm).subscribe(
        (response) => {
          this._rotationsResponse(response);
        },
        (error) => {
          this._rotationsErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  /**
   * open modal to
   * create new rotation
   * @param content
   */
  openModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * create new rotation
   * @returns
   */
  createRotations() {
    if (!this.rotationForm.valid) {
      this.submitted = true;
      return;
    } else {
      this.btnSpinner = true;
      this.rotationSerivce.createRotation(this.rotationForm.value).subscribe(
        (response) => {
          this.getPaginateRotation();
          this.btnSpinner = false;
          this.rotationForm.reset();
          this.modalService.dismissAll();
        },
        (error) => {
          console.log(
            '🚀 ~ file: rotations.component.ts ~ line 193 ~ RotationsComponent ~ createRotations ~ error',
            typeof error.status
          );
          if (error.status === 442) {
            this.sweetAlertService.basicWarning('this rotation existe');
          } else {
            this.sweetAlertService.basicWarning(error.message);
            console.log("🚀 ~ file: rotations.component.ts ~ line 243 ~ RotationsComponent ~ createRotations ~ error.message", error.message)
          }
          this.btnSpinner = false;
        }
      );
    }
  }

  get form() {
    return this.rotationForm.controls;
  }

  /**
   * load rotationsData from response
   * load metaDAta from response
   * load metaLinks from response
   * after loading turn isloading tu false
   * @param response
   */
  private _rotationsResponse(response: Pagination<IRotation>) {
    this.rotationsData = response.items;
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }

  /**
   * display error
   * initialis
   *  -rotationsData to []
   *  -metaData to 0
   *  -metaLinks to ''
   * @param error
   */
  private _rotationsErrorAndInitialis(error?: any) {
    this.rotationsData = [];
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

  detailRotation(id: number) {
    this.router.navigateByUrl(`admin/rotation/detail_rotation/${id}`)
  }

  exportRotations(termToSearch: string) {
    if (!termToSearch) {
      termToSearch = '';
    }
    this.rotationSerivce.pars(termToSearch).subscribe(
      (response) => {
        FileSaver.saveAs(response, "liste des rotations.xlsx");
      }
    )
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
      this.getRotationsFile(bstr).then(data => {
        this.rotationSerivce.createRotationByFile(data).subscribe(resp => {
          this.rotationsData = [];
          this.getPaginateRotation()
        })
      });
    }
  }
  async getRotationsFile(bstr) {
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
      newEl.wilayaDepartId = (element['depart']);
      newEl.wilayaDestinationId = element['destination'];
      newEl.zoneId = element['zone'];
      communesList.push(newEl);
    });
    return communesList;
  }
}
