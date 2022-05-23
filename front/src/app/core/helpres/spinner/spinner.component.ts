import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  showSpinner = false;

  constructor(private spinnerService: SpinnerService, private cdRef: ChangeDetectorRef) {
  }
  ngOnInit() {
    this.init();
  }

  init() {

    this.spinnerService.getSpinnerObserver().subscribe((status) => {
    console.log("🚀 ~ file: spinner.component.ts ~ line 22 ~ SpinnerComponent ~ this.spinnerService.getSpinnerObserver ~ status", status)
      
      this.showSpinner = (status === 'start');
      this.cdRef.detectChanges();
    });
  }

}