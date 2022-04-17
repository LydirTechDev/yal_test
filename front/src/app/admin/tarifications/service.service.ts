import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IZone } from '../zone/i-zone';
import { IPoid } from './i-poid';
import { IService } from './i-service';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  constructor(private http: HttpClient) {}

  /**
   * get all services
   * @returns
   */
  getAllServices(): Observable<IService[]> {
    return this.http.get<IService[]>(
      `${environment.apiV1}services/findAllService`
    );
  }

  /**
   * get count of all services
   * @returns
   */
  getNbServices(): Observable<number> {
    return this.http.get<number>(`${environment.apiV1}services/nbServices`);
  }

  /**
   * get detail for one servcice by id
   * @param serviceId
   * @returns
   */
  getDetailServiceById(serviceId: number): Observable<IService> {
    return this.http.get<IService>(`${environment.apiV1}services/${serviceId}`);
  }

  chekIfServiceExist(serviceName: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${environment.apiV1}services/chekIfServiceExist/${serviceName}`
    );
  }

  getAllZone(): Observable<IZone[]> {
    return this.http.get<IZone[]>(`${environment.apiV1}zones`);
  }

  getAllPoids(): Observable<IPoid[]> {
    return this.http.get<IPoid[]>(`${environment.apiV1}poids`);
  }

  createNewTarification(newTarification: any) {
    return this.http.post<any>(
      `${environment.apiV1}code-tarif/create-new-tarification`,
      newTarification
    );
  }
}
