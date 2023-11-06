import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {CashDonation} from "../common/cash-donation";
import {GetResponseCashDonation} from "../interfaces/get-response-cash-donation";
import {environmentDevelopment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class CashDonationService {

  private apiUrl =  `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.cashDonation}`

  constructor(private httpClient: HttpClient) { }

  getCashDonations(): Observable<CashDonation[]> {
    return this.httpClient.get<GetResponseCashDonation>(this.apiUrl).pipe(map(response => response.data))
  }

  getImageUrl(filename: string): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${filename}`, { responseType: 'blob' });
  }

  addCashDonation(data: FormData): Observable<CashDonation>{
    return this.httpClient.post<CashDonation>(this.apiUrl, data);
  }

  updateCashDonation(cashDonations: FormData): Observable<CashDonation>{
    return this.httpClient.put<CashDonation>(`${this.apiUrl}`, cashDonations);
  }

  deleteCashDonation(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

}
