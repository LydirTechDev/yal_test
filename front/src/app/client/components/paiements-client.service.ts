import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaiementsClientService {

  constructor( private http: HttpClient) { }
  getAllPaginatePmt() {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}pmt/find-all-paginate-pmt-client`
    );
  }


  funcPaginatePmt(
    link?: string,
    page?: number,
    search?: string
  ): Observable<Pagination<any>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}pmt/find-all-paginate-pmt-client?page=${page}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}pmt/find-all-paginate-pmt-client?searchPmtTerm=${search}&page=${page}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (search) {
      return this.http.get<Pagination<any>>(`${link}&searchPmtTerm=${search}`);
    }
    return this.http.get<Pagination<any>>(link);
  }

  searchPmt(searchPmtTerm: string) {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}pmt/find-all-paginate-pmt-client?searchPmtTerm=${searchPmtTerm}`
    );
  }

  printPmt(pmtTraking: string) {
    return this.http.get(`${environment.apiV1}pmt/print-pmt-client/${pmtTraking}`, {
      responseType: 'blob',
    });
  }
  getPaiementDetails(tracking) {
    return this.http.get<any>(
      `${environment.apiV1}pmt/getPaiementDetails/${tracking}`
    );
  }


  downloadBorderauAspirer() {
    return this.http.get(`${environment.apiV1}shipments/downloadBrdToAspire`, { responseType: 'blob' })
  }

  downloadWilayas() {
    return this.http.get(`${environment.apiV1}wilayas/DownloadAllWilayas`, { responseType: 'blob' })
  }

  downloadCommunes() {
    return this.http.get(`${environment.apiV1}communes/DownloadAllCommunes`, { responseType: 'blob' })
  }
}