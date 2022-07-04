import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,  } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private url = environment.apiUrl + 'api/' + 'admin/';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  public registerAdminUser(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'register', data);
  }

  public loginAdminUser(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'login', data);
  }

  public getUserInformation() {
    return this.httpClient.get<any>(environment.apiUrl + 'api/' + 'user');
  }
}
