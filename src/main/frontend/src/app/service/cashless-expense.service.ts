import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {GetResponseCashlessExpense} from "../interfaces/get-response-cashless-expense";
import {CashlessExpense} from "../common/cashless-expense";
import {environmentDevelopment} from "../../environments/environment.development";


@Injectable({
  providedIn: 'root'
})
export class CashlessExpenseService {

  private apiUrl = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.cashlessExpense}`

  constructor(private httpClient: HttpClient) { }

  getCashlessExpenses():Observable<CashlessExpense[]>{
    return this.httpClient.get<GetResponseCashlessExpense>(this.apiUrl).pipe(map(response => response.data))
  }

  getImageUrl(filename: string): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${filename}`, { responseType: 'blob' });
  }

  addCashlessExpense(cashlessExpenses: FormData): Observable<CashlessExpense> {
    return this.httpClient.post<CashlessExpense>(this.apiUrl, cashlessExpenses);
  }

  updateCashlessExpense(cashlessExpenses: FormData): Observable<CashlessExpense>{
    return this.httpClient.put<CashlessExpense>(this.apiUrl, cashlessExpenses);
  }

  deleteCashlessExpense(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
