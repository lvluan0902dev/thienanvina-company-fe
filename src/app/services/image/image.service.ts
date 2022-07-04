import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private url = environment.apiUrl + 'api/' + 'shared/';

  constructor(private httpClient: HttpClient) { }

  public uploadSingleImage(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'upload-single-image', data);
  }

  public getAllImage(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'get-all-image', data);
  }

  public deleteSingleImage(id: any): Observable<any> {
    return this.httpClient.delete<any>(this.url + 'delete-single-image/' + id);
  }

  // public getSingleImage(image: any): Observable<any> {
  //   return this.httpClient.get<any>(this.url + 'get-single-image/' + image);
  // }
}
