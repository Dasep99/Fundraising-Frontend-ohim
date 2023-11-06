import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {GetResponseDonor} from "../interfaces/get-response-donor";
import {Donor} from "../common/donor";
import {environmentDevelopment} from "../../environments/environment.development";


@Injectable({
  providedIn: 'root'
})
export class DonorService {

  private apiUrl =  `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.donor}`

  constructor(private httpClient: HttpClient) { }

  getDonors(): Observable<Donor[]>{
    return this.httpClient.get<GetResponseDonor>(this.apiUrl).pipe(map(response => response.data))
  }

  getDonorById(id: string): Observable<Donor> {
    return this.httpClient.get<Donor>(`${this.apiUrl}/${id}`);
  }


  addDonor(donor: Donor): Observable<Donor>{
    return this.httpClient.post<Donor>(this.apiUrl, donor);
  }

  updateDonor(donor: Donor): Observable<Donor>{
    return this.httpClient.put<Donor>(this.apiUrl, donor);
  }

  deleteDonor(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
