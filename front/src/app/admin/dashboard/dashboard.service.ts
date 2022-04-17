import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) { }

  getCountUser() {
   return this.http.get(`${environment.apiV1}users/getCountUser`).toPromise()
  }
}
