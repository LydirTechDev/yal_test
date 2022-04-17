import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {



  constructor(private readonly http: HttpClient) { }
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
      `${environment.apiV1}shipments/shimentStopDeskALivrer`
    );
  }
//

  searchColisStopDeskEchecs(searchColis: string) {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}shipments/paginateColisStopDeskEchecs?searchColisTerm=${searchColis}`
    );
  }
  funcPaginateColisStopDeskEchecs(link: string, page: number) {
    if (page) {
      link = `${environment.apiV1}shipments/paginateColisStopDeskEchecs?page=${page}`;
    }
    return this.http.get<Pagination<any>>(link);
  }
  getPaginateColisStopDeskEchecs() {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}shipments/paginateColisStopDeskEchecs`
    );
  }

}
