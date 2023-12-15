import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {EventCompensation} from "../common/event-compensation";
import {GetResponseEventCompensation} from "../interfaces/get-response-event-compensation";
import {environmentDevelopment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class EventCompensationService {

  private apiUrl = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.eventCompensation}`

  constructor(private httpClient: HttpClient) { }

  getEventCompensation(): Observable<EventCompensation[]>{
    return this.httpClient.get<GetResponseEventCompensation>(this.apiUrl).pipe(map(response => response.data))
  }

  getImageUrl(filename: string): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${filename}`, { responseType: 'blob' });
  }

  addEventCompensation(eventCompensation: FormData): Observable<EventCompensation>{
    return this.httpClient.post<EventCompensation>(this.apiUrl, eventCompensation);
  }

  updateEventCompensation(eventCompensation: FormData): Observable<EventCompensation>{
    return this.httpClient.put<EventCompensation>(this.apiUrl, eventCompensation);
  }

  deleteEventCompensation(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
