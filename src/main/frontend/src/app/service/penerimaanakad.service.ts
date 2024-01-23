import { Injectable } from '@angular/core';
import {environmentDevelopment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {PenerimaanAkad} from "../common/penerimaan-akad";
import {GetResponsePenerimaanAkad} from "../interfaces/get-response-penerimaan-akad";
import {Target} from "../common/target";

@Injectable({
  providedIn: 'root'
})
export class PenerimaanakadService {

  private apiUrl = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.penerimaanAkad}`
  constructor(private httpClient: HttpClient) { }

  getAkads(): Observable<PenerimaanAkad[]> {
    return this.httpClient.get<GetResponsePenerimaanAkad>(this.apiUrl).pipe(map(response => response.data))
  }

  addAkads(akad: PenerimaanAkad): Observable<Target> {
    return this.httpClient.post<Target>(this.apiUrl, akad);

  }

  updateAkad(akads: PenerimaanAkad): Observable<PenerimaanAkad>{
    return this.httpClient.put<PenerimaanAkad>(this.apiUrl,akads);
  }

  deleteAkad(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

}
