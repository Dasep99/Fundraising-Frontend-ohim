import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../service/user.service";
import {NgForm} from "@angular/forms";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errors?: string;
  isAuthenticated: boolean = true

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit(): void {

    const userRole = this.authService.getCurrentUserRole()

    if (userRole === 'ADMIN_PENERIMAAN') {
      this.router.navigateByUrl('/dashboard-admin-penerimaan');
    } else if (userRole === 'FRONT_OFFICE') {
      this.router.navigateByUrl('/dashboard-front-office');
    } else if (userRole === 'MANAGER_FUNDRAISING') {
      this.router.navigateByUrl('/dashboard-manager-fundraising');
    } else if (userRole === 'TIM_JEMPUT_DONASI') {
      this.router.navigateByUrl('/dashboard-tim-jemput-donasi');
    } else if (userRole === 'PETUGAS_PUNDI') {
      this.router.navigateByUrl('/dashboard-petugas-pundi');
    } else if (userRole === 'MARKETING_KOMUNIKASI') {
      this.router.navigateByUrl('/dashboard-marketing-komunikasi');
    }

  }

  login(loginForm: NgForm) {
    this.authService.login(loginForm.value).pipe(
      catchError(e => this.handleError(e))
    ).subscribe(
      response => {
        this.userService.getUser(response.id).subscribe(
          userResponse => {

            window.location.reload()

            const userRole = userResponse.role;
            if (userRole === 'ADMIN_PENERIMAAN') {
              this.router.navigate(['dashboard-admin-penerimaan']);
            } else if (userRole === 'FRONT_OFFICE') {
              this.router.navigateByUrl('/dashboard-front-office');
            } else if (userRole === 'MANAGER_FUNDRAISING') {
              this.router.navigateByUrl('/dashboard-manager-fundraising');
            } else if (userRole === 'TIM_JEMPUT_DONASI') {
              this.router.navigateByUrl('/dashboard-tim-jemput-donasi');
            } else if (userRole === 'PETUGAS_PUNDI') {
              this.router.navigateByUrl('/dashboard-petugas-pundi');
            } else if (userRole === 'MARKETING_KOMUNIKASI') {
              this.router.navigateByUrl('/dashboard-marketing-komunikasi');
            }
          }
        );
      }
    );
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 401 || error.status === 403) {
      this.isAuthenticated = false
      this.errors = error.error.errors;
      console.log(this.errors)
    }
    return [];
  }

}
