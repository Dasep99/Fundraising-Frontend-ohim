import { Injectable } from '@angular/core';
import {environmentDevelopment} from "../../environments/environment.development";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {CashDonation} from "../common/cash-donation";
import {TransferDonation} from "../common/transfer-donation";
import {CashlessDonation} from "../common/cashless-donation";
import {GetResponseCashDonation} from "../interfaces/get-response-cash-donation";

@Injectable({
  providedIn: 'root'
})
export class DonorTransactionHistoryService {

  private apiCashDonation = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.cashDonation}`;
  private apiTransferDonation = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.transferDonation}`;
  private apiCashlessDonation = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.cashlessDonation}`;
  constructor(private httpClient: HttpClient) { }

  getCashDonations(): Observable<CashDonation[]> {
    return this.httpClient.get<GetResponseCashDonation>(this.apiCashDonation).pipe(map(response => response.data))
  }
  getCashDonationsByDonorId(donorId: string): Observable<CashDonation[]> {
    return this.httpClient.get<CashDonation[]>(`${this.apiCashDonation}/findByDonorId/${donorId}`);
  }

  getTransferDonationByDonorId(donorId: string): Observable<TransferDonation[]>{
    return this.httpClient.get<TransferDonation[]>(`${this.apiTransferDonation}/findByDonorId/${donorId}`);
  }

  getCashlessDonationByDonorId(donorId: string): Observable<CashlessDonation[]>{
    return this.httpClient.get<CashlessDonation[]>(`${this.apiCashlessDonation}/findByDonorId/${donorId}`);

  }


  }





