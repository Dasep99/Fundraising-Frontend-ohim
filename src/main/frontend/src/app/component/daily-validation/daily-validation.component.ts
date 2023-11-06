import {Component, OnInit} from '@angular/core';
import {DailyValidation} from "../../common/daily-validation";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DailyValidationService} from "../../service/daily-validation.service";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-daily-validation',
  templateUrl: './daily-validation.component.html',
  styleUrls: ['./daily-validation.component.css']
})
export class DailyValidationComponent implements OnInit {

  dailyValidations: DailyValidation[] = [];
  dailyValidation?: DailyValidation;
  originalDailyValidations?: DailyValidation[];
  userId: string = '' + this.authService.getUserId();
  userRole: string = '' + this.authService.getCurrentUserRole();
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  url: string | ArrayBuffer | null = null;
  selectedFile?: File | null = null;
  errors?: any;

  constructor(private modal: NgbModal,
              private dailyValidationService: DailyValidationService,
              private authService: AuthService) {
  }

  ngOnInit() {
    if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI' || this.userRole === 'PETUGAS_PUNDI' || this.userRole === 'MARKETING_KOMUNIKASI') {
      this.getDailyValidationsByUserId(this.userId)
    } else {
      this.getAllDailyValidations()
    }
  }

  getAllDailyValidations() {
    this.dailyValidationService.getDailyValidations().subscribe(
      (data: DailyValidation[]) => {
        this.dailyValidations = data;
        this.originalDailyValidations = [...this.dailyValidations];
        this.dailyValidations.forEach(dailyValidation => {
          this.dailyValidationService.getImageUrl(dailyValidation.validationPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                dailyValidation.validationPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  getDailyValidationsByUserId(userId: string): void {
    this.dailyValidationService.getDailyValidations().subscribe(
      (data: DailyValidation[]) => {
        this.dailyValidations = data.filter(data => data.user.id === userId);
        this.originalDailyValidations = [...this.dailyValidations];
        this.dailyValidations.forEach(dailyValidation => {
          this.dailyValidationService.getImageUrl(dailyValidation.validationPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                dailyValidation.validationPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  onAddDailyValidation(addForm: NgForm) {
    addForm.value.amount = this.removeDotNumber(addForm.value.amount)
    const formData = new FormData();
    formData.append('date', addForm.value.date);
    formData.append('amount', addForm.value.amount);
    formData.append('userId', this.userId);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.dailyValidationService.addDailyValidation(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI' || this.userRole === 'PETUGAS_PUNDI' || this.userRole === 'MARKETING_KOMUNIKASI') {
          this.getDailyValidationsByUserId(this.userId)
        } else {
          this.getAllDailyValidations()
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onUpdateDailyValidation(updateForm: NgForm): void {
    updateForm.value.amount = this.removeDotNumber(updateForm.value.amount)
    const formData = new FormData();
    formData.append('id', updateForm.value.id);
    formData.append('date', updateForm.value.date);
    formData.append('amount', updateForm.value.amount);
    formData.append('userId', this.dailyValidation!.user.id);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.dailyValidationService.updateDailyValidation(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI' || this.userRole === 'PETUGAS_PUNDI' || this.userRole === 'MARKETING_KOMUNIKASI') {
          this.getDailyValidationsByUserId(this.userId)
        } else {
          this.getAllDailyValidations()
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil diubah';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onDeleteDailyValidation(id: string): void {
    this.dailyValidationService.deleteDailyValidation(id).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI' || this.userRole === 'PETUGAS_PUNDI' || this.userRole === 'MARKETING_KOMUNIKASI') {
          this.getDailyValidationsByUserId(this.userId)
        } else {
          this.getAllDailyValidations()
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

  openUpdateModal(content: any, dailyValidation: DailyValidation) {
    this.dailyValidation = dailyValidation;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    document.getElementById('updateDate')?.focus();
  }

  openDeleteModal(content: any, dailyValidation: DailyValidation) {
    this.dailyValidation = dailyValidation;
    this.modal.open(content)
    document.getElementById('delete')?.focus();
  }

  openViewImage(content: any, dailyValidation: DailyValidation) {
    this.modal.open(content)
    this.dailyValidation = dailyValidation;
    this.url = dailyValidation.validationPhoto;
    this.dailyValidationService.getImageUrl(dailyValidation.validationPhoto)
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSearch(search: string) {
    if (!this.originalDailyValidations) {
      this.originalDailyValidations = [...this.dailyValidations];
    }

    if (search === '') {
      this.dailyValidations = [...this.originalDailyValidations];
      return;
    }

    const searchValue = search.toLowerCase();
    this.dailyValidations = this.originalDailyValidations.filter((dailyValidation: DailyValidation) => {
      const date = new Date(dailyValidation.date);
      const dateMatch = date.toLocaleDateString('id', { day: "2-digit", month: "2-digit", year: "numeric" }).includes(searchValue);
      const amountMatch = dailyValidation.amount.toLocaleString('id', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).includes(searchValue);
      return dateMatch || amountMatch;
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
