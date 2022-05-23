import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FinanceService } from '../../finance.service';
import { IClient } from '../../i-client';

@Component({
  selector: 'app-proceder-paiements',
  templateUrl: './proceder-paiements.component.html',
  styleUrls: ['./proceder-paiements.component.scss'],
})
export class ProcederPaiementsComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  nbClients: number;
  totalRamasse: number;
  netClient: number;
  gain: number;
  listClients = [];
  formData: FormGroup;

  constructor(
    private readonly financeService: FinanceService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    /**
    inits
    */
    this.formData = new FormGroup({
      client: new FormControl(),
    });

    this.getSoldeAgence();
  }

  selectClient() {
    this.router.navigate([
      `finance/proceder-paiement/${this.formData.get('client').value}`,
    ]);
  }
  getSoldeAgence() {
    this.financeService.getSoldeAgence().subscribe((response) => {
      console.log(
        '🚀 ~ file: proceder-paiements.component.ts ~ line 35 ~ ProcederPaiementsComponent ~ this.financeService.getSoldeAgence ~ response',
        response
      );
      this.listClients = response['listClients'];
      this.nbClients = response['listClients'].length;
      this.totalRamasse = response['totalRamasse'];
      this.netClient = response['netClient'];
      this.gain = response['gain'];
    });
  }
}
