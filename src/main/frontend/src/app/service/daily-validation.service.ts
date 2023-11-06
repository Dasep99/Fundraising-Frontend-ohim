import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {DailyValidation} from "../common/daily-validation";
import {GetResponseDailyValidation} from "../interfaces/get-response-daily-validation";
import {environmentDevelopment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class DailyValidationService {

  private apiUrl = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.dailyValidation}`

  constructor(private httpClient : HttpClient) { }

  getDailyValidations(): Observable<DailyValidation[]> {
    return this.httpClient.get<GetResponseDailyValidation>(this.apiUrl).pipe(map(response => response.data))
  }

  getImageUrl(filename: string): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${filename}`, { responseType: 'blob' });
  }

  addDailyValidation(dailyValidation: FormData): Observable<DailyValidation>{
    return this.httpClient.post<DailyValidation>(this.apiUrl, dailyValidation);
  }

  updateDailyValidation(dailyValidation: FormData): Observable<DailyValidation>{
    return this.httpClient.put<DailyValidation>(this.apiUrl,dailyValidation);
  }

  deleteDailyValidation(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
