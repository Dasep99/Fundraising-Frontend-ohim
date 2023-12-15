import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {GetResponseCashlessDonation} from "../interfaces/get-response-cashless-donation";
import {CashlessDonation} from "../common/cashless-donation";
import {environmentDevelopment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class CashlessDonationService {

  private apiUrl =  `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.cashlessDonation}`

  constructor(private httpClient: HttpClient) { }

  getCashlessDonations(): Observable<CashlessDonation[]>{
    return this.httpClient.get<GetResponseCashlessDonation>(this.apiUrl).pipe(map(response => response.data))
  }

  getImageUrl(filename: string): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${filename}`, { responseType: 'blob' });
  }

  addCashlessDonation(cashlessDonation: FormData): Observable<CashlessDonation>{
    console.log(cashlessDonation)
    return this.httpClient.post<CashlessDonation>(this.apiUrl, cashlessDonation);
  }

  updateCashLessDonation(cashlessDonation: FormData): Observable<CashlessDonation>{
    return this.httpClient.put<CashlessDonation>(this.apiUrl, cashlessDonation);
  }

  deleteCashlessDonation(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
