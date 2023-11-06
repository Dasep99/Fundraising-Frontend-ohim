import {Component, OnInit} from '@angular/core';
import {DonorService} from "../../service/donor.service";
import {Donor} from "../../common/donor";
import {NgForm} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../service/auth.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.css']
})
export class DonorComponent implements OnInit {

  donors: Donor[] = [];
  donor?: Donor;
  originalDonors?: Donor[];
  userId: string = '' + this.authService.getUserId();
  userRole: string = '' + this.authService.getCurrentUserRole();
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  errors?: any;

  constructor(private donorService: DonorService,
              private modal: NgbModal,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.getAllDonors();
  }

  getAllDonors() {
    this.donorService.getDonors().subscribe(
      (data: Donor[]) => {
        this.donors = data;
        this.originalDonors = [...this.donors];
      }
    )
  }

  onAddDonor(addForm: NgForm) {
    addForm.value.userId = this.userId
    this.donorService.addDonor(addForm.value).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        this.getAllDonors();
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    )

  }

  onUpdateDonor(donor: Donor): void {
    donor.userId = this.userId
    this.donorService.updateDonor(donor).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        this.getAllDonors();
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil diubah';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onDeleteDonor(id: string): void {
    this.donorService.deleteDonor(id).subscribe(
      () => {
        this.getAllDonors();
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil dihapus';
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

  openUpdateModal(content: any, donor: Donor) {
    this.donor = donor;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    document.getElementById('updateName')?.focus();
  }

  openDeleteModal(content: any, donor: Donor) {
    this.donor = donor;
    this.modal.open(content)
    document.getElementById('delete')?.focus();
  }

  onSearch(search: string) {
    if (!this.originalDonors) {
      this.originalDonors = [...this.donors];
    }

    if (search === '') {
      this.donors = [...this.originalDonors];
      return;
    }

    const searchValue = search.toLowerCase();
    this.donors = this.originalDonors.filter((donor: Donor) => {
      const nameMatch = donor.name.toLowerCase().includes(searchValue);
      const emailMatch = donor.email?.toLowerCase().includes(searchValue);
      const typeMatch = donor.type.toLowerCase().includes(searchValue);
      const phoneNumberMatch = donor.phoneNumber.includes(searchValue);
      const addressMatch = donor.address.toLowerCase().includes(searchValue);
      return nameMatch || emailMatch || typeMatch || phoneNumberMatch || addressMatch;
    });
  }
}


