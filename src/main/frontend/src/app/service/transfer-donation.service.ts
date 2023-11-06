import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {TransferDonation} from "../common/transfer-donation";
import {GetResponseTransferDonation} from "../interfaces/get-response-transfer-donation";
import {environmentDevelopment} from "../../environments/environment.development";


@Injectable({
  providedIn: 'root'
})
export class TransferDonationService {

  private apiUrl = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.transferDonation}`

  constructor(private httpClient: HttpClient) { }

  getTransferDonations():Observable<TransferDonation[]>{
    return this.httpClient.get<GetResponseTransferDonation>(this.apiUrl).pipe(map(response => response.data))
  }

  getImageUrl(filename: string): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${filename}`, { responseType: 'blob' });
  }

  addTransferDonation(transferDonation: FormData): Observable<TransferDonation>{
    return this.httpClient.post<TransferDonation>(this.apiUrl, transferDonation);
  }

  updateTransferDonation(transferDonation: FormData): Observable<TransferDonation>{
    return this.httpClient.put<TransferDonation>(this.apiUrl, transferDonation);
  }

  deleteTransferDonation(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
