import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { environment } from 'src/environments/environment';
import { IAgence } from './i-agence';
import { ICreateAgence } from './i-create-agence';

@Injectable({
  providedIn: 'root',
})
export class AgenceService {
  constructor(private http: HttpClient) {}

  /**
   * post new data agence to Api
   * @param agence
   * @returns
   */
  createAgence(agence: ICreateAgence): Observable<IAgence> {
    return this.http.post<IAgence>(`${environment.apiV1}agences`, agence);
  }

  /**
   * get all agences from Api
   * @returns 
   */
  getAllAgences(): Observable<IAgence[]> {
    return this.http.get<IAgence[]>(`${environment.apiV1}agences`);
  }
    /**
   * get all pagianted agences from Api
   * function to rewrite
   * same function but not in page
   * getPaginateAgence
   * funcPaginate
   * searchAgence
   * @returns
   */
  getPaginateAgence(): Observable<Pagination<IAgence>> {
    return this.http.get<Pagination<IAgence>>(
      `${environment.apiV1}agences/paginateAgence`
    );
  }

  /**
   * function to write
   * same function but not in page
   * setPaginateAgence
   * funcPaginate
   * searchAgence
   * @param link
   * @param page
   * @returns
   */
  funcPaginate(
    link?: string,
    page?: number,
    search?: string
  ): Observable<Pagination<IAgence>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}agences/paginateAgencer?page=${page}`;
      return this.http.get<Pagination<IAgence>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}agences/paginateAgence?searchAgenceTerm=${search}&page=${page}`;
      return this.http.get<Pagination<IAgence>>(link)
    }
    if (search) {
      return this.http.get<Pagination<IAgence>>(`${link}&searchAgenceTerm=${search}`);
    }
    return this.http.get<Pagination<IAgence>>(link);
  }

  /**
   * function to write
   * same function but not in page
   * setPaginateAgence
   * funcPaginate
   * searchAgence
   * @param link
   * @param searchAgenceTerm
   * @returns
   */
  searchAgences(searchAgenceTerm: string) {
    return this.http.get<Pagination<IAgence>>(
      `${environment.apiV1}agences/paginateAgence?searchAgenceTerm=${searchAgenceTerm}`
    );
  }
//
  getAgenceById(id: any): Observable<IAgence> {
    return this.http.get<IAgence>(`${environment.apiV1}agences/${id}`)
  }

  updateAgence(id: any, req): Observable<IAgence> {
    return this.http.patch<IAgence>(`${environment.apiV1}agences/${id}`, req)
  }

  async getStationsHubs() {
    return await this.http
      .get<any>(`${environment.apiV1}agences/filterBy?typeAgence=hub`)
      .toPromise();
  }
 async getStationsCentreRetour() {
    return await this.http
      .get<any>(`${environment.apiV1}agences/filterBy?typeAgence=centreRetour`)
      .toPromise();
  }

  createFonctionByFile(fonctions) {
    return this.http.post<any[]>(`${environment.apiV1}fonctions/createFonctionByFile`, fonctions);

  }
}
