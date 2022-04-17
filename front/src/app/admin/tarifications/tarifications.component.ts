import { Component, OnInit } from '@angular/core';
import { TarificationService } from './tarification.service';

@Component({
  selector: 'app-tarifications',
  templateUrl: './tarifications.component.html',
  styleUrls: ['./tarifications.component.scss'],
})
export class TarificationsComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  constructor(public tarificationService: TarificationService) {
    // window.addEventListener('keyup', disableF5);
    // window.addEventListener('keydown', disableF5);

    // function disableF5(e) {
    //   if ((e.which || e.keyCode) == 116) e.preventDefault();
    // }

    // window.addEventListener('beforeunload', function (e) {
    //   var confirmationMessage = 'o/';
    //   console.log('cond');
    //   e.returnValue = confirmationMessage;
    //   return confirmationMessage;
    // });
  }

  ngOnInit(): void {
    this.breadCrumbItems = [];
  }
}
