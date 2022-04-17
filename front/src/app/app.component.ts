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

  constructor() {}
}
