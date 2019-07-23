import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class FetcherService {

  constructor(private http: HttpClient) { }

  fetchJSON(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

}