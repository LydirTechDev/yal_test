import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICommune } from 'src/app/admin/commune/i-commune';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { environment } from 'src/environments/environment';
import { IshippmentsClient } from '../../interfaces/ishippments-client';

@Injectable({
  providedIn: 'root'
})
export class ShippmentsClientService {

  observAddShipments = new BehaviorSubject<number>(0);
  observedIndexShipmnet = new BehaviorSubject<number>(0);
  constructor(
    private http: HttpClient
  ) { }


  async findAllWilaya(): Promise<any> {
    return await this.http.get<any>(`${environment.apiV1}wilayas`).toPromise();
  }

  async findCommunByWilayaTypeLivraison(wilayaId: number, livraisonStopDesck: number): Promise<any> {
    return await this.http.post<any>(`${environment.apiV1}communes/communeByWilayaAndTypeLivraison`, { wilayaId: wilayaId, livraisonStopDesck: livraisonStopDesck }).toPromise();
  }

  async findServicesOfUser(): Promise<any> {
    return await this.http.get<any>(`${environment.apiV1}services/findServicesOfUser`).toPromise()
  }

  async getShipment(shipmentId: number) {
    const response = await this.http.get<any>(`${environment.apiV1}shipments/${shipmentId}`).toPromise()
    return response;
  }

 creatShippment(shippment: IshippmentsClient[]): Observable<any> {
    return this.http.post(`${environment.apiV1}shipments`, [shippment]);
  }

  setShipmentsOnPreExpedier(shipmentsId: number[]) {
    return this.http.post(`${environment.apiV1}shipments/setPreExpedition`, shipmentsId, { responseType: 'blob' })
  }


  deleteshipment(shipmentId: number) {
    const response = this.http.delete(`${environment.apiV1}shipments/${shipmentId}`);
    return response;
  }

  updateShipment(shipmentId: number, shipment: any){
    console.log('hakim hakim')
    const response = this.http.patch(`${environment.apiV1}shipments/${shipmentId}`, shipment);
    return response;
  }
  getPaginateColisTracabilite() {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}shipments/paginateColisTracabiliteOfClient`
    );
  }
  funcPaginateColisOfUser(link?: string, page?: number) {
    if (page) {
      link = `${environment.apiV1}shipments/paginateColisTracabiliteOfClient?page=${page}`;
    }
    return this.http.get<Pagination<any>>(link);
  }
  searchColisOfUser(searchColis) {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}shipments/paginateColisTracabiliteOfClient?searchColisTerm=${searchColis}`
    );
  }
  ////////////////////
  getPaginatedShipmentsEnpreparation() {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}shipments/getPaginatedShipmentsEnpreparation`
    );
  }
  funcPaginateColisOfUserEnprepartion(link?: string, page?: number) {
    if (page) {
      link = `${environment.apiV1}shipments/getPaginatedShipmentsEnpreparation?page=${page}`;
    }
    return this.http.get<Pagination<any>>(link);
   }

  searchColisOfUserEnPreparation(searchColis) {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}shipments/getPaginatedShipmentsEnpreparation?searchColisTerm=${searchColis}`
    );
  }
  //////////////
  printBordereau(id: number) {
    return this.http.get(`${environment.apiV1}shipments/printBordereau/${id}`, {
      responseType: 'blob',
    })
  }
  getStatistiqueClient(){
    return this.http.get<any>(`${environment.apiV1}shipments/getStatistiqueClient`).toPromise();
  }
  openFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your pop-up blocker and try again!')
    }
  }

  getCommunsByWilayaId(id: number): Observable<ICommune[]> {
    return this.http.get<ICommune[]>(
      `${environment.apiV1}communes/wilayaId/${id}`
    );
  }

}
