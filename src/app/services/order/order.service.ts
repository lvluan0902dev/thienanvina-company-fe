import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url = environment.apiUrl + 'api/' + 'admin/' + 'order/';

  constructor(private httpClient: HttpClient) { }

  public getAll(): Observable<any> {
    return this.httpClient.get<any>(this.url);
  }

  public latest(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'latest');
  }

  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }
}
