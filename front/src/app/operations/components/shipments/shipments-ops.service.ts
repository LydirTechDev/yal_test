import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { environment } from 'src/environments/environment';
import { IShipmentInterne } from '../../interfaces/i-shipment-interne';
import { ICoursier } from './affecter-au-coursier/i-coursier';

@Injectable({
  providedIn: 'root',
})
export class ShipmentsOpsService {

  observAddShipments = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) {}

  /**
   * a metre dans sac-ops.service
   * @param tracking
   * @param stationDestination
   * @returns
   */
  createSacTransfertShipment(tracking: string[], stationDestination: number) {
    console.log(
      '🚀 ~ file: shipments-ops.service.ts ~ line 21 ~ ShipmentsOpsService ~ createSacTransfertShipment ~ tracking',
      tracking
    );
    return this.http.post(
      `${environment.apiV1}sac/createTransfertSac`,
      {
        tracking: tracking,
        agenceSelected: stationDestination,
      },
      { responseType: 'blob' }
    );
  }

  async getShipmentsPresTransfert() {
    return await this.http
      .get<any>(`${environment.apiV1}shipments/getShipmentsPresTransfert`)
      .toPromise();
  }

  async getStationsHubs() {
    return await this.http
      .get<any>(`${environment.apiV1}agences/filterBy?typeAgence=hub`)
      .toPromise();
  }



  getTrackingPresExp() {
    return this.http.get<string[]>(`${environment.apiV1}shipments/getPresExp`);
  }

  setShipmentExpedier(tracking: string[]) {
    return this.http
      .post(`${environment.apiV1}shipments/setShipmentExpedier`, {
        tracking: tracking,
      })
      .subscribe();
  }

  async findAllWilaya(): Promise<any> {
    return await this.http.get<any>(`${environment.apiV1}wilayas`).toPromise();
  }

  async getTrackingPresVersWilaya(wilayaId: number) {
    return await this.http
      .get<any[]>(
        `${environment.apiV1}shipments/getTrackingPresVersWilaya/${wilayaId}`
      )
      .toPromise();
  }

  createSacVersWilaya(trackings: string[], wilayaDestination: number) {
    return this.http.post(
      `${environment.apiV1}sac/createSacVersWilaya`,
      {
        trakings: trackings,
        whilayaDestinationId: wilayaDestination,
      },
      { responseType: 'blob' }
    );
  }
  //
  async getColiPresARetire(idClient: any) {
    return await this.http
      .get<any[]>(
        `${environment.apiV1}shipments/getShipmentsPresARetire/${idClient}`
      )
      .toPromise();
  }
  async getListClientsAttachedToMyStation() {
    return await this.http
      .get<any>(`${environment.apiV1}clients/getListClientsAttachedToMyStation`)
      .toPromise();
  }
  //
  transiterSacs(trackings: string[]) {
    return this.http.post(
      `${environment.apiV1}sac/transiterSacs`,
      {
        trackings: trackings,
      },
    ).toPromise();
  }
  async getSacPresTransit() {
    return await this.http
      .get<any>(`${environment.apiV1}sac/getSacPresTransit`)
      .toPromise();
  }
//
  createSacRetourClient(selected: string[]) {
    return this.http.post(
      `${environment.apiV1}sac/createSacRetourClient`,
      {
        trackings: selected,
      },
      { responseType: 'blob' }
    );
  }
  //
  createSacRetourVersWilaya(selected: string[], wilayaSelected: any) {
    return this.http.post(
      `${environment.apiV1}sac/createSacRetourVersWilaya`,
      {
        trackings: selected,
        whilayaDestinationId: wilayaSelected,
      },
      { responseType: 'blob' }
    );
  }
  getWilayasOfMyCentre() {
    return this.http.get<any[]>(
      `${environment.apiV1}wilayas/wilayasOfMyCenter`
    ).toPromise();
  }
  async getTrackingPresRetourVersWilaya(idWilaya: any) {
    return await this.http.get<any[]>(
      `${environment.apiV1}shipments/getTrackingPresRetourVersWilaya/${idWilaya}`
    ).toPromise();
  }
//
  createSacRetourAgence(selected: string[], stationSelected: any) {
    return this.http.post(
      `${environment.apiV1}sac/createSacRetourAgence`,
      {
        trackings: selected,
        agenceSelected: stationSelected,
      },
      { responseType: 'blob' }
    );
  }
  async getListAgencesInMyWilaya() {
    return await this.http.get<any>(`${environment.apiV1}agences/getListAgencesInMyWilaya`).toPromise();
  }
  async getColiPresReturnVersAgence(idAgence: any) {
    return await this.http.get<any[]>(
      `${environment.apiV1}shipments/getColisPresReturnVersAgence/${idAgence}`
    ).toPromise();
  }
  //
  getTrackingEnTransfert(sacTracking) {
    return this.http.get<any[]>(
      `${environment.apiV1}sac/getTrackingEnTransfert/${sacTracking}`
    );
  }

  viderSacTransfert(tracking: string[]) {
    console.log(tracking);
    return this.http.post(`${environment.apiV1}sac/viderSacTransfert`, {
      tracking: tracking,
    });
  }
  //
  viderSacRetourVersAgence(selected: string[]) {
    return this.http.post(`${environment.apiV1}sac/viderSacRetourVersAgence`, {
      trackings: selected,
    });
  }
  getTrackingReturnVersAgence(sacTracking: string) {
    return this.http.get<any[]>(
      `${environment.apiV1}sac/getTrackingReturnVersAgence/${sacTracking}`
    );
  }
