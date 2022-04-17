import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservedValueOf } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { environment } from 'src/environments/environment';
import { ICreateZone } from './i-create-zone';
import { IZone } from './i-zone';

@Injectable({
  providedIn: 'root',
})
export class ZoneService {
  constructor(private http: HttpClient) {}

  craeteZone(zone: ICreateZone): Observable<IZone> {
    return this.http.post<IZone>(`${environment.apiV1}zones`, zone);
  }

  getAllZones(): Observable<IZone[]> {
    return this.http.get<IZone[]>(`${environment.apiV1}zones`);
  }

  getPaginateZones(): Observable<Pagination<IZone>> {
    return this.http.get<Pagination<IZone>>(
      `${environment.apiV1}zones/paginateZone`
    );
  }
  /**
   * function to write
   * same function but not in page
   * setPaginateZone
   * funcPaginate
   * searchZone
   * @param link
   * @param page
   * @returns
   */
  funcPaginate(
    link?: string,
    page?: number,
    search?: string
  ): Observable<Pagination<IZone>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}zones/paginateZone?page=${page}`;
      return this.http.get<Pagination<IZone>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}zones/paginateZone?searchZoneTerm=${search}&page=${page}`;
      return this.http.get<Pagination<IZone>>(link)
    }
    if (search) {
      return this.http.get<Pagination<IZone>>(`${link}&searchZoneTerm=${search}`);
    }
    return this.http.get<Pagination<IZone>>(link);
  }

  /**
   * function to write
   * same function but not in page
   * setPaginateZone
   * funcPaginate
   * searchZone
   * @param link
   * @param searchZoneTerm
   * @returns
   */
  searchZones(searchZoneTerm: string) {
    return this.http.get<Pagination<IZone>>(
      `${environment.apiV1}zones/paginateZone?searchZoneTerm=${searchZoneTerm}`
    );
  }
}
