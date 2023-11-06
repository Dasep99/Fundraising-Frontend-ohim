import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CashDepositService} from "../../service/cash-deposit.service";
import {CashDeposit} from "../../common/cash-deposit";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-cash-deposit',
  templateUrl: './cash-deposit.component.html',
  styleUrls: ['./cash-deposit.component.css']
})
export class CashDepositComponent implements OnInit {

  cashDeposits: CashDeposit[] = [];
  cashDeposit?: CashDeposit;
  originalCashDeposits?: CashDeposit[];
  userId: string = '' + this.authService.getUserId();
  userRole: string = '' + this.authService.getCurrentUserRole();
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  url: string | ArrayBuffer | null = null;
  selectedFile?: File | null = null;
  errors?: any;

  constructor(private cashDepositService: CashDepositService,
              private modal: NgbModal,
              private authService: AuthService) {
  }

  ngOnInit() {
    if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI' || this.userRole === 'PETUGAS_PUNDI' || this.userRole === 'MARKETING_KOMUNIKASI') {
      this.getCashDepositsByUserId(this.userId)
    } else {
      this.getAllCashDeposits()
    }
  }

  getAllCashDeposits() {
    this.cashDepositService.getCashDeposits().subscribe(
      (data: CashDeposit[]) => {
        this.cashDeposits = data;
        this.originalCashDeposits = [...this.cashDeposits];
        this.cashDeposits.forEach(cashDeposit => {
          this.cashDepositService.getImageUrl(cashDeposit.receiptPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                cashDeposit.receiptPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  getCashDepositsByUserId(userId: string): void {
    this.cashDepositService.getCashDeposits().subscribe(
      (data: CashDeposit[]) => {
        this.cashDeposits = data.filter(cashDeposit => cashDeposit.user.id === userId);
        this.originalCashDeposits = [...this.cashDeposits];
        this.cashDeposits.forEach(cashDeposit => {
          this.cashDepositService.getImageUrl(cashDeposit.receiptPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                cashDeposit.receiptPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  onAddCashDeposit(addForm: NgForm) {
    const formData = new FormData();
    addForm.value.amount = this.removeDotNumber(addForm.value.amount)
    formData.append('date', addForm.value.date);
    formData.append('contract', addForm.value.contract);
    formData.append('amount', addForm.value.amount);
    formData.append('userId', this.userId);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.cashDepositService.addCashDeposit(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI' || this.userRole === 'PETUGAS_PUNDI' || this.userRole === 'MARKETING_KOMUNIKASI') {
          this.getCashDepositsByUserId(this.userId)
        } else {
          this.getAllCashDeposits()
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onUpdateCashDeposit(updateForm: NgForm): void {
    updateForm.value.amount = this.removeDotNumber(updateForm.value.amount)
    const formData = new FormData();
    formData.append('id', updateForm.value.id);
    formData.append('date', updateForm.value.date);
    formData.append('amount', updateForm.value.amount);
    formData.append('contract', updateForm.value.contract);
    formData.append('userId', this.cashDeposit!.user.id);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.cashDepositService.updateCashDeposit(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI' || this.userRole === 'PETUGAS_PUNDI' || this.userRole === 'MARKETING_KOMUNIKASI') {
          this.getCashDepositsByUserId(this.userId)
        } else {
          this.getAllCashDeposits()
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil diubah';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onDeleteCashDeposit(id: string): void {
    this.cashDepositService.deleteCashDeposit(id).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI' || this.userRole === 'PETUGAS_PUNDI' || this.userRole === 'MARKETING_KOMUNIKASI') {
          this.getCashDepositsByUserId(this.userId)
        } else {
          this.getAllCashDeposits()
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

  openUpdateModal(content: any, cashDeposit: CashDeposit) {
    this.cashDeposit = cashDeposit;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    document.getElementById('updateDate')?.focus();
  }

  openDeleteModal(content: any, cashDeposit: CashDeposit) {
    this.cashDeposit = cashDeposit;
    this.modal.open(content)
    document.getElementById('delete')?.focus();
  }

  openViewImage(content: any, cashDeposit: CashDeposit) {
    this.modal.open(content)
    this.cashDeposit = cashDeposit;
    this.url = cashDeposit.receiptPhoto;
    this.cashDepositService.getImageUrl(cashDeposit.receiptPhoto)
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSearch(search: string) {
    if (!this.originalCashDeposits) {
      this.originalCashDeposits = [...this.cashDeposits];
    }

    if (search === '') {
      this.cashDeposits = [...this.originalCashDeposits];
      return;
    }

    const searchValue = search.toLowerCase();
    this.cashDeposits = this.originalCashDeposits.filter((cashDeposit: CashDeposit) => {
      const date = new Date(cashDeposit.date);
      const dateMatch = date.toLocaleDateString('id', { day: "2-digit", month: "2-digit", year: "numeric" }).includes(searchValue);
      const contractMatch = cashDeposit.contract.replaceAll('_', ' ').toLowerCase().includes(searchValue);
      const amountMatch = cashDeposit.amount.toLocaleString('id', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).includes(searchValue);
      return dateMatch || contractMatch || amountMatch;
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
