import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {User} from "../common/user";
import {GetResponseUser} from "../interfaces/get-response-user";
import {environmentDevelopment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.user}`

  constructor(private httpClient: HttpClient) { }

  getUsers(): Observable<User[]>{
    return this.httpClient.get<GetResponseUser>(this.apiUrl).pipe(map(response => response.data))
  }

  getUser(id: string): Observable<User>{
    return this.httpClient.get<User>(`${this.apiUrl}/${id}`);
  }

  addUser(user: User): Observable<User>{
    return this.httpClient.post<User>(this.apiUrl, user);
  }

  updateUser(user: User): Observable<User>{
    return this.httpClient.put<User>(this.apiUrl, user);
  }

  deleteUser(id:string): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }


}
