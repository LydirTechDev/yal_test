import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FacturerService } from '../facturer.service';


@Component({
  selector: 'app-facturer-classique',
  templateUrl: './facturer-classique.component.html',
  styleUrls: ['./facturer-classique.component.scss'],
})
export class FacturerClassiqueComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private facturerService: FacturerService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {}

  nbrColis: number;
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
      .getClientsHaveClassicShipmentInInterval(
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
    console.log(
      '🚀 ~ file: facturer.component.ts ~ line 106 ~ FacturerComponent ~ getColisClassicLivrerOfClients ~ clientData',
      this.clientData
    );
    console.log(
      '🚀 ~ file: facturer.component.ts ~ line 106 ~ FacturerComponent ~ getColisClassicLivrerOfClients ~ client',
      client
    );
    this.montantHoreTaxe = 0;
    this.facturerService
      .getShipmentClassicWithIntervalOfClient(
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
    this.nbrColis = 0;
    this.listColis = [];
    this.clientLoaded = false;
    this.montantHoreTaxe = 0;
    this.clientSelected = {};
    this.dateForm.get('clientSelected').reset();
    this.dateForm.get('espece').reset();
  }

  facturer() {
    this.facturerService
      .facturerShipmentOfClient(
        this.dateForm.get('clientSelected').value,
        this.dateForm.get('dateDebut').value,
        this.dateForm.get('dateFin').value,
        this.dateForm.get('espece').value
      )
      .subscribe(
        (response) => {
          this.sweetAlertService.creationSucces('facturer avec succès');
          this.openFile(response, 'application/pdf');
          this.router.navigateByUrl(`finance/list-facture-non-payer`);
        },
        (error) => {
          this.sweetAlertService.creationFailure(error);
        }
      );
  }
  Confirm() {
    const alertTitle = 'Confirmation de facturation';
    const alertMessage = 'voulez vous confirmez !';
    this.sweetAlertService
      .confirmStandard(alertTitle, alertMessage, '', '', null)
      .then((result) => {
        if (result.isConfirmed) {
          this.facturer();
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
}
