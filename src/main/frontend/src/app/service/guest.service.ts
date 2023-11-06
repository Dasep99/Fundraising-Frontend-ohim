
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {GetResponseGuest} from "../interfaces/get-response-guest";
import {Guest} from "../common/guest";
import {Injectable} from "@angular/core";
import {environmentDevelopment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  private apiUrl = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.guest}`

  constructor(private httpClient: HttpClient) { }

  getGuests(): Observable<Guest[]> {
    return this.httpClient.get<GetResponseGuest>(this.apiUrl).pipe(map(response => response.data))
  }

  getImageUrl(filename: string): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${filename}`, { responseType: 'blob' });
  }

  addGuest(guest: FormData): Observable<Guest>{
    return this.httpClient.post<Guest>(this.apiUrl,guest)
  }

  updateGuest(guest: FormData): Observable<Guest>{
    return this.httpClient.put<Guest>(this.apiUrl, guest);
  }

  deleteGuest(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
