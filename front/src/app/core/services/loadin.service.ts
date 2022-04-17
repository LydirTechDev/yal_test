import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadinService {

  // private cont = 0;
  // private loadin$ = new BehaviorSubject<string>('');
  public isLoadin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public message: any;
  constructor() { }

  // getLoadinObserver(): Observable<string> {
  //   return this.loadin$.asObservable();
  // }

  // requestStart() {
  //   if (++this.cont === 1) {
  //     this.loadin$.next('start');
  //   }
  // }

  // requestEnded() {
  //   if (this.cont === 0 || --this.cont === 0) {
  //     this.loadin$.next('stop');
  //   }
  // }

  // restLoadin() {
  //   this.cont = 0;
  //   this.loadin$.next('stop');
  // }
}
