import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {CashDeposit} from "../common/cash-deposit";
import {GetResponseCashDeposit} from "../interfaces/get-response-cash-deposit";
import {environmentDevelopment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class CashDepositService {

  private apiUrl =  `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.cashDeposit}`

  constructor(private httpClient: HttpClient) { }

  getCashDeposits(): Observable<CashDeposit[]>{
    return this.httpClient.get<GetResponseCashDeposit>(this.apiUrl).pipe(map(response => response.data))
  }

  getImageUrl(filename: string): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${filename}`, { responseType: 'blob' });
  }

  addCashDeposit(cashDeposit: FormData): Observable<CashDeposit>{
    return this.httpClient.post<CashDeposit>(this.apiUrl, cashDeposit);
  }

  updateCashDeposit(cashDeposit: FormData): Observable<CashDeposit>{
    return this.httpClient.put<CashDeposit>(this.apiUrl, cashDeposit);
  }

  deleteCashDeposit(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
