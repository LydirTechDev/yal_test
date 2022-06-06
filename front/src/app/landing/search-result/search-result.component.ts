import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  dataLoaded = false;
  route: ActivatedRouteSnapshot;
  detailColis = [];
  trueFalse = {
    true: 'Oui',
    false: 'Non'
  }
  constructor(
    private router: Router,
    private sharedService: SharedService,
    private sweetAlertService: SweetAlertService,
    _route: ActivatedRoute,
  ) { 
    this.route = _route.snapshot;

  }

  ngOnInit(): void {
    this.sharedService.SearchTrackingPublic(this.route.params.tracking).then(resp => {
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
            this.redirectTo('')
          })

      }
    })
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }
}
