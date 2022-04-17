import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { ICoursier } from 'src/app/operations/components/shipments/affecter-au-coursier/i-coursier';
import { environment } from 'src/environments/environment';
import { IAgence } from '../agence/i-agence';
import { IClient } from '../clients/i-client';

@Injectable({
  providedIn: 'root'
})
export class CoursierService {

  constructor(
    private http:HttpClient
  ) { }


  createCoursier(coursier:ICoursier):Observable<ICoursier>{
    return this.http.post<ICoursier>(`${environment.apiV1}coursier`, coursier)
  }

  getAllcoursiers():Promise<any[]>{
    return this.http.get<any[]>(`${environment.apiV1}coursier`).toPromise()
  }

  getPaginateCoursier():Observable<Pagination<ICoursier>>{
    return this.http.get<Pagination<ICoursier>>(`${environment.apiV1}coursier/paginateCoursier`)
  }

  searchCoursier(searchCoursierTerm:string):Observable<Pagination<ICoursier>>{
    return this.http.get<Pagination<ICoursier>>( `${environment.apiV1}coursier/paginateCoursier?searchCoursierTerm=${searchCoursierTerm}`)
  }


  funcPaginate(
    link?:string,
    page?:number,
    search?: string
  ):Observable<Pagination<ICoursier>>{
    if (page && search == undefined){
      link = `${environment.apiV1}coursier/paginateCoursier?page=${page}`;
      return this.http.get<Pagination<ICoursier>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}coursier/paginateCoursier?searchCoursierTerm=${search}&page=${page}`;
      return this.http.get<Pagination<ICoursier>>(link)
    }
    if(search){
      return this.http.get<Pagination<ICoursier>>(`${link}&searchCoursierTerm=${search}`);
      }
      return this.http.get<Pagination<ICoursier>>(link);
  }

    /**
   * get all agences from Api
   * @returns
   */
     getAllAgences(): Observable<IAgence[]> {
      return this.http.get<IAgence[]>(`${environment.apiV1}agences`);
    }

    getOneCoursierById(id:number): Observable<ICoursier>{
      return this.http.get<ICoursier>(`${environment.apiV1}coursier/${id}`)
    }


    updateCoursier(id:number,updateCoursier:any):Observable<ICoursier>{
      return this.http.patch<ICoursier>(`${environment.apiV1}coursier/${id}`,updateCoursier)
    }

      updateActivityCoursier(id:number,valueActive:any):Observable<IClient>{
        return this.http.patch<IClient>(`${environment.apiV1}coursier/${id}/setActivity`,valueActive)
    }

}
