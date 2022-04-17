import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination } from '../core/interfaces/paginations/pagination';

@Injectable({
  providedIn: 'root',
})
export class CoursierService {
  constructor(private readonly http: HttpClient) {}

  setStatusShipmentEnAlert(tracking: string, msg: string) {
    return this.http.post(
      `${environment.apiV1}shipments/set-shipment-status-enAlert`,
      {
        tracking: tracking,
        msg: msg,
      }
    );
  }

  setStatusShipmentEchec(tracking: string, msg: string) {
    return this.http.post(
      `${environment.apiV1}shipments/set-shipment-status-echec-livraison`,
      {
        tracking: tracking,
        msg: msg,
      }
    );
  }

  setStatusShipmentLivre(tracking: string) {
    return this.http.post(
      `${environment.apiV1}shipments/set-shipment-status-livre`,
      {
        tracking: tracking,
      }
    );
  }

  getShipmentToBeDelivered() {
    return this.http.get<string[]>(
      `${environment.apiV1}shipments/shipment-of-coursier-a-livrer`
    );
  }

  getShipmentsCoursierReceive(): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.apiV1}shipments/getTracking-coursier-receive`
    );
  }

  receivePackageSlip(selected: string[]) {
    console.log(selected);
    return this.http.post(
      `${environment.apiV1}shipments/receive-shipments-coursier`,
      {
        trackings: selected,
      }
    );
  }
  searchColisCoursierEchecs(searchColis: string) {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}shipments/paginateColisCoursierEchecs?searchColisTerm=${searchColis}`
    );
  }
  funcPaginateColisCoursierEchecs(link: string, page: number) {
  if (page) {
    link = `${environment.apiV1}shipments/paginateColisCoursierEchecs?page=${page}`;
  }
  return this.http.get<Pagination<any>>(link);
  }
  getPaginateColisCoursierEchecs() {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}shipments/paginateColisCoursierEchecs`
    );
  }
  getStatistiqueShipmentCoursier() {
    return this.http.get<any>(
      `${environment.apiV1}shipments/getStatistiqueShipmentCoursier`
    );
  }
}
