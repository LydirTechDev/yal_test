import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination } from '../core/interfaces/paginations/pagination';
import { User } from '../core/models/user';

@Injectable({
  providedIn: 'root',
})
export class ServiceClientService {
  constructor(private readonly http: HttpClient) {}

  async findServicesOfUser(): Promise<any> {
    return await this.http
      .get<any>(`${environment.apiV1}services/findServicesOfUser`)
      .toPromise();
  }
  async findAllWilaya(): Promise<any> {
    return await this.http.get<any>(`${environment.apiV1}wilayas`).toPromise();
  }
  async findCommunByWilayaTypeLivraison(wilayaId: number): Promise<any> {
    return await this.http
      .post<any>(
        `${environment.apiV1}communes/communeByWilayaAndTypeLivraison`,
        { wilayaId: wilayaId, livraisonStopDesck: false }
      )
      .toPromise();
  }

  getPaginateShipments(): Observable<Pagination<any>> {
    return this.http.get<Pagination<any>>(`${environment.apiV1}shipments/paginateAllShipments-Cs`)
  }

  searchShipments(searchShipmentsTerm: string): Observable<Pagination<any>> {
    return this.http.get<Pagination<any>>(`${environment.apiV1}shipments/paginateAllShipments-Cs?searchShipmentsTerm=${searchShipmentsTerm}`)
  }
  funcPaginate(
    link?: string,
    page?: number,
    search?: string
  ): Observable<Pagination<any>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}shipments/paginateAllShipments-Cs?page=${page}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}shipments/paginateAllShipments-Cs?searchShipmentTerm=${search}&page=${page}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (search) {
      return this.http.get<Pagination<any>>(`${link}&searchShipmentTerm=${search}`);
    }
    return this.http.get<Pagination<any>>(link);
  }

  ExportToExcel(termToSearch: string) {
    return this.http.get(`http://localhost:3000/shipments/download?term=${termToSearch}`, { responseType: 'blob' });
  }

  printBordereau(id: number) {
    return this.http.get(`${environment.apiV1}shipments/printBordereau/${id}`, {
      responseType: 'blob',
    });
  }
  getEstimateTarif(value: any) {
    return this.http.post<any>(
      `${environment.apiV1}service-client/estimate-tarif`,
      value
    );
  }

  createShipmentClassique(shipment: any) {
    console.log(
      '🚀 ~ ***************************************************************************~ line 36 ~ ServiceClientService ~ createShipment ~ shipment',
      shipment
    );
    return this.http.post(
      `${environment.apiV1}service-client/create-shipment-classique`,
      shipment,
      { responseType: 'blob' }
    );
  }

  createShipmentRetraitCahierDeCharge(shipment: any) {
    console.log(
      '🚀 ~ ***************************************************************************~ line 36 ~ ServiceClientService ~ createShipment ~ shipment',
      shipment
    );
    return this.http.post(
      `${environment.apiV1}service-client/create-shipment-retrait-cahier-de-charge`,
      shipment,
      { responseType: 'blob' }
    );
  }

  createShipmentSoumission(shipment: any) {
    console.log(
      '🚀 ~ ***************************************************************************~ line 36 ~ ServiceClientService ~ createShipment ~ shipment',
      shipment
    );
    return this.http.post(
      `${environment.apiV1}service-client/create-shipment-soumission`,
      shipment,
      { responseType: 'blob' }
    );
  }

  getRecoltesCsInformation() {
    return this.http.get<any>(
      `${environment.apiV1}shipments/getRecoltesCsInformation`
    );
  }

  validateReceptionRecolte(id: number) {
    return this.http.post(
      `${environment.apiV1}recoltes`,
      { id: id },
      { responseType: 'blob' }
    );
  }

  createRecolteCs() {
    return this.http.post(
      `${environment.apiV1}recoltes/createRecolteCs`,
      {},
      { responseType: 'blob' }
    );
  }

  getPaginateRecolteTracabilite() {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}recoltes/paginateRecolteOfUserCs`
    );
  }
  funcPaginateRecolteOfUser(link: string, page: number) {
    if (page) {
      link = `${environment.apiV1}recoltes/paginateRecolteOfUserCs?page=${page}`;
    }
    return this.http.get<Pagination<any>>(link);
  }

  searchRecolteOfUser(searchRecolte: string) {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}recoltes/paginateRecolteOfUserCs?searchRecolteTerm=${searchRecolte}`
    );
  }
  printRecolte(id: number, typeRtc: string) {
    return this.http.get(
      `${environment.apiV1}recoltes/printRecolte/${id}/${typeRtc}`,
      {
        responseType: 'blob',
      }
    );
  }
}

