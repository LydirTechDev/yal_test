import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


import { environment } from '../../../../environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
// import { LanguageService } from 'src/app/core/services/language.service';
// import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  searchForm: FormGroup;
  username: string;
  element: any;
  configData: any;
  cookieValue;
  flagvalue;
  countryName;
  valueset: string;

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  // tslint:disable-next-line: max-line-length
  constructor(@Inject(DOCUMENT) private document: any,
   private router: Router,
   private authService: AuthService,
   private sweetAlertService: SweetAlertService,
  // public languageService: LanguageService,
  public cookiesService: CookieService) {
    this.searchForm = new FormGroup({
      search: new FormControl(),
    })
   }

  @Output() mobileMenuButtonClicked = new EventEmitter();
  @Output() settingsButtonClicked = new EventEmitter();

  ngOnInit(): void {
    this.username = this.authService.currentUser.email;
    this.element = document.documentElement;
    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    };

    this.cookieValue = this.cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  /**
   * Translate language
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    // this.languageService.setLanguage(lang);
  }


  /**
   * Logout the user
   */
  logout() {
    this.authService.logout();
  }
  searchTracking() {
    const tracking: string = this.searchForm.value['search']
    console.log("🚀 ~ file: topbar.component.ts ~ line 138 ~ TopbarComponent ~ searchTracking ~ tracking", tracking)
    const express_reg = new RegExp(/^\d{8}$/i);
    if (tracking == null){
      this.sweetAlertService.sipmleAlert("warning","Oops! champ vide", "Veillez completer le champ")
    }
    else if (express_reg.test(tracking)) {
      this.redirectTo(`recherche/${tracking}`)
    }else {
      this.sweetAlertService.sipmleAlert("warning","Tracking erroné","Verifiez le format de tracking")
    }
  }
  // async searchTracking() {
  //   this.layoutService.SearchTracking(this.searchForm.value['search']).subscribe(resp => {
  //     if (resp) {
  //       console.log(resp);
  //       this.detailColis = resp

  //       this.open(this.content)
  //     }
  //   })

  // }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }
}
