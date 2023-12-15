import {Component, OnInit} from '@angular/core';
import {CashDonationService} from "../../service/cash-donation.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CashDonation} from "../../common/cash-donation";
import {NgForm} from "@angular/forms";
import {Donor} from "../../common/donor";
import {AuthService} from "../../service/auth.service";
import {DonorService} from "../../service/donor.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-cash-donation',
  templateUrl: './cash-donation.component.html',
  styleUrls: ['./cash-donation.component.css']
})
export class CashDonationComponent implements OnInit {

  cashDonations: CashDonation[] = [];
  cashDonation?: CashDonation;
  originalCashDonations?: CashDonation[];
  donors: Donor[] = [];
  userId: string = '' + this.authService.getUserId();
  userRole: string = '' + this.authService.getCurrentUserRole();
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  selectedFile?: File;
  errors?: any;
  receiptNumber?: string;

  constructor(private cashDonationService: CashDonationService,
              private modal: NgbModal,
              private authService: AuthService,
              private donorService: DonorService) {
  }

  ngOnInit() {
    if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI') {
      this.getCashDonationsByUserId(this.userId);
    } else {
      this.getAllCashDonations();
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

  getAllCashDonations() {
    this.cashDonationService.getCashDonations().subscribe(
      (data: CashDonation[]) => {
        this.cashDonations = data;
        this.originalCashDonations = [...this.cashDonations];
        this.cashDonations.forEach(cashDonation => {
          this.cashDonationService.getImageUrl(cashDonation.receiptPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                cashDonation.receiptPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );

  }

  getCashDonationsByUserId(userId: string): void {
    this.cashDonationService.getCashDonations().subscribe(
      (data: CashDonation[]) => {
        this.cashDonations = data.filter(cashDonation => cashDonation.user.id === userId);
        this.originalCashDonations = [...this.cashDonations];
        this.cashDonations.forEach(cashDonation => {
          this.cashDonationService.getImageUrl(cashDonation.receiptPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                cashDonation.receiptPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  onAddCashDonation(addForm: NgForm) {
    addForm.value.amount = this.removeDotNumber(addForm.value.amount);
    const formData = new FormData();
    formData.append('date', addForm.value.date);
    formData.append('contract', addForm.value.contract);
    formData.append('amount', addForm.value.amount);
    formData.append('receiptNumber', addForm.value.receiptNumber);
    formData.append('status', addForm.value.status);
    formData.append('donorId', addForm.value.donorId);
    formData.append('userId', this.userId);


    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.cashDonationService.addCashDonation(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI') {
          this.getCashDonationsByUserId(this.userId);
        } else {
          this.getAllCashDonations();
        }

        this.getAllDonors();
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onUpdateCashDonation(updateForm: NgForm): void {
    updateForm.value.amount = this.removeDotNumber(updateForm.value.amount);
    const formData = new FormData();
    formData.append('id', updateForm.value.id);
    formData.append('date', updateForm.value.date);
    formData.append('contract', updateForm.value.contract);
    formData.append('amount', updateForm.value.amount);
    // formData.append('receiptNumber', updateForm.value.receiptNumber);
    formData.append('status', updateForm.value.status);
    formData.append('userId', this.cashDonation!.user.id);
    formData.append('donorId', updateForm.value.donorId);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.cashDonationService.updateCashDonation(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI') {
          this.getCashDonationsByUserId(this.userId);
        } else {
          this.getAllCashDonations();
        }

        this.getAllDonors();
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil diubah';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onDeleteCashDonation(id: string): void {
    this.cashDonationService.deleteCashDonation(id).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI') {
          this.getCashDonationsByUserId(this.userId);
        } else {
          this.getAllCashDonations();
        }

        this.getAllDonors();
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil dihapus';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    )
  }

  onAccStatusCashDonation(id: string) {
    this.cashDonationService.updateAccCashDonation(id).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI') {
          this.getCashDonationsByUserId(this.userId);
        } else {
          this.getAllCashDonations();
        }

        this.getAllDonors();
        this.modal.dismissAll('success');
        this.alertMessage = 'Status donasi berhasil diubah';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  openAddModal(content: any) {
    this.cashDonationService.generateReceiptNumber(this.userId).subscribe(
      data => {
        this.receiptNumber = data.receiptNumber;
      }
    );

    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    $('.select2').select2({
      width: '100%'
    }).val('').trigger('change');
    document.getElementById('focusAdd')?.focus();
  }

  openUpdateModal(content: any, cashDonation: CashDonation) {
    this.cashDonation = cashDonation;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    $('.select2').select2({
      width: '100%'
    });
    $('#contractUpdate').select2({
      width: '100%'
    }).val(cashDonation.contract).trigger('change');
    document.getElementById('focusUpdate')?.focus();
  }

  openDeleteModal(content: any, cashDonation: CashDonation) {
    this.cashDonation = cashDonation;
    this.modal.open(content);
    document.getElementById('delete')?.focus();
  }

  openAccModal(content: any, cashDonation: CashDonation) {
    this.cashDonation = cashDonation;
    this.modal.open(content);
    document.getElementById('acc')?.focus();
  }

  openViewImage(content: any, cashDonation: CashDonation) {
    this.cashDonation = cashDonation;
    this.modal.open(content);
    this.cashDonationService.getImageUrl(cashDonation.receiptPhoto);
  }

  // openViewReceipt(cashDonation: CashDonation) {
  //   const receipt = new Receipt();
  //   receipt.receiptNumber = cashDonation.receiptNumber;
  //   receipt.donorName = cashDonation.donor.name;
  //   receipt.amountShort = this.decimalPipe.transform(cashDonation.amount, '1.0-0', 'id')!;
  //   receipt.date = new Date(cashDonation.date).toLocaleDateString('id', { day: 'numeric', month: 'long', year: 'numeric' });
  //
  //   this.cashDonationService.getReceipt(receipt).subscribe(
  //     data => {
  //       const blob = new Blob([data], { type: 'application/pdf' });
  //       const url = window.URL.createObjectURL(blob);
  //       window.open(url);
  //     }
  //   );
  // }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSearch(search: string) {
    if (!this.originalCashDonations) {
      this.originalCashDonations = [...this.cashDonations];
    }

    if (search === '') {
      this.cashDonations = [...this.originalCashDonations];
      return;
    }

    const searchValue = search.toLowerCase();
    this.cashDonations = this.originalCashDonations.filter((cashDonation: CashDonation) => {
      const workAreaMatch = cashDonation.user.workArea.toLowerCase().includes(searchValue);
      const receiptNumberMatch = cashDonation.receiptNumber.toLowerCase().includes(searchValue);
      const date = new Date(cashDonation.date);
      const dateMatch = date.toLocaleDateString('id', {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).includes(searchValue);
      const donorIdMatch = cashDonation.donor.donorId?.toLowerCase().includes(searchValue);
      const donorNameMatch = cashDonation.donor.name.toLowerCase().includes(searchValue);
      const contractMatch = cashDonation.contract.replaceAll('_', ' ').toLowerCase().includes(searchValue);
      const amountMatch = cashDonation.amount.toLocaleString('id', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).includes(searchValue);
      const statusMatch = cashDonation.status.toLowerCase().includes(searchValue);
      return workAreaMatch || receiptNumberMatch || dateMatch || donorIdMatch || donorNameMatch || contractMatch || amountMatch || statusMatch;
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
