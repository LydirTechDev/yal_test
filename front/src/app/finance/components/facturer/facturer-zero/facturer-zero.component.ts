
  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, Validators } from '@angular/forms';
  import { Router } from '@angular/router';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
  import { FacturerService } from '../facturer.service';

@Component({
  selector: 'app-facturer-zero',
  templateUrl: './facturer-zero.component.html',
  styleUrls: ['./facturer-zero.component.scss']
})
export class FacturerZeroComponent implements OnInit {


      constructor(
        private formBuilder: FormBuilder,
        private facturerService: FacturerService,
        private sweetAlertService: SweetAlertService,
        private router: Router,
        private modalService:NgbModal,

      ) {}

      montantHoreTaxe: number;
      montantTva: number;
      montantTimbre: number;
      montantTotal: number;
      montantTtc: number;
      clientData: any;
      clientSelected: any;
      clientLoaded: boolean;
      listColis: any;
      dateDebutError: boolean;
      dateFinError: boolean;
      intervalError: boolean;

      dateForm = this.formBuilder.group({
        dateDebut: [, Validators.required],
        dateFin: [, Validators.required],
        clientSelected: [, Validators.required],
        espece: [, Validators.required],
      });

      ngOnInit(): void {
        this.dateForm.get('dateFin').disable();
      }

      compare() {
        let dateDebut = new Date(this.dateForm.get('dateDebut').value);
        let dateFin = new Date(this.dateForm.get('dateFin').value);
        let dateActuel = new Date();
        if (dateDebut > dateActuel) {
          this.dateDebutError = true;
        } else {
          this.dateDebutError = false;
        }
        // if (dateFin > dateActuel) {
        //   this.dateFinError = true;
        // } else {
        //   this.dateFinError = false;
        // }
      }

      enableDisableDatefin() {
        if (this.dateDebutError) {
          this.dateForm.get('dateFin').disable();
        } else {
          this.dateForm.get('dateFin').enable();
        }
      }

      compareToDateDebut() {
        let dateDebut = new Date(this.dateForm.get('dateDebut').value);
        let dateFin = new Date(this.dateForm.get('dateFin').value);

        if (dateDebut > dateFin) {
          this.intervalError = true;
        } else if (
          dateDebut < dateFin &&
          this.dateForm.get('dateDebut').valid &&
          this.dateForm.get('dateFin').valid
        ) {
          this.intervalError = false;
          this._getListClient();
        }
      }

      private _getListClient() {
        this.facturerService
          .getClientsHaveEcommerceZeroShipmentInInterval(
            this.dateForm.get('dateDebut').value,
            this.dateForm.get('dateFin').value
          )
          .subscribe(
            (response) => {
              console.log(
                '🚀 ~ file: facturer.component.ts ~ line 73 ~ FacturerComponent ~ compareToDateDebut ~ response',
                response
              );
              this.clientData = response;
            },
            (error) => {
              this.clientData = [];
            }
          );
      }

      getColisClassicLivrerOfClients() {
        let id = this.dateForm.get('clientSelected').value;
        let client = this.clientData.find((client) => client.client_id == id);
        this.montantHoreTaxe = 0;
        this.facturerService
          .getShipmentEcommerceZeroWithIntervalOfClient(
            this.dateForm.get('clientSelected').value,
            this.dateForm.get('dateDebut').value,
            this.dateForm.get('dateFin').value,
            this.dateForm.get('espece').value
          )
          .subscribe((response) => {
            this.listColis = response[0];
            console.log(
              '🚀 ~ file: facturer.component.ts ~ line 106 ~ FacturerComponent ~ getColisClassicLivrerOfClients ~ response',
              response[1].montantHT
            );
            this.clientSelected = client;
            this.clientLoaded = true;

            this.montantHoreTaxe = response[1].montantHT;
            this.montantTva = response[1].montantTva;
            this.montantTtc = response[1].montantTtc;
            this.montantTimbre = response[1].montantTimbre;
            this.montantTotal = response[1].montantTotal;
          });
      }

      changeClient() {
        this.listColis = [];
        this.clientLoaded = false;
        this.montantHoreTaxe = 0;
        this.clientSelected = {};
        this.dateForm.get('clientSelected').reset();
        this.dateForm.get('espece').reset();
      }

      facturerDetail() {
        this.facturerService
          .facturerShipmentOfClientEcommerceZeroDetail(
            this.dateForm.get('clientSelected').value,
            this.dateForm.get('dateDebut').value,
            this.dateForm.get('dateFin').value,
            this.dateForm.get('espece').value
          )
          .subscribe(
            (response) => {
              this.sweetAlertService.creationSucces('facturer avec succès');
              this.openFile(response, 'application/pdf');
              this.modalService.dismissAll();
            },
            (error) => {
              this.sweetAlertService.creationFailure(error);
            }
          );
      }
      ConfirmDetail() {
        const alertTitle = 'Confirmation de facturation';
        const alertMessage = 'voulez vous confirmez !';
        this.sweetAlertService
          .confirmStandard(alertTitle, alertMessage, '', '', null)
          .then((result) => {
            if (result.isConfirmed) {
              this.facturerDetail();
            }
          });
      }


      facturerSimple() {
        this.facturerService
          .facturerShipmentOfClientEcommerceZeroSimple(
            this.dateForm.get('clientSelected').value,
            this.dateForm.get('dateDebut').value,
            this.dateForm.get('dateFin').value,
            this.dateForm.get('espece').value
          )
          .subscribe(
            (response) => {
              this.sweetAlertService.creationSucces('facturer avec succès');
              this.openFile(response, 'application/pdf');
              this.modalService.dismissAll();
            },
            (error) => {
              this.sweetAlertService.creationFailure(error);
            }
          );
      }
      ConfirmSimplifier() {
        const alertTitle = 'Confirmation de facturation';
        const alertMessage = 'voulez vous confirmez !';
        this.sweetAlertService
          .confirmStandard(alertTitle, alertMessage, '', '', null)
          .then((result) => {
            if (result.isConfirmed) {
              this.facturerSimple();
            }
          });
      }

      openFile(data: any, type: string) {
        let blob = new Blob([data], { type: type });
        let url = window.URL.createObjectURL(blob);
        let pwa = window.open(url);
        if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
          alert('Please disable your pop-up blocker and try again!');
        }
      }


      openModal(content: any) {
        this.modalService.open(content, { backdrop: true, size: 'md',centered:true });
      }
    }

