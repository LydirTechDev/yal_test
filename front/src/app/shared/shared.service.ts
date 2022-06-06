
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor(private httpClient: HttpClient,) { }

  async SearchTracking(tracking: string) {
    const express_reg = new RegExp(/^\d{8}$/, 'i');
    tracking.match(express_reg);
    if (express_reg.test(tracking)) {
      return await this.httpClient.get<object[]>(`${environment.apiV1}shipments/searchTracking/${tracking}`).toPromise()
    }
  }
  async SearchTrackingPublic(tracking: string) {
    const express_reg = new RegExp(/^\d{8}$/, 'i');
    tracking.match(express_reg);
    if (express_reg.test(tracking)) {
      return await this.httpClient.get<object[]>(`${environment.apiV1}PublicRessources/searchTracking/${tracking}`).toPromise()
    }
  }
}
