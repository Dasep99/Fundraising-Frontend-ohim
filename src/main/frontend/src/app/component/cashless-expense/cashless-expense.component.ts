import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CashlessExpenseService} from "../../service/cashless-expense.service";
import {CashlessExpense} from "../../common/cashless-expense";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-cashless-expense',
  templateUrl: './cashless-expense.component.html',
  styleUrls: ['./cashless-expense.component.css']
})
export class CashlessExpenseComponent implements OnInit {

  cashlessExpenses: CashlessExpense[] = [];
  cashlessExpense?: CashlessExpense;
  originalCashlessExpenses?: CashlessExpense[];
  userId: string = '' + this.authService.getUserId()
  userRole: string = '' + this.authService.getCurrentUserRole()
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  url: string | ArrayBuffer | null = null;
  selectedFile?: File | null = null;
  errors?: any;

  constructor(private modal: NgbModal,
              private cashlessExpenseService: CashlessExpenseService,
              private authService: AuthService) {
  }

  ngOnInit() {
    if (this.userRole === 'FRONT_OFFICE') {
      this.getCashlessExpensesByUserId(this.userId)
    } else {
      this.getAllCashlessExpenses()
    }
  }

  getAllCashlessExpenses() {
    this.cashlessExpenseService.getCashlessExpenses().subscribe(
      (data: CashlessExpense[]) => {
        this.cashlessExpenses = data;
        this.originalCashlessExpenses = [...this.cashlessExpenses];
        this.cashlessExpenses.forEach(cashlessExpense => {
          this.cashlessExpenseService.getImageUrl(cashlessExpense.bbkPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                cashlessExpense.bbkPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  getCashlessExpensesByUserId(userId: string): void {
    this.cashlessExpenseService.getCashlessExpenses().subscribe(
      (data: CashlessExpense[]) => {
        this.cashlessExpenses = data.filter(cashlessExpense => cashlessExpense.user.id === userId);
        this.originalCashlessExpenses = [...this.cashlessExpenses];
        this.cashlessExpenses.forEach(cashlessExpense => {
          this.cashlessExpenseService.getImageUrl(cashlessExpense.bbkPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                cashlessExpense.bbkPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  onAddCashlessExpense(addForm: NgForm) {
    const formData = new FormData();
    formData.append('date', addForm.value.date);
    // formData.append('bbkNumber', addForm.value.bbkNumber);
    formData.append('contract', addForm.value.contract);
    formData.append('distribution', addForm.value.distribution);
    formData.append('items', addForm.value.items);
    formData.append('otherInfo', addForm.value.otherInfo);
    formData.append('userId', this.userId);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.cashlessExpenseService.addCashlessExpense(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getCashlessExpensesByUserId(this.userId);
        } else {
          this.getAllCashlessExpenses();
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onUpdateCashlessExpense(updateForm: NgForm): void {
    const formData = new FormData();
    formData.append('id', updateForm.value.id);
    formData.append('date', updateForm.value.date);
    // formData.append('bbkNumber', updateForm.value.bbkNumber);
    formData.append('contract', updateForm.value.contract);
    formData.append('distribution', updateForm.value.distribution);
    formData.append('items', updateForm.value.items);
    formData.append('otherInfo', updateForm.value.otherInfo);
    formData.append('userId', this.userId);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.cashlessExpenseService.updateCashlessExpense(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getCashlessExpensesByUserId(this.userId)
        } else {
          this.getAllCashlessExpenses()
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil diubah';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onDeleteCashlessExpense(id: string): void {
    this.cashlessExpenseService.deleteCashlessExpense(id).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getCashlessExpensesByUserId(this.userId)
        } else {
          this.getAllCashlessExpenses()
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

  openUpdateModal(content: any, cashlessExpense: CashlessExpense) {
    this.cashlessExpense = cashlessExpense;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    document.getElementById('updateDate')?.focus();
  }

  openDeleteModal(content: any, cashlessExpense: CashlessExpense) {
    this.cashlessExpense = cashlessExpense;
    this.modal.open(content)
    document.getElementById('delete')?.focus();
  }

  openViewImage(content: any, cashlessExpense: CashlessExpense) {
    this.modal.open(content)
    this.cashlessExpense = cashlessExpense;
    this.url = cashlessExpense.bbkPhoto;
    this.cashlessExpenseService.getImageUrl(cashlessExpense.bbkPhoto)
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSearch(search: string) {
    if (!this.originalCashlessExpenses) {
      this.originalCashlessExpenses = [...this.cashlessExpenses];
    }

    if (search === '') {
      this.cashlessExpenses = [...this.originalCashlessExpenses];
      return;
    }

    const searchValue = search.toLowerCase();
    this.cashlessExpenses = this.originalCashlessExpenses.filter((cashlessExpense: CashlessExpense) => {
      const date = new Date(cashlessExpense.date);
      const dateMatch = date.toLocaleDateString('id', { day: "2-digit", month: "2-digit", year: "numeric" }).includes(searchValue);
      const contractMatch = cashlessExpense.contract.replaceAll('_', ' ').toLowerCase().includes(searchValue);
      const bbkNumberMatch = cashlessExpense.bbkNumber.toLowerCase().includes(searchValue);
      const itemsMatch = cashlessExpense.items.join(" ").toLowerCase().includes(searchValue);
      const otherInfoMatch = cashlessExpense.otherInfo?.toLowerCase().includes(searchValue);
      const distributionMatch = cashlessExpense.distribution.replaceAll('_', ' ').toLowerCase().includes(searchValue);
      return dateMatch || contractMatch || bbkNumberMatch || itemsMatch || otherInfoMatch || distributionMatch;
    });
  }
}
