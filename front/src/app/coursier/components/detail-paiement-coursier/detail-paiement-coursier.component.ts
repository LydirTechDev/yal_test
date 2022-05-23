import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { CoursierService } from '../../coursier.service';

@Component({
  selector: 'app-detail-paiement-coursier',
  templateUrl: './detail-paiement-coursier.component.html',
  styleUrls: ['./detail-paiement-coursier.component.scss']
})
export class DetailPaiementCoursierComponent implements OnInit {

  route: ActivatedRouteSnapshot;
  listShipmentsDetail = []
  constructor(
    _route: ActivatedRoute,
    // private location: Location,
    private router: Router,
    private coursierService: CoursierService,
    private sweetAlertService: SweetAlertService,
  ) {
    this.route = _route.snapshot;
  }

  ngOnInit(): void {
    //  console.log('eeeeeeeeeeeeeeeeeeeee', this.route.params.id)
    this.coursierService
      .getPaiementDetailsCoursier(this.route.params.id)
      .subscribe((resp) => {
        this.listShipmentsDetail = resp
        console.log("🚀 ~ file: detail-paiement.component.ts ~ line 27 ~ DetailPaiementComponent ~ .subscribe ~ resp", resp)
      },
      (error) => {
        this.sweetAlertService.basicWarning(error.response.error)
      }
      )
  }

}
