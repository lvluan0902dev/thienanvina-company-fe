import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductAttributeService {
  private url = environment.apiUrl + 'api/' + 'admin/' + 'product-attribute/';

  constructor(private httpClient: HttpClient) { }

  public getAll(product_id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + product_id);
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
