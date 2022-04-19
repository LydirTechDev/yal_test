
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FacturerService } from './facturer.service';

@Component({
  selector: 'app-facturer',
  templateUrl: './facturer.component.html',
  styleUrls: ['./facturer.component.scss'],
})
export class FacturerComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private facturerService: FacturerService,
    private sweetAlertService: SweetAlertService,
    private router: Router,
  ) {}

  nbrColis: number;
  montantHoreTaxe: number;
  montantTva: number;
  montantTimbre: number;
  montantTotal: number;
  Ttc: number;
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
        this.dateForm.get('dateFin').value
      )
      .subscribe((response) => {
        this.listColis = response;
        console.log(
          '🚀 ~ file: facturer.component.ts ~ line 106 ~ FacturerComponent ~ getColisClassicLivrerOfClients ~ response',
          response
        );
        this.nbrColis = response.length;
        this.clientSelected = client;
        this.clientLoaded = true;
        for (const colis of response) {
          this.montantHoreTaxe = this.montantHoreTaxe + colis.tarifLivraison;
        }
        this.montantTva = (this.montantHoreTaxe * 19) / 100;
        this.Ttc = this.montantHoreTaxe + this.montantTva;
        if (this.dateForm.get('espece').value == 'oui') {
          this.montantTimbre = (this.Ttc * 1) / 100;
          if (this.montantTimbre < 5) {
            this.montantTimbre = 5;
          }
          if (this.montantTimbre > 2500) {
            this.montantTimbre = 2500;
          }
        } else {
          this.montantTimbre = 0;
        }
        this.montantTotal = this.Ttc + this.montantTimbre;
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
    this.listColis[0].montantTotal = this.montantTotal;
    this.listColis[0].espece = this.dateForm.get('espece').value;

    this.facturerService.facturerShipmentOfClient(this.listColis).subscribe(
      (response) => {
        this.sweetAlertService.creationSucces('facturer avec succès');
        this.router.navigateByUrl(`admin/list-facture-non-payer`);
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

}
