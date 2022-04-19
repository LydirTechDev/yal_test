import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JWTTokenService } from './core/services/jwt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'yalidine';

  constructor() {
    const userAgent = window.navigator.userAgent;
    if (
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      console.log(
        '--------------------------------------- MOBILE ---------------------------------------'
      );
    } else {
      console.log(
        '########################################## WEB ##########################################'
      );
    }
    console.log(userAgent);
  }
}
