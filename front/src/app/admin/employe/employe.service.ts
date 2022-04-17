import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { environment } from 'src/environments/environment';
import { IAgence } from '../agence/i-agence';
import { IBanque } from './i-banque';
import { IDepartement } from './i-departement';
import { IEmploye } from './i-employe';
import { IFonction } from './i-fonction';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {

  constructor(private http:HttpClient) { }

  createEmploye(employe:IEmploye):Observable<IEmploye>{
    return this.http.post<IEmploye>(`${environment.apiV1}employes`, employe)
  }

  getAllEmployes():Promise<any[]>{
    return this.http.get<any[]>(`${environment.apiV1}employes`).toPromise()
  }

  getOneEmployeById(id:number):Observable<IEmploye>{
    return this.http.get<IEmploye>(`${environment.apiV1}employes/${id}`)
  }

  getAllAgences(): Observable<IAgence[]> {
    return this.http.get<IAgence[]>(`${environment.apiV1}agences`);
  }

  getAllDepartement():Observable<IDepartement[]>{
    return this.http.get<IDepartement[]>(`${environment.apiV1}departements`)
  }

  getFonctionByDepartementId(departementId:number):Observable<IFonction[]>{
    return this.http.get<IFonction[]>(`${environment.apiV1}fonctions/departement/${departementId}`)
  }

  getAllBanques():Observable<IBanque[]>{
    return this.http.get<IBanque[]>(`${environment.apiV1}banques`)
  }


  getPaginateEmploye():Observable<Pagination<IEmploye>>{
    return this.http.get<Pagination<IEmploye>>(`${environment.apiV1}employes/paginateEmploye`)
  }

  searchEmploye(searchEmployeTerm:string):Observable<Pagination<IEmploye>>{
    return this.http.get<Pagination<IEmploye>>( `${environment.apiV1}employes/paginateEmploye?searchEmployeTerm=${searchEmployeTerm}`)
  }

  funcPaginate(
    link?: string,
    page?: number,
    search?: string
  ): Observable<Pagination<IEmploye>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}employes/paginateEmploye?page=${page}`;
      return this.http.get<Pagination<IEmploye>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}employes/paginateEmploye?searchEmployeTerm=${search}&page=${page}`;
      return this.http.get<Pagination<IEmploye>>(link)
    }
    if (search) {
      return this.http.get<Pagination<IEmploye>>(`${link}&searchEmployeTerm=${search}`);
    }
    return this.http.get<Pagination<IEmploye>>(link);
  }


  updateEmploye(id:number,updateEmploye:any):Observable<IEmploye>{
    return this.http.patch<IEmploye>(`${environment.apiV1}employes/${id}`,updateEmploye)
  }


  updateActivityEmploye(id: number, valueActive: any): Observable<IEmploye> {
    return this.http.patch<IEmploye>(`${environment.apiV1}employes/${id}/setActivity`, valueActive)
  }
}



