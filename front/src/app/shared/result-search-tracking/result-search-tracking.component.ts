import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-result-search-tracking',
  templateUrl: './result-search-tracking.component.html',
  styleUrls: ['./result-search-tracking.component.scss']
})
export class ResultSearchTrackingComponent implements OnInit {
  dataLoaded = false;
  route: ActivatedRouteSnapshot;
  detailColis = [];
  trueFalse = {
    true: 'Oui',
    false: 'Non'
  }
  constructor(
    private sharedService: SharedService,
    private location: Location,
    private sweetAlertService: SweetAlertService,
    private authService: AuthService,
    _route: ActivatedRoute,

  ) {
    this.route = _route.snapshot;
  }

  ngOnInit(): void {
    this.sharedService.SearchTracking(this.route.params.tracking).then(resp => {
      console.log("🚀 ~ file: result-search-tracking.component.ts ~ line 31 ~ ResultSearchTrackingComponent ~ this.sharedService.SearchTracking ~ resp", resp)
      if (resp) {
        this.dataLoaded = true
        this.detailColis = resp
        for (const key in resp) {
          this.detailColis.push(key)
        }
      }
      else {
        this.sweetAlertService.sipmleAlertConfirme('info', 'Opps! pas de colis', ' Verifiez le tracking recherché')
          .then(resp => {
            this.location.back()
          })

      }
    })
  }
  isClient(): boolean {
    if (this.authService.currentUser['typeUser'] === '1976729') {
      return true;
    }
    return false;
  }
  isCoursier(): boolean {
    if (this.authService.currentUser['typeUser'] === '42659985') {
      return true;
    }
    return false;
  }

}
