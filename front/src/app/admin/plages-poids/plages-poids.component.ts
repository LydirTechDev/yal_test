import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-plages-poids',
  templateUrl: './plages-poids.component.html',
  styleUrls: ['./plages-poids.component.scss']
})
export class PlagesPoidsComponent implements OnInit {

  constructor() { }

  pricevalue = 5;
  min = 10;
  max = 20;

  priceoption: Options = {
    floor: 0,
    ceil: 150,
    translate: (value: number): string => {
      return ''+value;
    },
  };


  ngOnInit(): void {
  }


  /***
   * slider change fetch the record
   */
   valueChange(value: number, boundary: boolean): void {
    if (boundary) {
      this.min = value;
    } else {
      this.max = value;
    }
  }

}
