import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IZone } from '../zone/i-zone';
import { ICodeTarif } from './i-code-tarif';

@Injectable({
  providedIn: 'root',
})
export class CodeTarifService {
  constructor(private http: HttpClient) {}

  /**
   * get count for all code tarif
   * @returns
   */
  getNbCodeTarif(): Observable<number> {
    return this.http.get<number>(`${environment.apiV1}code-tarif/nbCodeTarif`);
  }

  /**
   *
   * @param codeTarifId
   * @returns
   */
  getCodeTarifById(codeTarifId: number): Observable<IZone[]> {
    return this.http.get<IZone[]>(
      `${environment.apiV1}zones/fineZoneBycodeTarif/${codeTarifId}`
    );
  }

  chekIfServiceExist(codeTarifName: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${environment.apiV1}code-tarif/chekIfServiceExist/${codeTarifName}`
    );
  }
}
