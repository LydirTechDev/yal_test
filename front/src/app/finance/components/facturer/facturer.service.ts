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

  getShipmentClassicWithIntervalOfClient(id:number,dateDebut,dateFin,espece):Observable<any>{
    return this.http.get<any>(`${environment.apiV1}shipments/getColisOfClientClassic/${id}?dateDebut=${dateDebut}&dateFin=${dateFin}&espece=${espece}`)
  }

  facturerShipmentOfClient(id:number,dateDebut,dateFin,espece){
    return this.http.patch(`${environment.apiV1}shipments/facturerShipments?clientId=${id}&dateDebut=${dateDebut}&dateFin=${dateFin}&espece=${espece}`,'',{responseType:'blob'})
  }


  getAllPaginateFacture(payer:string ,type:string): Observable<Pagination<any>>{
    return this.http.get<Pagination<any>>(`${environment.apiV1}facture/paginateFacture?payer=${payer}&type=${type}`)
  }

  searchFacture(searchFactureTerm: string,payer:string,type:string){
    return this.http.get<Pagination<any>>(`${environment.apiV1}facture/paginateFacture?searchFactureTerm=${searchFactureTerm}&payer=${payer}&type=${type}`)
  }

  funcPaginate(
    link?: string,
    page?: number,
    search?: string,
    payer?:string,
    type?:string
  ): Observable<Pagination<any>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}facture/paginateFacture?page=${page}&payer=${payer}&type=${type}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}facture/paginateFacture?searchFactureTerm=${search}&payer=${payer}&type=${type}&page=${page}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (search) {
      return this.http.get<Pagination<any>>(`${link}&searchFactureTerm=${search}&payer=${payer}&type=${type}`);
    }
    return this.http.get<Pagination<any>>(`${link}&payer=${payer}&type=${type}`);
  }

  payerFacture(id:number,paiementInfo:any){
    return this.http.patch(`${environment.apiV1}facture/payer/${id}`,
      paiementInfo);
  }

  printFactureClassique(id:number){
    return this.http.get(`${environment.apiV1}facture/printFactureClassique/${id}`,{responseType:'blob'})
  }

  getOneFactureClassique(id:number){
    return this.http.get(`${environment.apiV1}facture/factureclassique/${id}`)
  }

  getOneFactureEcommerce(id:number){
    return this.http.get(`${environment.apiV1}facture/factureEcommerce/${id}`)
  }

  getClientsHaveEcommerceShipmentInInterval(dateDebut,dateFin):Observable<any>{
    return this.http.get<any>(`${environment.apiV1}clients/clientsWithEcommerceShipments?dateDebut=${dateDebut}&dateFin=${dateFin}`)
  }

  getShipmentEcommerceWithIntervalOfClient(id:number,dateDebut,dateFin,espece):Observable<any>{
    return this.http.get<any>(`${environment.apiV1}shipments/getColisOfClientEcommerce/${id}?dateDebut=${dateDebut}&dateFin=${dateFin}&espece=${espece}`)
  }



  facturerShipmentOfClientEcommerceDetail(id:number,dateDebut,dateFin,espece){
    return this.http.patch(`${environment.apiV1}shipments/facturerShipmentsEcommerceDetail?clientId=${id}&dateDebut=${dateDebut}&dateFin=${dateFin}&espece=${espece}`,'',{responseType:'blob'})
  }

  facturerShipmentOfClientEcommerceSimple(id:number,dateDebut,dateFin,espece){
    return this.http.patch(`${environment.apiV1}shipments/facturerShipmentsEcommerceSimplifier?clientId=${id}&dateDebut=${dateDebut}&dateFin=${dateFin}&espece=${espece}`,'',{responseType:'blob'})
  }

  printFactureEcommerceDetail(id:number){
    return this.http.get(`${environment.apiV1}facture/printFactureEcommerceDetail/${id}`,{responseType:'blob'})
  }

  printFactureEcommerceSimplifier(id:number){
    return this.http.get(`${environment.apiV1}facture/printFactureEcommerceSimplifier/${id}`,{responseType:'blob'})
  }

  getStatistique(){
    return this.http.get(`${environment.apiV1}facture/statistique`)
  }


  getClientsHaveEcommerceZeroShipmentInInterval(dateDebut,dateFin):Observable<any>{
    return this.http.get<any>(`${environment.apiV1}clients/clientsWithEcommerceZeroShipments?dateDebut=${dateDebut}&dateFin=${dateFin}`)
  }

  getShipmentEcommerceZeroWithIntervalOfClient(id:number,dateDebut,dateFin,espece):Observable<any>{
    return this.http.get<any>(`${environment.apiV1}shipments/getColisOfClientEcommerceZero/${id}?dateDebut=${dateDebut}&dateFin=${dateFin}&espece=${espece}`)
  }


  facturerShipmentOfClientEcommerceZeroDetail(id:number,dateDebut,dateFin,espece){
    return this.http.patch(`${environment.apiV1}shipments/facturerShipmentsEcommerceZeroDetail?clientId=${id}&dateDebut=${dateDebut}&dateFin=${dateFin}&espece=${espece}`,'',{responseType:'blob'})
  }

  facturerShipmentOfClientEcommerceZeroSimple(id:number,dateDebut,dateFin,espece){
    return this.http.patch(`${environment.apiV1}shipments/facturerShipmentsEcommerceZeroSimplifier?clientId=${id}&dateDebut=${dateDebut}&dateFin=${dateFin}&espece=${espece}`,'',{responseType:'blob'})
  }
}
