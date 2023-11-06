import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {GetResponseCharityBox} from "../interfaces/get-response-charity-box";
import {CharityBox} from "../common/charity-box";
import {environmentDevelopment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class CharityBoxService {

  private apiUrl =  `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.charityBox}`

  constructor(private httpClient: HttpClient) { }

  getCharityBoxes(): Observable<CharityBox[]>{
    return this.httpClient.get<GetResponseCharityBox>(this.apiUrl).pipe(map(response => response.data))
  }

  getImageUrl(filename: string): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${filename}`, { responseType: 'blob' });
  }

  addCharityBox(charityBox: FormData): Observable<CharityBox>{
    return this.httpClient.post<CharityBox>(this.apiUrl, charityBox);
  }

  updateCharityBox(charityBox: FormData): Observable<CharityBox>{
    return this.httpClient.put<CharityBox>(this.apiUrl, charityBox);
  }

  deleteCharityBox(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
