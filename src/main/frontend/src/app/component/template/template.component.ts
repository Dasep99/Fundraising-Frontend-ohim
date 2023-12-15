import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

  name?: string
  userRole?: string
  activeMenu?: string

  constructor(private modal: NgbModal,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.getRoles();
    this.getName();

    if (this.router.url.startsWith('/dashboard-')) {
      this.activeMenu = 'dashboard';
    }

    switch (this.router.url) {
      case '/tamu': this.activeMenu = 'tamu'; break;
      case '/donatur': this.activeMenu = 'donatur'; break;
      case '/donasi-cash': this.activeMenu = 'donasi-cash'; break;
      case '/donasi-transfer': this.activeMenu = 'donasi-transfer'; break;
      case '/donasi-non-tunai': this.activeMenu = 'donasi-non-tunai'; break;
      case '/santunan-acara': this.activeMenu = 'santunan-acara'; break;
      case '/setor-tunai': this.activeMenu = 'setor-tunai'; break;
      case '/pengeluaran-non-tunai': this.activeMenu = 'pengeluaran-non-tunai'; break;
      case '/validasi-harian': this.activeMenu = 'validasi-harian'; break;
      case '/pundi': this.activeMenu = 'pundi'; break;
      case '/jemput-pundi': this.activeMenu = 'jemput-pundi'; break;
      case '/pengguna': this.activeMenu = 'pengguna'; break;
      case '/barang': this.activeMenu = 'barang'; break;
    }
  }

  getRoles() {
    this.userRole = '' + this.authService.getCurrentUserRole()
  }

  getName() {
    this.name = '' + this.authService.getName()
  }

  openLogoutModal(content: any): void {
    this.modal.open(content)
    document.getElementById('logout')?.focus()
  }

  logout() {
    this.authService.logout()
  }

}
