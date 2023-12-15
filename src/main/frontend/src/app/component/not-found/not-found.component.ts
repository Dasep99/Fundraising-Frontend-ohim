import {Component} from '@angular/core';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {

  userRole?: string

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.getRoles()
  }

  getRoles() {
    this.userRole = '' + this.authService.getCurrentUserRole()
  }

}
