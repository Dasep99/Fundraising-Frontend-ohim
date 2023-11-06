import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {GetResponseBoxDonation} from "../interfaces/get-response-box-donation";
import {BoxDonation} from "../common/box-donation";
import {environmentDevelopment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class BoxDonationService {

  private apiUrl = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.boxDonation}`

  constructor(private httpClient: HttpClient) {
  }

  getBoxDonations(): Observable<BoxDonation[]> {
    return this.httpClient.get<GetResponseBoxDonation>(this.apiUrl).pipe(map(response => response.data))
  }

  getImageUrl(filename: string): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${filename}`, { responseType: 'blob' });
  }

  addBoxDonation(boxDonation: FormData): Observable<BoxDonation>{
    return this.httpClient.post<BoxDonation>(this.apiUrl, boxDonation);
  }

  updateBoxDonation(boxDonation: FormData): Observable<BoxDonation>{
    return this.httpClient.put<BoxDonation>(this.apiUrl, boxDonation);
  }

  deleteBoxDonation(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
