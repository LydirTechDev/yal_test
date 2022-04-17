import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { environment } from 'src/environments/environment';
import { ICreateRotation } from './i-create-rotation';
import { IRotation } from './i-rotation';

@Injectable({
  providedIn: 'root',
})
export class RotationService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @returns
   */
  getAllRotations(): Promise<any[]> {
    return this.http.get<any[]>(`${environment.apiV1}rotations`).toPromise();
  }

  /**
   * get all pagianted rotations from Api
   * function to rewrite
   * same function but not in page
   * getPaginateRotations
   * funcPaginate
   * searchRotations
   * @returns
   */
  getPaginateRotations(): Observable<Pagination<IRotation>> {
    return this.http.get<Pagination<IRotation>>(
      `${environment.apiV1}rotations/paginateRotation`
    );
  }

  /**
   * function to write
   * same function but not in page
   * setPaginateRotations
   * funcPaginate
   * searchRotations
   * @param link
   * @param searchAgenceTerm
   * @returns
   */
  searchRotations(
    searchRotationTerm: string
  ): Observable<Pagination<IRotation>> {
    return this.http.get<Pagination<IRotation>>(
      `${environment.apiV1}rotations/paginateRotation?searchRotationTerm=${searchRotationTerm}`
    );
  }

  /**
   * function to write
   * same function but not in page
   * setPaginateRotations
   * funcPaginate
   * searchRotations
   * @param link
   * @param page
   * @returns
   */
  funcPaginate(
    link?: string,
    page?: number,
    search?: string
  ): Observable<Pagination<IRotation>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}rotations/paginateRotation?page=${page}`;
      return this.http.get<Pagination<IRotation>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}rotations/paginateRotation?searchRotationTerm=${search}&page=${page}`;
      return this.http.get<Pagination<IRotation>>(link)
    }
    if (search) {
      return this.http.get<Pagination<IRotation>>(`${link}&searchRotationTerm=${search}`);
    }
    return this.http.get<Pagination<IRotation>>(link);
  }


  /**
   * create new rotation
   * @param rotation
   * @returns
   */
  createRotation(rotation: ICreateRotation): Observable<any> {
    return this.http.post<ICreateRotation>(
      `${environment.apiV1}rotations`,
      rotation
    );
  }
  //
  createRotationByFile(rotationsList: ICreateRotation[]) {
    console.log("🚀 ~ file: rotation.service.ts ~ line 89 ~ RotationService ~ createRotationByFile ~ rotationsList", rotationsList)

    return this.http.post<ICreateRotation[]>(
      `${environment.apiV1}rotations/createRotationsByFile`, 
      rotationsList
    );
  }
  //
  getRotationById(id: number): Observable<IRotation> {
    return this.http.get<IRotation>(`${environment.apiV1}rotations/${id}`);
  }

  updateRotation(id: number, updateRotation): Observable<IRotation> {
    return this.http.patch<IRotation>(`${environment.apiV1}rotations/${id}`, updateRotation)
  }

  pars(termToSearch: string) {
    return this.http.get(`${environment.apiV1}rotations/download?term=${termToSearch}`, { responseType: 'blob' });
  }
}
