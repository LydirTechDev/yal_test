import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { FinanceService } from '../../finance.service';

@Component({
  selector: 'app-info-recolte',
  templateUrl: './info-recolte.component.html',
  styleUrls: ['./info-recolte.component.scss']
})
export class InfoRecolteComponent implements OnInit {

  route: ActivatedRouteSnapshot;
  listShipmentsDetail = []
  createdBy = null;
  date = null;
  somme = null;
  constructor(
    _route: ActivatedRoute,
    // private location: Location,
    private router: Router,
    private financeService: FinanceService,
    private sweetAlertService: SweetAlertService,
  ) {
    this.route = _route.snapshot;
  }

  ngOnInit(): void {
    //  console.log('eeeeeeeeeeeeeeeeeeeee', this.route.params.id)
    this.financeService
      .getRecolteDetail(this.route.params.id)
      .subscribe((resp) => {
        this.listShipmentsDetail = resp[1]
        this.createdBy = resp[0].createdBy.employe.nom + ' ' +resp[0].createdBy.employe.prenom;
        this.date = resp[0].createdAt;
        console.log("🚀 ~ file: detail-paiement.component.ts ~ line 27 ~ DetailPaiementComponent ~ .subscribe ~ resp", resp)
      },
        (error) => {
          this.sweetAlertService.basicWarning(error.response.error)
        }
      )
  }

}
