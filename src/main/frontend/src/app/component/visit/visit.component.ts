import {Component, OnInit} from '@angular/core';
import {VisitService} from "../../service/visit.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Visit} from "../../common/visit";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Donor} from "../../common/donor";
import {DonorService} from "../../service/donor.service";

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {

  visits: Visit[] = [];
  visit?: Visit;
  originalVisits?: Visit[];
  donors: Donor[] = [];
  userId: string = '' + this.authService.getUserId();
  userRole: string = '' + this.authService.getCurrentUserRole();
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  selectedFile?: File | null = null;
  errors?: any;

  constructor(private visitService: VisitService,
              private authService: AuthService,
              private modal: NgbModal,
              private donorService: DonorService) {
  }

  ngOnInit() {
    if (this.userRole === 'FRONT_OFFICE') {
      this.getVisitsByUserId(this.userId);
    } else {
      this.getAllVisits();
    }

    this.getAllDonors();
  }

  getAllDonors() {
    this.donorService.getDonors().subscribe(
      (data: Donor[]) => {
        this.donors = data;
      }
    )
  }

  getAllVisits() {
    this.visitService.getVisits().subscribe(
      (data: Visit[]) => {
        this.visits = data;
        this.originalVisits = [...this.visits];
        this.visits.forEach(visit => {
          this.visitService.getImageUrl(visit.photo).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                visit.photo = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  getVisitsByUserId(userId: string,): void {
    this.visitService.getVisits().subscribe(
      (data: Visit[]) => {
        this.visits = data.filter(visit => visit.user.id === userId);
        this.originalVisits = [...this.visits];
        this.visits.forEach(visit => {
          this.visitService.getImageUrl(visit.photo).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                visit.photo = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            },
          );
        });
      },
    );
  }

  onAddVisit(addForm: NgForm) {
    const formData = new FormData();
    formData.append('date', addForm.value.date);
    formData.append('donorId', addForm.value.donorId);
    formData.append('userId', this.userId);

    if (addForm.value.purpose === 'LAINNYA') {
      formData.append('purpose', addForm.value.otherPurpose);
    } else {
      formData.append('purpose', addForm.value.purpose);
    }

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.visitService.addVisit(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getVisitsByUserId(this.userId);
        } else {
          this.getAllVisits()
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onUpdateVisit(updateForm: NgForm): void {
    const formData = new FormData();
    formData.append('id', updateForm.value.id);
    formData.append('date', updateForm.value.date);
    formData.append('donorId', updateForm.value.donorId);
    formData.append('userId', this.visit!.user.id);

    if (updateForm.value.purpose === 'LAINNYA') {
      formData.append('purpose', updateForm.value.otherPurpose);
    } else {
      formData.append('purpose', updateForm.value.purpose);
    }

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.visitService.updateVisit(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getVisitsByUserId(this.userId);
        } else {
          this.getAllVisits()
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil diubah';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onDeleteVisit(id: string): void {
    this.visitService.deleteVisit(id).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getVisitsByUserId(this.userId);
        } else {
          this.getAllVisits();
        }
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
    $('.select2').select2({
      width: '100%'
    }).val('').trigger('change');
    document.getElementById('focusAdd')?.focus();
  }

  openUpdateModal(content: any, visit: Visit) {
    const oldPurpose = visit.purpose;
    this.visit = visit;

    if (visit.purpose !== 'TANYA_TANYA' && visit.purpose !== 'BOOKING_ACARA') {
      visit.otherPurpose = visit.purpose;
      visit.purpose = 'LAINNYA';
    }

    this.modal.open(content).result.then(() => {
      this.errors = undefined;
    }, () => {
      visit.purpose = oldPurpose;
      this.errors = undefined;
    });
    $('.select2').select2({
      width: '100%'
    });

    document.getElementById('focusUpdate')?.focus();
  }

  openDeleteModal(content: any, visit: Visit) {
    this.visit = visit;
    this.modal.open(content);
    document.getElementById('delete')?.focus();
  }

  openViewImage(content: any, visit: Visit) {
    this.visit = visit;
    this.modal.open(content);
    this.visitService.getImageUrl(visit.photo);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSearch(search: string) {
    if (!this.originalVisits) {
      this.originalVisits = [...this.visits];
    }

    if (search === '') {
      this.visits = [...this.originalVisits];
      return;
    }

    const searchValue = search.toLowerCase();
    this.visits = this.originalVisits.filter((visit: Visit) => {
      const date = new Date(visit.date);
      const dateMatch = date.toLocaleDateString('id', {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).includes(searchValue);
      const donorIdMatch = visit.donor.donorId?.toLowerCase().includes(searchValue);
      const donorNameMatch = visit.donor.name.toLowerCase().includes(searchValue);
      const purposeMatch = visit.purpose.replaceAll('_', ' ').toLowerCase().includes(searchValue);
      return dateMatch || donorIdMatch || donorNameMatch || purposeMatch;
    });
  }
}
