import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ManagerService } from '../../manager.service';

@Component({
  selector: 'app-statistique-par-status-finance',
  templateUrl: './statistique-par-status-finance.component.html',
  styleUrls: ['./statistique-par-status-finance.component.scss']
})
export class StatistiqueParStatusFinanceComponent implements OnInit {
  statistique = {
    total: 0,
    livre: 0,
    preRecolte: 0,
    recolte: 0,
    pretAPayer: 0,
    payer: 0,
    retourRetire: 0,
    mantantLivraison: 0,
    mantantRetour: 0,
    totalFraiCOD: 0,
    nbrColisCOD: 0,
    recouvrement: 0,

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
  ) { }

  ngOnInit(): void {
    this.dateForm.get('dateFin').disable();
    this.getStatistiquesStatusFinancieres()
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
    this.getStatistiquesStatusFinancieres()
  }
  private _getListStationOperation() {
    this.managerService.getListStationOperation().subscribe(resp => {
      this.StationData = resp
    })
  }
  getStatistiquesStatusFinancieres() {
    this.managerService
      .getStatistiquesStatusFinancieres(
        this.dateForm.get('stationSelected').value,
        this.dateForm.get('dateDebut').value,
        this.dateForm.get('dateFin').value,
      ).subscribe(resp => {
        this.statistique = resp
        console.log(resp)
      })
  }
}
