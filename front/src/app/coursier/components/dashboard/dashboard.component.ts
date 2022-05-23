import { Component, OnInit } from '@angular/core';
import { CoursierService } from '../../coursier.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statistique: any = {};

  constructor(
    private coursierService: CoursierService
  ) { }

  ngOnInit(): void {
    this.getStatistiqueShipmentCoursier();
  }
  getStatistiqueShipmentCoursier() {
    return this.coursierService
      .getStatistiqueShipmentCoursier()
      .subscribe((resp) => {
        this.statistique = resp;
      });
  }

}
