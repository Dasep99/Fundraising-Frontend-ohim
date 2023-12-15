
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {GetResponseVisit} from "../interfaces/get-response-visit";
import {Visit} from "../common/visit";
import {Injectable} from "@angular/core";
import {environmentDevelopment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class VisitService {

  private apiUrl = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.visit}`

  constructor(private httpClient: HttpClient) { }

  getVisits(): Observable<Visit[]> {
    return this.httpClient.get<GetResponseVisit>(this.apiUrl).pipe(map(response => response.data))
  }

  getImageUrl(filename: string): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${filename}`, { responseType: 'blob' });
  }

  addVisit(visit: FormData): Observable<Visit>{
    return this.httpClient.post<Visit>(this.apiUrl,visit)
  }

  updateVisit(visit: FormData): Observable<Visit>{
    return this.httpClient.put<Visit>(this.apiUrl, visit);
  }

  deleteVisit(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
