import { Injectable } from '@angular/core';
import {environmentDevelopment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

import {Target} from "../common/target";
import {GetResponseTarget} from "../interfaces/get-response-target";
import {Donor} from "../common/donor";
import {DailyValidation} from "../common/daily-validation";

@Injectable({
  providedIn: 'root'
})
export class TargetService {

  private apiUrl = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.targets}`
  constructor(private httpClient: HttpClient) { }

  getTargets():Observable<Target[]>{
    return this.httpClient.get<GetResponseTarget>(this.apiUrl).pipe(map(response => response.data))
  }

  addTargets(targets: Target): Observable<Target> {
    return this.httpClient.post<Target>(this.apiUrl, targets);

  }

  updateTarget(targets: Target): Observable<Target>{
    return this.httpClient.put<Target>(this.apiUrl,targets);
  }

  deleteTarget(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
