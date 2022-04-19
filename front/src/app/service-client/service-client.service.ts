import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
}
