import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceOpsService {


  constructor(private http: HttpClient) { }
  getListCoursiersAttachedToMyStation(){
    return this.http.get<any>(`${environment.apiV1}coursier/coursierByStation`);

  }
  getRecoltesOfCoursiers(coursierId: number){
    return this.http.get<any>(`${environment.apiV1}shipments/getRecoltesOfCoursier/${coursierId}`);
  }
  getRecoltesDeskInformation() {
    return this.http.get<any>(`${environment.apiV1}shipments/getRecoltesDeskInformation`);
  }
  validateReceptionRecolte(id: number){
    return this.http.post(`${environment.apiV1}recoltes`, { id: id }, { responseType: 'blob' })
  }
  createRecolteDesk() {
    return this.http.post(`${environment.apiV1}recoltes/createRecolteDesk`,{}, { responseType: 'blob' })
    }
  getPaginateRecolteTracabilite() {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}recoltes/paginateRecolteOfUser`
    );
  }
  funcPaginateRecolteOfUser(link: string, page: number) {
    if (page) {
      link = `${environment.apiV1}recoltes/paginateRecolteOfUser?page=${page}`;
    }
    return this.http.get<Pagination<any>>(link);
  }

  searchRecolteOfUser(searchRecolte: string) {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}recoltes/paginateRecolteOfUser?searchRecolteTerm=${searchRecolte}`
    );
  }
  printRecolte(id: number, typeRtc: string) {
    return this.http.get(
      `${environment.apiV1}recoltes/printRecolte/${id}/${typeRtc}`,
      {
        responseType: 'blob',
      }
    );
  }
}
