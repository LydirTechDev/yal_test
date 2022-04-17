import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { environment } from 'src/environments/environment';
import { ICommune } from './i-commune';
import { ICreateCommune } from './i-create-commune';
@Injectable({
  providedIn: 'root',
})
export class CommuneService {
  constructor(private http: HttpClient) {}

  /**
   * post new commune data to Api
   * @param commune
   * @returns
   */
  createCommune(commune: ICreateCommune): Observable<ICommune> {
    return this.http.post<ICommune>(`${environment.apiV1}communes`, commune);
  }
  createCommuneByFile(commune: ICreateCommune[]) {
    return this.http.post<ICommune[]>(`${environment.apiV1}communes/createCommuneByFile`, commune);

  }
  /**
   * get all communes from Api
   * @returns
   */
  getAllCommunes(): Observable<ICommune[]> {
    return this.http.get<ICommune[]>(`${environment.apiV1}communes`);
  }

  /**
   * get communes by id wilaya
   * @param id
   * @returns
   */
  getCommunsByWilayaId(id: number): Observable<ICommune[]> {
    return this.http.get<ICommune[]>(
      `${environment.apiV1}communes/wilayaId/${id}`
    );
  }
  
  /**
   * get all pagianted communes from Api
   * function to rewrite
   * same function but not in page
   * getPaginateCommune
   * funcPaginate
   * searchCommune
   * @returns
   */
  getPaginateCommune(): Observable<Pagination<ICommune>> {
    return this.http.get<Pagination<ICommune>>(
      `${environment.apiV1}communes/paginateCommune`
    );
  }

  /**
   * function to write
   * same function but not in page
   * setPaginateCommune
   * funcPaginate
   * searchCommune
   * @param link
   * @param page
   * @returns
   */
  funcPaginate(
    link?: string,
    page?: number,
    search?: string
  ): Observable<Pagination<ICommune>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}communes/paginateCommune?page=${page}`;
      return this.http.get<Pagination<ICommune>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}communes/paginateCommune?searchCommuneTerm=${search}&page=${page}`;
      return this.http.get<Pagination<ICommune>>(link)
    }
    if (search) {
      return this.http.get<Pagination<ICommune>>(`${link}&searchCommuneTerm=${search}`);
    }
    return this.http.get<Pagination<ICommune>>(link);
  }

  /**
   * function to write
   * same function but not in page
   * setPaginateCommune
   * funcPaginate
   * searchCommune
   * @param link
   * @param searchCommuneTerm
   * @returns
   */
  searchCommunes(searchCommuneTerm: string) {
    return this.http.get<Pagination<ICommune>>(
      `${environment.apiV1}communes/paginateCommune?searchCommuneTerm=${searchCommuneTerm}`
    );
  }
  //
  getCommuneById(id: number): Observable<ICommune> {
    return this.http.get<ICommune>(`${environment.apiV1}communes/${id}`);
  }

  updateCommune(id: any, req): Observable<ICommune> {
    return this.http.patch<ICommune>(`${environment.apiV1}communes/${id}`, req)
  }
}
