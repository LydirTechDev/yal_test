import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination } from '../core/interfaces/paginations/pagination';
import { ICoursier } from '../operations/components/shipments/affecter-au-coursier/i-coursier';
import { IClient } from './i-client';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  constructor(private http: HttpClient) {}

  getRecoltePresRecolte() {
    return this.http.get<any[]>(
      `${environment.apiV1}recoltes/getRecoltePresRecolte`
    );
  }

  setRecolteRecue(rctTracking: string[]) {
    return this.http.post(`${environment.apiV1}recoltes/receiveRecoltes`, {
      rctTracking: rctTracking,
    });
  }

  getPaginateAllRecolte() {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}recoltes/paginateAllRecolte`
    );
  }

  funcPaginateAllRecolte(link: string, page: number) {
    if (page) {
      link = `${environment.apiV1}recoltes/paginateAllRecolte?page=${page}`;
    }
    return this.http.get<Pagination<any>>(link);
  }

  searchRecolte(searchRecolte: string) {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}recoltes/paginateAllRecolte?searchRecolteTerm=${searchRecolte}`
    );
  }

  getInformationsPaiementToLiberer() {
    return this.http.get(
      `${environment.apiV1}recoltes/getInformationsPaiementToLiberer`
    );
  }

  libererParIdRecolte(tracking: string) {
    return this.http.post(`${environment.apiV1}recoltes/libererParIdRecolte`, {
      tracking: tracking,
    });
  }

  libererParDateRecolte(dateRec) {
    return this.http.post(
      `${environment.apiV1}recoltes/libererParDateRecolte`,
      { date: dateRec }
    );
  }

  libererParClient(clientId) {
    return this.http.post(`${environment.apiV1}recoltes/libererParClient`, {
      clientId: clientId,
    });
  }

  printRecolte(id: number) {
    return this.http.get(`${environment.apiV1}recoltes/printRecolte/${id}`, {
      responseType: 'blob',
    });
  }

  getSoldeAgence() {
    return this.http.get(`${environment.apiV1}recoltes/get-solde-agence`);
  }

  getSoldeClient(clientId: number) {
    return this.http.get(
      `${environment.apiV1}shipments/get-solde-client/${clientId}`
    );
  }

  payerClient(clientId: number) {
    return this.http.get(`${environment.apiV1}pmt/payerClient/${clientId}`, {
      responseType: 'blob',
    });
  }
  getAllPaginatePmt() {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}pmt/find-all-paginate-pmt`
    );
  }


  funcPaginatePmt(
    link?: string,
    page?: number,
    search?: string
  ): Observable<Pagination<any>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}pmt/find-all-paginate-pmt?page=${page}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}pmt/find-all-paginate-pmt?searchPmtTerm=${search}&page=${page}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (search) {
      return this.http.get<Pagination<any>>(`${link}&searchPmtTerm=${search}`);
    }
    return this.http.get<Pagination<any>>(link);
  }

  searchPmt(searchPmtTerm: string) {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}pmt/find-all-paginate-pmt?searchPmtTerm=${searchPmtTerm}`
    );
  }

  printPmt(pmtTraking: string) {
    return this.http.get(`${environment.apiV1}pmt/print-pmt/${pmtTraking}`, {
      responseType: 'blob',
    });
  }

  getListCoursiersAttachedToMyStation() {
    return this.http.get<any>(`${environment.apiV1}coursier/coursierByStation`);
  }

  getColisLivrerByCoursierId(id: number) {
    return this.http.get<any>(`${environment.apiV1}shipments/colisLivrer/coursier/${id}`);
  }

  payerShipmentOfCoursier(shipments: any) {
    return this.http.patch(`${environment.apiV1}shipments/payerShipments`, shipments, { responseType: 'blob' })
  }
  getPaginatePmtc(): Observable<Pagination<any>> {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}pmtCoursier/paginatePmtc`
    );
  }



  funcPaginate(
    link?: string,
    page?: number,
    search?: string
  ): Observable<Pagination<any>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}pmtCoursier/paginatePmtc?page=${page}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}pmtCoursier/paginatePmtc?searchPmtcTerm=${search}&page=${page}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (search) {
      return this.http.get<Pagination<any>>(`${link}&searchPmtcTerm=${search}`);
    }
    return this.http.get<Pagination<any>>(link);
  }


  searchPmtc(searchWilayaTerm: string) {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}pmtCoursier/paginatePmtc?searchPmtcTerm=${searchWilayaTerm}`
    );
  }

  getAllPmtc() {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}pmtCoursier`
    );
  }

  printPmtc(id: number) {
    return this.http.get(`${environment.apiV1}pmtCoursier/printPmtc/${id}`, {
      responseType: 'blob',
    })
  }
}
