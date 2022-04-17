import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { IWilaya } from './i-wilaya';
import { ICreateWilaya } from './i-create-wilaya';
import { ICommune } from '../commune/i-commune';

@Injectable({
  providedIn: 'root',
})
export class WilayaService {
  constructor(private http: HttpClient) {}

  /**
   * post new wilaya data to Api
   * @param wilaya
   * @returns
   */
  createWilaya(wilaya: ICreateWilaya): Observable<IWilaya> {
    return this.http.post<IWilaya>(`${environment.apiV1}wilayas`, wilaya);
  }
  createWilayaByFile(wilayas: ICreateWilaya[]) {
    return this.http.post<IWilaya[]>(`${environment.apiV1}wilayas/createWilayaByFile`, wilayas);

  }

  /**
   * get all wilaya from api
   * @returns
   */
  getAllWilaya(): Observable<IWilaya[]> {
    return this.http.get<IWilaya[]>(`${environment.apiV1}wilayas`);
  }

  /**
   * function to rewrite
   * same function but not in page
   * getPaginateWilaya
   * funcPaginate
   * searchWilayas
   * @returns
   */
  getPaginateWilaya(): Observable<Pagination<IWilaya>> {
    return this.http.get<Pagination<IWilaya>>(
      `${environment.apiV1}wilayas/paginateWilaya`
    );
  }

  /**
   * function to rewrite
   * same function but not in page
   * getPaginateWilaya
   * funcPaginate
   * searchWilayas
   * @param link
   * @param page
   * @returns
   */
  funcPaginate(
    link?: string,
    page?: number,
    search?: string
  ): Observable<Pagination<IWilaya>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}wilayas/paginateWilaya?page=${page}`;
      return this.http.get<Pagination<IWilaya>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}wilayas/paginateWilaya?searchWilayaTerm=${search}&page=${page}`;
      return this.http.get<Pagination<IWilaya>>(link)
    }
    if (search) {
      return this.http.get<Pagination<IWilaya>>(`${link}&searchWilayaTerm=${search}`);
    }
    return this.http.get<Pagination<IWilaya>>(link);
  }

  /**
   * function to rewrite
   * same function but not in page
   * getPaginateWilaya
   * funcPaginate
   * searchWilayas
   * @param searchWilayaTerm
   * @returns
   */
  searchWilayas(searchWilayaTerm: string) {
    return this.http.get<Pagination<IWilaya>>(
      `${environment.apiV1}wilayas/paginateWilaya?searchWilayaTerm=${searchWilayaTerm}`
    );
  }
  findOneWilaya(id: number): Observable<IWilaya> {
    return this.http.get<IWilaya>(`${environment.apiV1}wilayas/${id}`)
  }
  updateWilaya(id: number, req): Observable<IWilaya> {
    return this.http.patch<IWilaya>(`${environment.apiV1}wilayas/${id}`, req)
  }
  
}
