import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private count = 0;
  private spinner$ = new BehaviorSubject<string>('');

  constructor() { }

  getSpinnerObserver(): Observable<string> {
    return this.spinner$.asObservable();
  }

  requestStarted() {
    console.log('hakim start')
    console.log('count start',this.count)
    if (++this.count === 1) {
      this.spinner$.next('start');
      // this.resetSpinner()

    }
  }

  requestEnded() {
    console.log('hakim end')
    console.log('count', this.count)
    if (this.count === 1 || --this.count === 1) {
      this.spinner$.next('stop');
      // this.resetSpinner()

    }
  }

  resetSpinner() {
    this.count = 0;
    this.spinner$.next('stop');
  }
}