import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturerService {

  constructor(private http:HttpClient) { }


  getClientsHaveClassicShipmentInInterval(dateDebut,dateFin):Observable<any>{
    return this.http.get<any>(`${environment.apiV1}clients/clientsWithClassicShipments?dateDebut=${dateDebut}&dateFin=${dateFin}`)
  }

  getShipmentClassicWithIntervalOfClient(id:number,dateDebut,dateFin):Observable<any>{
    return this.http.get<any>(`${environment.apiV1}shipments/getColisOfClientClassic/${id}?dateDebut=${dateDebut}&dateFin=${dateFin}`)
  }

  facturerShipmentOfClient(shipments:any){
    return this.http.patch(`${environment.apiV1}shipments/facturerShipments`,shipments)
  }

  getAllPaginateFacture(payer:string): Observable<Pagination<any>>{
    return this.http.get<Pagination<any>>(`${environment.apiV1}facture/paginateFacture?payer=${payer}`)
  }

  searchFacture(searchFactureTerm: string,payer:string){
    return this.http.get<Pagination<any>>(`${environment.apiV1}facture/paginateFacture?searchFactureTerm=${searchFactureTerm}&payer=${payer}`)
  }

  funcPaginate(
    link?: string,
    page?: number,
    search?: string,
    payer?:string
  ): Observable<Pagination<any>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}facture/paginateFacture?page=${page}&payer=${payer}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}facture/paginateFacture?searchFactureTerm=${search}&payer=${payer}&page=${page}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (search) {
      return this.http.get<Pagination<any>>(`${link}&searchFactureTerm=${search}&payer=${payer}`);
    }
    return this.http.get<Pagination<any>>(`${link}&payer=${payer}`);
  }

  payerFacture(id:number,paiementInfo:any){
    return this.http.patch(`${environment.apiV1}facture/payer/${id}`,
      paiementInfo,{responseType:'blob'});
  }
}
