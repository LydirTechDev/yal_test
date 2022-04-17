import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IService } from '../i-service';
import { ServiceService } from '../service.service';
import { TarificationService } from '../tarification.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
})
export class ServiceListComponent implements OnInit, OnDestroy {
  /**
   * service data from api
   */
  servivesData: IService[];

  /**
   * loading data in componant
   */
  isloadingData: boolean;

  /**
   * active accordion
   */
  activeIds: string;

  constructor(
    public tarificationService: TarificationService,
    private serviceService: ServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    /**
     * init servicesIsLoading to false
     */
    this.isloadingData = false;

    /**
     * init default accordion
     */
    this.activeIds = '0';

    /**
     * init service Data
     */
    this.servivesData = [];
  }

  ngOnDestroy(): void {
    console.log('####################################"');
  }

  ngOnInit(): void {
    /**
     * init anf load all services
     */
    this._getAllServices();
  }

  /**
   * get and load all services
   */
  private _getAllServices() {
    this.isloadingData = true;
    setTimeout(() => {
      this.serviceService.getAllServices().subscribe(
        (response) => {
          console.log(
            '🚀 ~ file: tarifications.component.ts ~ line 44 ~ TarificationsComponent ~ _getAllServices ~ response',
            response
          );
          this.servivesData = response;
          this.isloadingData = false;
        },
        (error) => {
          console.log(
            '🚀 ~ file: tarifications.component.ts ~ line 48 ~ TarificationsComponent ~ _getAllServices ~ error',
            error
          );
          this.isloadingData = false;
        }
      );
    }, 330);
  }

  /**
   *getDetailService
   */
  getDetailService(serviceId: number) {
    if (!this.tarificationService.checkIfCreatingService()) {
      this.tarificationService.closeServiceDetail();
      setTimeout(() => {
        this.router.navigate([`detail-service/${serviceId}`], {
          relativeTo: this.route,
        });
      }, 1);
    } else {
      this.tarificationService.cancelCreateService(
        `admin/tarifications/detail-service/${serviceId}`
      );
    }
  }

  /**
   *
   * @param codeTarifId
   */
  getDetailCodeTarif(serviceId: number, codeTarifId: number) {
    if (!this.tarificationService.checkIfCreatingService()) {
      this.router.navigate(
        [`detail-service/${serviceId}/detail-code-tarif/${codeTarifId}`],
        {
          relativeTo: this.route,
        }
      );
    } else {
      this.tarificationService.cancelCreateService(
        `admin/tarifications/detail-service/${serviceId}`
      );
    }
  }

  /**
   * confihue new code tarif for selected service
   * @param serviceId
   */
  createNewCodeTarif(serviceName: string) {
    console.log(
      '🚀 ~ file: tarifications.component.ts ~ line 111 ~ TarificationsComponent ~ serviceId',
      serviceName
    );
  }



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
      this.getListTarifs(bstr).then(data => {
        console.log("🚀 ~ file: service-list.component.ts ~ line 153 ~ ServiceListComponent ~ this.getListTarifs ~ data", data)
        this.tarificationService.createTarifsByFile(data).subscribe(resp => {
          alert('c ok')
        })
      });
    }
  }

  async getListTarifs(bstr) {
    var listTarifs: any[] = [];
    var workbook = XLSX.read(bstr, { type: "binary" });
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];

    var wilayas = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: ' ' });
    //console.log(wilayas[0]['Nom']);
    wilayas.forEach(element => {
      const newB: any = {};
      newB.zoneId = (element['zone']).toString();
      newB.poidsMin = element['poids min'];
      newB.poidsMax = element['poids max'];
      newB.tarifsPoidsKg = element['tarifPoidsParKg'];
      newB.tarifStopDesk = element['tarifStopDesk'];
      newB.tarifDomicile = element['tarifDomicile'];
      newB.codeTarif = element['codeTarif'];

      listTarifs.push(newB);

    });
    return listTarifs;
  }

}
