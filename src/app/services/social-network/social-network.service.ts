import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocialNetworkService {
  private url = environment.apiUrl + 'api/' + 'admin/' + 'social-network/';

  constructor(private httpClient: HttpClient) { }

  public getAll(): Observable<any> {
    return this.httpClient.get<any>(this.url);
  }

  public store(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'store', data);
  }

  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }

  public delete(id: any): Observable<any> {
    return this.httpClient.delete<any>(this.url + 'delete/' + id);
  }
}
