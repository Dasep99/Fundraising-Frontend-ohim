import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {AuthService} from "../service/auth.service";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedRoles: string[] = route.data['expectedRoles'];

    if (this.authService.getToken()) {
      const userRole: string = '' + this.authService.getCurrentUserRole();
      if (expectedRoles.includes(userRole)) {
        return true;
      } else {
        this.router.navigate(['404']);
        return false;
      }
    } else {
      this.router.navigate(['masuk']);
      return false;
    }

  }
}
