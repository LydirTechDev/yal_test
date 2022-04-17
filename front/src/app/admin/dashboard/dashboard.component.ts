import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
countUser: number = 0;
  constructor(
    private dashboardService: DashboardService
  ) {
    this.getCountUser()
  }

  // bread crumb items
  breadCrumbItems: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Yalidine' }, { label: 'Tableau de bord', active: true }];
  }
  getCountUser() {
    return this.dashboardService.getCountUser().then((resp: number) => {
      this.countUser = resp
    });
  }

}
