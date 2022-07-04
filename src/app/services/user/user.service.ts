import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = environment.apiUrl + 'api/' + 'admin/' + 'user/';

  constructor(private httpClient: HttpClient) { }

  public getAll(): Observable<any> {
    return this.httpClient.get<any>(this.url);
  }
}
