import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor() { }

  public getData(): void {
    console.log('getData');
  }

  public getCallbackData(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let name = 'Messi';
        resolve(name)
      }, 2000);
    });
  }

  public getRxjsData(): Observable<string> {
    return new Observable<string>((observer) => {
      // setTimeout(() => {
      setInterval(() => {
        const name = 'Jordan';
        observer.next(name)
      }, 2000)
    });
  }
}
