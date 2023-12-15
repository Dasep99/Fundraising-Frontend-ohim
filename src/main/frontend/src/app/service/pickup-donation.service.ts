import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {PickupDonation} from "../common/pickup-donation";
import {GetResponsePickupDonation} from "../interfaces/get-response-pickup-donation";
import {environmentDevelopment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class PickupDonationService {

  private apiUrl = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.pickUpDonation}`

  constructor(private httpClient: HttpClient) { }

  getPickUpDonations():Observable<PickupDonation[]>{
    return this.httpClient.get<GetResponsePickupDonation>(this.apiUrl).pipe(map(response => response.data))
  }

  getImageUrl(filename: string): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${filename}`, { responseType: 'blob' });
  }

  addPickUpDonation(pickupDonation: FormData): Observable<PickupDonation>{
    return this.httpClient.post<PickupDonation>(this.apiUrl, pickupDonation);
  }

  updatePickUpDonation(pickupDonation: FormData): Observable<PickupDonation>{
    return this.httpClient.put<PickupDonation>(this.apiUrl, pickupDonation);
  }

  deletePickUpDonation(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
