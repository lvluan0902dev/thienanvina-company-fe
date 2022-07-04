import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private url = environment.apiUrl + 'api/' + 'admin/' + 'admin-user/';

  constructor(private httpClient: HttpClient) { }

  public details(email: any): Observable<any> {
    return this.httpClient.get<any>(this.url + 'details/' + email);
  }

  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }

  public updatePassword(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update-password', data);
  }
}
