import { Injectable } from '@angular/core';
import {environmentDevelopment} from "../../environments/environment.development";
import {map, Observable} from "rxjs";
import {CashDonation} from "../common/cash-donation";
import {GetResponseCashDonation} from "../interfaces/get-response-cash-donation";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DailyReceiptsService {

  private apiCashDonation = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.cashDonation}`;
  constructor(private httpClient: HttpClient) { }

  GetfindByDateMonthAndDateYear(month: number, year: number): Observable<CashDonation[]> {
    const url = `${this.apiCashDonation}/findByDateMonthAndDateYear?month=${month}&year=${year}`;
    return this.httpClient.get<GetResponseCashDonation>(url).pipe(
      map(response => response.data)
    );
  }
}
