import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  searchForm: FormGroup;
  isCollapsed: boolean = false;
  constructor(
    private router: Router,
    private sweetAlertService: SweetAlertService,

  ) {
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      search: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])),
    })
  }
  searchTracking() {
    const tracking: string = this.searchForm.value['search']
    console.log("🚀 ~ file: topbar.component.ts ~ line 138 ~ TopbarComponent ~ searchTracking ~ tracking", tracking)
    const express_reg = new RegExp(/^\d{8}$/i);
    if (tracking == null) {
      this.sweetAlertService.sipmleAlert("warning", "Oops! champ vide", "Veillez completer le champ")
    }
    else if (express_reg.test(tracking)) {
      this.redirectTo(`/suivre/${tracking}`)
    } else {
      this.sweetAlertService.sipmleAlert("warning", "Tracking erroné", "Verifiez le format de tracking")
    }
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }
}
