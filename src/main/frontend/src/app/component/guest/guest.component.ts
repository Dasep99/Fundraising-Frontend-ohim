import {Component, OnInit} from '@angular/core';
import {GuestService} from "../../service/guest.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Guest} from "../../common/guest";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {

  guests: Guest[] = [];
  guest?: Guest;
  originalGuests?: Guest[];
  userId: string = '' + this.authService.getUserId();
  userRole: string = '' + this.authService.getCurrentUserRole();
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  url: string | ArrayBuffer | null = null;
  selectedFile?: File | null = null;
  errors?: any;

  constructor(private guestService: GuestService,
              private authService: AuthService,
              private modal: NgbModal) {
  }

  ngOnInit() {
    if (this.userRole === 'FRONT_OFFICE') {
      this.getGuestsByUserId(this.userId)
    } else {
      this.getAllGuests()
    }
  }

  getAllGuests() {
    this.guestService.getGuests().subscribe(
      (data: Guest[]) => {
        this.guests = data;
        this.originalGuests = [...this.guests];
        this.guests.forEach(guest => {
          this.guestService.getImageUrl(guest.photo).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                guest.photo = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  getGuestsByUserId(userId: string,): void {
    this.guestService.getGuests().subscribe(
      (data: Guest[]) => {
        this.guests = data.filter(guest => guest.user.id === userId);
        this.originalGuests = [...this.guests];
        this.guests.forEach(guest => {
          this.guestService.getImageUrl(guest.photo).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                guest.photo = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            },
          );
        });
      },
    );
  }

  onAddGuest(addForm: NgForm) {
    const formData = new FormData();
    formData.append('date', addForm.value.date);
    formData.append('name', addForm.value.name);
    formData.append('address', addForm.value.address);
    formData.append('phoneNumber', addForm.value.phoneNumber);
    formData.append('userId', this.userId);

    if (addForm.value.purpose === 'LAINNYA') {
      formData.append('purpose', addForm.value.otherPurpose);
    } else {
      formData.append('purpose', addForm.value.purpose);
    }

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.guestService.addGuest(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getGuestsByUserId(this.userId);
        } else {
          this.getAllGuests()
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onUpdateGuest(updateForm: NgForm): void {
    const formData = new FormData();
    formData.append('id', updateForm.value.id);
    formData.append('date', updateForm.value.date);
    formData.append('name', updateForm.value.name);
    formData.append('address', updateForm.value.address);
    formData.append('phoneNumber', updateForm.value.phoneNumber);
    formData.append('userId', this.guest!.user.id);

    if (updateForm.value.purpose === 'LAINNYA') {
      formData.append('purpose', updateForm.value.otherPurpose);
    } else {
      formData.append('purpose', updateForm.value.purpose);
    }

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.guestService.updateGuest(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getGuestsByUserId(this.userId);
        } else {
          this.getAllGuests()
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil diubah';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onDeleteGuest(id: string): void {
    this.guestService.deleteGuest(id).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getGuestsByUserId(this.userId)
        } else {
          this.getAllGuests()
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
    document.getElementById('addDate')?.focus();
  }

  openUpdateModal(content: any, guest: Guest) {
    const oldPurpose = guest.purpose;
    this.guest = guest;

    if (guest.purpose !== 'TANYA_TANYA' && guest.purpose !== 'BOOKING_ACARA') {
      guest.otherPurpose = guest.purpose;
      guest.purpose = 'LAINNYA';
    }

    this.modal.open(content).result.then(() => {
      this.errors = undefined;
    }, () => {
      guest.purpose = oldPurpose;
      this.errors = undefined;
    });

    document.getElementById('updateDate')?.focus();
  }

  openDeleteModal(content: any, guest: Guest) {
    this.guest = guest;
    this.modal.open(content);
    document.getElementById('delete')?.focus();
  }

  openViewImage(content: any, guest: Guest) {
    this.modal.open(content)
    this.guest = guest;
    this.url = guest.photo;
    this.guestService.getImageUrl(guest.photo)
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSearch(search: string) {
    if (!this.originalGuests) {
      this.originalGuests = [...this.guests];
    }

    if (search === '') {
      this.guests = [...this.originalGuests];
      return;
    }

    const searchValue = search.toLowerCase();
    this.guests = this.originalGuests.filter((guest: Guest) => {
      const date = new Date(guest.date);
      const dateMatch = date.toLocaleDateString('id', { day: "2-digit", month: "2-digit", year: "numeric" }).includes(searchValue);
      const nameMatch = guest.name.toLowerCase().includes(searchValue);
      const addressMatch = guest.address.toLowerCase().includes(searchValue);
      const phoneNumberMatch = guest.phoneNumber.includes(searchValue);
      const purposeMatch = guest.purpose.replaceAll('_', ' ').toLowerCase().includes(searchValue);
      return dateMatch || nameMatch || addressMatch || phoneNumberMatch || purposeMatch;
    });
  }
}