//
  viderSacRetourWilaya(selected: string[]) {
    return this.http.post(`${environment.apiV1}sac/viderSacRetourWilaya`, {
      trackings: selected,
    });
  }
  getTrackingReturnWilaya(trackingSac: string) {
    return this.http.get<any[]>(
      `${environment.apiV1}sac/getTrackingReturnWilaya/${trackingSac}`
    );
  }

  getTrackingVersWilaya(sacTracking: any) {
    console.log(
      '🚀 ~ file: shipments-ops.service.ts ~ line 89 ~ ShipmentsOpsService ~ getTrackingVersWilaya ~ sacTracking',
      sacTracking
    );
    return this.http.get<any[]>(
      `${environment.apiV1}sac/getTrackingVersWilaya/${sacTracking}`
    );
  }
  viderSacTransfertRetour(selected: string[]) {
    return this.http.post(`${environment.apiV1}sac/viderSacTransfertRetour`, {
      tracking: selected,
    });
  }
  getTrackingReturnTransfert(sacTracking: string) {
    return this.http.get<any[]>(
      `${environment.apiV1}sac/getTrackingReturnTransfert/${sacTracking}`
    );
  }
  /**
   * get all pagianted colis from Api
   * function to rewrite
   * same function but not in page
   * getPaginateColis
   * funcPaginate
   * searchColis
   * @returns
   */
  getPaginateColis(): Observable<Pagination<any>> {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}shipments/paginateColisInterneOfUser`
    );
  }

  funcPaginateColisInterneOfUser(link?: string, page?: number) {
    if (page) {
      link = `${environment.apiV1}shipments/paginateColisInterneOfUser?page=${page}`;
    }
    return this.http.get<Pagination<any>>(link);
  }
  searchColisInterneOfUser(searchColisInterne) {
    return this.http.get<Pagination<any>>(
      `${environment.apiV1}shipments/paginateColisInterneOfUser?searchColisTerm=${searchColisInterne}`
    );
  }
  printBordereau(id: number) {
    return this.http.get(`${environment.apiV1}shipments/printBordereau/${id}`, {
      responseType: 'blob',
    });
  }
  viderSacVersWilaya(tracking: string[]) {
    console.log(tracking);
    return this.http.post(`${environment.apiV1}sac/viderSacWilaya`, {
      tracking: tracking,
    });
  }

  async findCommunByWilayaTypeLivraison(
    wilayaId: number,
    livraisonStopDesck: number
  ): Promise<any> {
    return await this.http
      .post<any>(
        `${environment.apiV1}communes/communeByWilayaAndTypeLivraison`,
        { wilayaId: wilayaId, livraisonStopDesck: livraisonStopDesck }
      )
      .toPromise();
  }
  async findAgencesByCommune(communeId: number) {
    return await this.http
      .get<any>(`${environment.apiV1}agences/agenceByCommune/${communeId}`)
      .toPromise();
  }
  async findUserByAgence(agenceId) {
    return await this.http
      .get<any>(`${environment.apiV1}employes/employesByAgence/${agenceId}`)
      .toPromise();
  }

  creatShippment(shipment: IShipmentInterne) {
    console.log(
      '🚀 ~ file: shipments-ops.service.ts ~ line 117 ~ ShipmentsOpsService ~ creatShippment ~ shipment',
      shipment
    );
    return this.http.post(
      `${environment.apiV1}shipments/createInterneShipment`,
      { userId: shipment.userId, designation: shipment.designation },
      { responseType: 'blob' }
    );
  }

  getCoursiersByStation(): Observable<ICoursier[]> {
    return this.http.get<ICoursier[]>(
      `${environment.apiV1}coursier/coursierByStation`
    );
  }
  getShipmentsPresLivraison(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiV1}shipments/getShipmentsPresLivraison`
    );
  }

  assignToCourier(selected: string[], coursierSelected: number) {
    return this.http.post(
      `${environment.apiV1}shipments/assignToCourier`,
      {
        trackings: selected,
        coursier: coursierSelected,
      }
    );
  }
  setReturnStation(selected: string[]) {
    console.log("🚀 ~ file: shipments-ops.service.ts ~ line 201 ~ ShipmentsOpsService ~ setReturnStation ~ selected", selected)
    return this.http.post(
      `${environment.apiV1}shipments/setReturnStation`,
      {
        trackings: selected,
      }
    ).subscribe();
  }
  getShipmentsReturnStation(coursierId: any) {
    return this.http.get<any>(
      `${environment.apiV1}shipments/getShipmentsReturnStation/${coursierId}`
    );
  }

  getTrackingPresTranfsertRetour(idStation: any) {
    return this.http.get<any>(
      `${environment.apiV1}shipments/getTrackingPresTranfsertRetour/${idStation}`
    );
  }
  async getStationsTransfertRetour() {
    return await this.http
      .get<any>(`${environment.apiV1}agences/filterBy?typeAgence=centreRetour`)
      .toPromise();
  }
  createSacTransfertRetour(selected: string[], stationSelected: any) {
    return this.http.post(
      `${environment.apiV1}sac/createSacTransfertRetour`,
      {
        trackings: selected,
        stationSelected: stationSelected
      }, { responseType: 'blob' }
    )
  }
  getTrackingOfSacVersVendeur(trackingSac: string) {
    return this.http.get<string[]>(
      `${environment.apiV1}sac/getTrackingOfSacVersVendeur/${trackingSac}`
    );
  }
  receptShipmentClient(selected: string[], sacTracking: any, idClient: any) {
    return this.http.post(
      `${environment.apiV1}sac/receptShipmentClient`,{
        trackings: selected,
        sacTracking: sacTracking,
        idClient: idClient,
    }, { responseType: 'blob' })
  }
  getSacsClientInformation(idClient: any) {
    return this.http.get<string[]>(
      `${environment.apiV1}shipments/getSacsClientInformation/${idClient}`
    );
  }
  createSacVersAgence(selected: string[], agenceSelected: number) {
    return this.http.post(
      `${environment.apiV1}sac/createSacVersAgence`,
      {
        trackings: selected,
        agenceSelected: agenceSelected,
      },
      { responseType: 'blob' }
    );
  }
  getColiPresVersAgence(idAgence: number) {
    return this.http.get<string[]>(
      `${environment.apiV1}shipments/getShipmentsPresVersAgence/${idAgence}`
    ).toPromise();
  }
  getTrackingVersAgence(sacTracking: any) {
    return this.http.get<any[]>(
      `${environment.apiV1}sac/getTrackingVersAgence/${sacTracking}`
    ).toPromise();
  }
  viderSacVersAgence(trackings: string[]) {
    return this.http.post(`${environment.apiV1}sac/viderSacVersAgence`, {
      tracking: trackings,
    });
  }
  getPaginateShipments(): Observable<Pagination<any>> {
    return this.http.get<Pagination<any>>(`${environment.apiV1}shipments/paginateAllShipments`)
  }

  searchShipments(searchShipmentsTerm: string): Observable<Pagination<any>> {
    return this.http.get<Pagination<any>>(`${environment.apiV1}shipments/paginateAllShipments?searchShipmentsTerm=${searchShipmentsTerm}`)
  }
  funcPaginate(
    link?: string,
    page?: number,
    search?: string
  ): Observable<Pagination<any>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}shipments/paginateAllShipments?page=${page}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}shipments/paginateAllShipments?searchShipmentTerm=${search}&page=${page}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (search) {
      return this.http.get<Pagination<any>>(`${link}&searchShipmentTerm=${search}`);
    }
    return this.http.get<Pagination<any>>(link);
  }

  ExportToExcel(termToSearch: string) {
    return this.http.get(`http://localhost:3000/shipments/download?term=${termToSearch}`, { responseType: 'blob' });
  }


  //

  printManifestSac(idSac: number) {
    return this.http.get(`${environment.apiV1}sac/printManifestSac/${idSac}`, {
      responseType: 'blob',
    });
  }

  funcPaginateSac(link?: string,
    page?: number,
    search?: string
  ): Observable<Pagination<any>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}sac/paginateAllSac?page=${page}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}sac/paginateAllSac?searchSacTerm=${search}&page=${page}`;
      return this.http.get<Pagination<any>>(link)
    }
    if (search) {
      return this.http.get<Pagination<any>>(`${link}&searchSacTerm=${search}`);
    }
    return this.http.get<Pagination<any>>(link);
  }
  searchSacs(searchSacTerm: string) {
    return this.http.get<Pagination<any>>(`${environment.apiV1}sac/paginateAllSac?searchSacTerm=${searchSacTerm}`)

  }
  getPaginateSacs() {
    return this.http.get<Pagination<any>>(`${environment.apiV1}sac/paginateAllSac`)

  }
  getStatistiqueShipmentOfCoursierSelected(id) {
    return this.http.get<any>(
      `${environment.apiV1}shipments/getStatistiqueShipmentOfCoursierSelected/${id}`
    );
  }

}
