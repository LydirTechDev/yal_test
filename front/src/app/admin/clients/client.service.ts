import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { environment } from 'src/environments/environment';
import { IAgence } from '../agence/i-agence';
import { ICommune } from '../commune/i-commune';
import { ICodeTarif } from '../tarifications/i-code-tarif';
import { IService } from '../tarifications/i-service';
import { IWilaya } from '../wilaya/i-wilaya';
import { IClient } from './i-client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }


  findOneclientById(id:number):Observable<any>{
    return this.http.get<IClient>(`${environment.apiV1}clients/${id}`)
  }

  getAllWilaya(): Observable<IWilaya[]> {
    return this.http.get<IWilaya[]>(`${environment.apiV1}wilayas`);
  }

  getCommunsByWilayaId(id: number): Observable<ICommune[]> {
    return this.http.get<ICommune[]>(
      `${environment.apiV1}communes/wilayaId/${id}`
    );
  }

  getAgencesByWilayaId(id:number): Observable<IAgence[]>{
    return this.http.get<IAgence[]>( `${environment.apiV1}agences/agenceByWilaya/${id}`)
  }

  getAllService():Promise<IService[]>{
    return this.http.get<IService[]>( `${environment.apiV1}services/findAllService`).toPromise()
  }

  getCodeTarifByServiceId(serviceId:number):Observable<ICodeTarif[]>{
    return this.http.get<ICodeTarif[]>(`${environment.apiV1}code-tarif/serviceId/${serviceId}`)
  }


  createClient(client:IClient){
    return this.http.post(`${environment.apiV1}clients`, client, {responseType: 'blob'})
  }

  getPaginateClient():Observable<Pagination<IClient>>{
    return this.http.get<Pagination<IClient>>(`${environment.apiV1}clients/paginateClient`)
  }

  searchClient(searchClientTerm:string):Observable<Pagination<IClient>>{
    return this.http.get<Pagination<IClient>>( `${environment.apiV1}clients/paginateClient?searchClientTerm=${searchClientTerm}`)
  }


  funcPaginate(
    link?:string,
    page?:number,
    search?: string
  ):Observable<Pagination<IClient>>{
    if (page && search == undefined){
      link = `${environment.apiV1}clients/paginateClient?page=${page}`;
      return this.http.get<Pagination<IClient>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}clients/paginateClient?searchClientTerm=${search}&page=${page}`;
      return this.http.get<Pagination<IClient>>(link)
    }
    if(search){
      return this.http.get<Pagination<IClient>>(`${link}&searchClientTerm=${search}`);
      }
      return this.http.get<Pagination<IClient>>(link);
  }


  updateClient(id:number,updateClient:any):Observable<IClient>{
    return this.http.patch<IClient>(`${environment.apiV1}clients/${id}`,updateClient)
  }

  updateActivityClient(id:number,valueActive:any):Observable<IClient>{
    return this.http.patch<IClient>(`${environment.apiV1}clients/${id}/setActivity`,valueActive)
  }
  printContrat(id: number) {
    return this.http.get(`${environment.apiV1}clients/printContrat/${id}`, {
      responseType: 'blob',
    })
  }
  printCarte(id: number){
    return this.http.get(`${environment.apiV1}clients/printCarteClient/${id}`, {
      responseType: 'blob',
    })
  }
  ExportToExcel(termToSearch: string) {
    return this.http.get(`${environment.apiV1}clients/download?term=${termToSearch}`, { responseType: 'blob' });
  }

}
