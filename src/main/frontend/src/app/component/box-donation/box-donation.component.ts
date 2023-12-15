import {Component, OnInit} from '@angular/core';
import {BoxDonationService} from "../../service/box-donation.service";
import {BoxDonation} from "../../common/box-donation";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-box-donation',
  templateUrl: './box-donation.component.html',
  styleUrls: ['./box-donation.component.css']
})
export class BoxDonationComponent implements OnInit {

  boxDonations: BoxDonation[] = [];
  boxDonation?: BoxDonation;
  originalBoxDonations?: BoxDonation[];
  userId: string = '' + this.authService.getUserId();
  userRole: string = '' + this.authService.getCurrentUserRole();
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  url: string | ArrayBuffer | null = null;
  selectedFile?: File | null = null;
  errors?: any;

  constructor(private boxDonationService: BoxDonationService,
              private modal: NgbModal,
              private authService: AuthService) {
  }

  ngOnInit() {
    if (this.userRole === 'FRONT_OFFICE') {
      this.getBoxDonationsByUserId(this.userId);
    } else {
      this.getAllBoxDonations();
    }
  }

  getAllBoxDonations() {
    this.boxDonationService.getBoxDonations().subscribe(
      (data: BoxDonation[]) => {
        this.boxDonations = data;
        this.originalBoxDonations = [...this.boxDonations];
        this.boxDonations.forEach(boxDonation => {
          this.boxDonationService.getImageUrl(boxDonation.receiptPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                boxDonation.receiptPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  getBoxDonationsByUserId(userId: string): void {
    this.boxDonationService.getBoxDonations().subscribe(
      (data: BoxDonation[]) => {
        this.boxDonations = data.filter(boxDonation => boxDonation.user.id === userId);
        this.originalBoxDonations = [...this.boxDonations];
        this.boxDonations.forEach(boxDonation => {
          this.boxDonationService.getImageUrl(boxDonation.receiptPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                boxDonation.receiptPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  onAddBoxDonation(addForm: NgForm) {
    addForm.value.amount = this.removeDotNumber(addForm.value.amount)
    const formData = new FormData();
    formData.append('date', addForm.value.date);
    // formData.append('receiptNumber', addForm.value.receiptNumber);
    formData.append('amount', addForm.value.amount);
    formData.append('userId', this.userId);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.boxDonationService.addBoxDonation(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getBoxDonationsByUserId(this.userId);
        } else {
          this.getAllBoxDonations();
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onUpdateBoxDonation(updateForm: NgForm): void {
    updateForm.value.amount = this.removeDotNumber(updateForm.value.amount)
    const formData = new FormData();
    formData.append('id', updateForm.value.id);
    formData.append('date', updateForm.value.date);
    // formData.append('receiptNumber', updateForm.value.receiptNumber);
    formData.append('amount', updateForm.value.amount);
    formData.append('userId', this.boxDonation!.user.id);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.boxDonationService.updateBoxDonation(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getBoxDonationsByUserId(this.userId);
        } else {
          this.getAllBoxDonations();
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil diubah';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onDeleteBoxDonation(id: string): void {
    this.boxDonationService.deleteBoxDonation(id).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getBoxDonationsByUserId(this.userId);
        } else {
          this.getAllBoxDonations();
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

  openUpdateModal(content: any, boxDonation: BoxDonation) {
    this.boxDonation = boxDonation;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    document.getElementById('updateDate')?.focus();
  }

  openDeleteModal(content: any, boxDonation: BoxDonation) {
    this.boxDonation = boxDonation;
    this.modal.open(content)
    document.getElementById('delete')?.focus();
  }

  openViewImage(content: any, boxDonation: BoxDonation) {
    this.modal.open(content)
    this.boxDonation = boxDonation;
    this.url = boxDonation.receiptPhoto;
    this.boxDonationService.getImageUrl(boxDonation.receiptPhoto)
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSearch(search: string) {
    if (!this.originalBoxDonations) {
      this.originalBoxDonations = [...this.boxDonations];
    }

    if (search === '') {
      this.boxDonations = [...this.originalBoxDonations];
      return;
    }

    const searchValue = search.toLowerCase();
    this.boxDonations = this.originalBoxDonations.filter((boxDonation: BoxDonation) => {
      const date = new Date(boxDonation.date);
      const dateMatch = date.toLocaleDateString('id', { day: "2-digit", month: "2-digit", year: "numeric" }).includes(searchValue);
      const amountMatch = boxDonation.amount.toLocaleString('id', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).includes(searchValue);
      const receiptNumberMatch = boxDonation.receiptNumber.toLowerCase().includes(searchValue);
      return dateMatch || amountMatch || receiptNumberMatch;
    });
  }

  addDotNumber(input: number): string {
    let inputString: string = String(input);
    inputString = inputString.replace(/\./g, ',');
    inputString = inputString.replace(/[^0-9,]/g, '');
    inputString = inputString.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return inputString;
  }

  removeDotNumber(input: string): number {
    input = input.replace(/\./g, '');
    input = input.replace(/,/g, '.');
    return Number(input);
  }
}
