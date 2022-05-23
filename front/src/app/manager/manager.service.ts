import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  constructor(private http: HttpClient) { }
  getListStationOperation() {
    return this.http.get<any[]>(
      `${environment.apiV1}agences/`
    );
  }
  getStatistiquesStatusOPs(agence, dateDebut, dateFin): Observable<any> {
     return this.http.get<any>(`${environment.apiV1}shipments/getStatistiquesStatusOPS/${agence}?dateDebut=${dateDebut}&dateFin=${dateFin}`)
  }
  getStatistiquesStatusFinancieres(agence, dateDebut, dateFin): Observable<any> {
    return this.http.get<any>(`${environment.apiV1}shipments/getStatistiquesStatusFinance/${agence}?dateDebut=${dateDebut}&dateFin=${dateFin}`)
  }
}
