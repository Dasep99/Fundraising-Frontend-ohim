import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../service/user.service";
import {User} from "../../common/user";
import {NgForm} from "@angular/forms";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: User[] = [];
  user?: User;
  originalUsers?: User[];
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  errors?: any;

  constructor(private userService: UserService,
              private modal: NgbModal) {
  }

  ngOnInit() {
    this.getAllUsers()
  }

  getAllUsers() {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
        this.originalUsers = [...this.users];
      }
    )
  }

  onAddUser(addForm: NgForm) {
    this.userService.addUser(addForm.value).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        this.getAllUsers()
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000);
      }
    )
  }

  onUpdateUser(user: User): void {
    this.userService.updateUser(user).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        this.getAllUsers();
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil diubah';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000);
      }
    );
  }

  onDeleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe(
      () => {
        this.getAllUsers()
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil dihapus'
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    )
  }

  openAddModal(content: any) {
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    document.getElementById('addName')?.focus();
  }

  openUpdateModal(content: any, user: User) {
    this.user = user;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    document.getElementById('updateName')?.focus();
  }

  openDeleteModal(content: any, user: User) {
    this.user = user;
    this.modal.open(content);
    document.getElementById('delete')?.focus();
  }

  onSearch(search: string) {
    if (!this.originalUsers) {
      this.originalUsers = [...this.users];
    }

    if (search === '') {
      this.users = [...this.originalUsers];
      return;
    }

    const searchValue = search.toLowerCase();
    this.users = this.originalUsers.filter((user: User) => {
      const nameMatch = user.name.toLowerCase().includes(searchValue);
      const usernameMatch = user.username.toLowerCase().includes(searchValue);
      const roleMatch = user.role.replaceAll('_', ' ').toLowerCase().includes(searchValue);
      const workAreaMatch = user.workArea.toLowerCase().includes(searchValue);
      return nameMatch || usernameMatch || roleMatch || workAreaMatch;
    });
  }
}
