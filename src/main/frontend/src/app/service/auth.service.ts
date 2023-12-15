import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {Credential} from "../common/user";
import {map, Observable} from "rxjs";
import {environmentDevelopment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.authUrl}`

  constructor(private httpClient: HttpClient,
              private router: Router) { }

  login(credential: Credential): Observable<any> {
    return this.httpClient.post(this.loginUrl, credential, {
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<any>) => {

        const token = response.body.token
        localStorage.setItem('token', token);
        localStorage.setItem('userId', response.body.id);
        localStorage.setItem('role', response.body.role)
        localStorage.setItem('name', response.body.name)
        localStorage.setItem('workArea', response.body.workArea)
        return response.body;
      })
    );
  }

  getUserId(){
    return localStorage.getItem('userId')
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getName(){
    return localStorage.getItem('name')
  }

  getWorkArea(){
    return localStorage.getItem('workArea')
  }

  getCurrentUserRole(){
    return localStorage.getItem('role')
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['']).then(
      () => {
        window.location.reload();
      }
    );
  }

}
