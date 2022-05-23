import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ManagerService } from '../../manager.service';

@Component({
  selector: 'app-statistique-par-status-ops',
  templateUrl: './statistique-par-status-ops.component.html',
  styleUrls: ['./statistique-par-status-ops.component.scss']
})
export class StatistiqueParStatusOpsComponent implements OnInit {
  statistique = {
    total: 0,
    livre: 0,
    echecLivraison: 0,
    tentativeEchouee: 0,
    sortiEnLivraison: 0,
    enPreparation: 0,
    presExpidier: 0,
    expidier: 0,
    transfert: 0,
    centre: 0,
    versWilaya: 0,
    recuWilaya: 0,
    versAgence: 0,
    recuAgence: 0,
    retourVersCentre: 0,
    retourneAuCentre: 0,
    retourVersWilaya: 0,
    retourRecuWilaya: 0,
    retourVersAgence: 0,
    retourRecuAgence: 0,
    retourARetirer: 0,
    retourRetire: 0,
  };
  StationData: any;
  dateDebutError: boolean;
  dateFinError: boolean;
  intervalError: boolean;
  dateForm = this.formBuilder.group({
    dateDebut: [new Date().toDateString(), Validators.required],
    dateFin: [new Date().toDateString(), Validators.required],
    stationSelected: ['all', Validators.required],
  });
  constructor(
    private formBuilder: FormBuilder,
    private managerService: ManagerService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dateForm.get('dateFin').disable();
    this.getStatistiquesStatusOPs();
    this._getListStationOperation();

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
    if (dateFin > dateActuel) {
      this.dateFinError = true;
    } else {
      this.dateFinError = false;
    }
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
      dateDebut <= dateFin &&
      this.dateForm.get('dateDebut').valid &&
      this.dateForm.get('dateFin').valid
    ) {
      this.intervalError = false;
    }
  }

  changeStation() {
    this.getStatistiquesStatusOPs()
  }
  private _getListStationOperation() {
    this.managerService.getListStationOperation().subscribe(resp => {
      this.StationData = resp
    })
  }
  getStatistiquesStatusOPs() {
    this.managerService
      .getStatistiquesStatusOPs(
        this.dateForm.get('stationSelected').value,
        this.dateForm.get('dateDebut').value,
        this.dateForm.get('dateFin').value,
      ).subscribe(resp => {
        this.statistique = resp
        console.log(resp)
      })
  }
}
