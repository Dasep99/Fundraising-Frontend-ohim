import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TransferDonationService} from "../../service/transfer-donation.service";
import {TransferDonation} from "../../common/transfer-donation";
import {NgForm} from "@angular/forms";
import {Donor} from "../../common/donor";
import {DonorService} from "../../service/donor.service";
import {AuthService} from "../../service/auth.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-transfer-donation',
  templateUrl: './transfer-donation.component.html',
  styleUrls: ['./transfer-donation.component.css']
})
export class TransferDonationComponent implements OnInit {

  transferDonations: TransferDonation[] = [];
  transferDonation?: TransferDonation;
  originalTransferDonations?: TransferDonation[];
  donors: Donor[] = [];
  donor?: Donor;
  userId: string = '' + this.authService.getUserId();
  userRole: string = '' + this.authService.getCurrentUserRole();
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  selectedFile?: File | null = null;
  errors?: any;

  constructor(private transferDonationService: TransferDonationService,
              private modal: NgbModal,
              private donorService: DonorService,
              private authService: AuthService) {
  }

  ngOnInit() {
    if (this.userRole === 'CRM' || this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI') {
      this.getTransferDonationsByUserId(this.userId);
    } else {
      this.getAllTransferDonations();
    }

    this.getAllDonors();
  }

  getAllTransferDonations() {
    this.transferDonationService.getTransferDonations().subscribe(
      (data: TransferDonation[]) => {
        this.transferDonations = data;
        this.originalTransferDonations = [...this.transferDonations];
        this.transferDonations.forEach(transferDonation => {
          this.transferDonationService.getImageUrl(transferDonation.receiptPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                transferDonation.receiptPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  getAllDonors() {
    this.donorService.getDonors().subscribe(
      (data: Donor[]) => {
        this.donors = data
      }
    )
  }

  getTransferDonationsByUserId(userId: string): void {
    this.transferDonationService.getTransferDonations().subscribe(
      (data: TransferDonation[]) => {
        this.transferDonations = data.filter(transferDonation => transferDonation.user.id === userId);
        this.originalTransferDonations = [...this.transferDonations];
        this.transferDonations.forEach(transferDonation => {
          this.transferDonationService.getImageUrl(transferDonation.receiptPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                transferDonation.receiptPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  onAddTransferDonation(addForm: NgForm) {
    addForm.value.amount = this.removeDotNumber(addForm.value.amount)
    const formData = new FormData();
    formData.append('date', addForm.value.date);
    formData.append('contract', addForm.value.contract);
    formData.append('amount', addForm.value.amount);
    formData.append('transfersAccount', addForm.value.transfersAccount);
    formData.append('status', addForm.value.status);
    formData.append('donorId', addForm.value.donorId);
    formData.append('userId', this.userId);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.transferDonationService.addTransferDonation(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI' || this.userRole === 'CRM') {
          this.getTransferDonationsByUserId(this.userId);
        } else {
          this.getAllTransferDonations();
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

  onUpdateTransferDonation(updateForm: NgForm): void {
    updateForm.value.amount = this.removeDotNumber(updateForm.value.amount)
    const formData = new FormData();
    formData.append('id', updateForm.value.id);
    formData.append('date', updateForm.value.date);
    formData.append('contract', updateForm.value.contract);
    formData.append('amount', updateForm.value.amount);
    formData.append('transfersAccount', updateForm.value.transfersAccount);
    formData.append('status', updateForm.value.status);
    formData.append('donorId', updateForm.value.donorId);
    formData.append('userId', this.transferDonation!.user.id);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.transferDonationService.updateTransferDonation(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI' || this.userRole === 'CRM') {
          this.getTransferDonationsByUserId(this.userId);
        } else {
          this.getAllTransferDonations();
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

  onDeleteTransferDonation(id: string): void {
    this.transferDonationService.deleteTransferDonation(id).subscribe(
      () => {
        if (this.userRole === 'CRM' || this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI') {
          this.getTransferDonationsByUserId(this.userId);
        } else {
          this.getAllTransferDonations();
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil dihapus';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    )
  }

  onAccStatusTransferDonation(id: string) {
    this.transferDonationService.updateAccTransferDonation(id).subscribe(
      () => {
        if (this.userRole === 'CRM' || this.userRole === 'FRONT_OFFICE' || this.userRole === 'TIM_JEMPUT_DONASI') {
          this.getTransferDonationsByUserId(this.userId);
        } else {
          this.getAllTransferDonations();
        }

        this.modal.dismissAll('success');
        this.alertMessage = 'Status donasi berhasil diubah';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
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

  openUpdateModal(content: any, transferDonation: TransferDonation) {
    this.transferDonation = transferDonation;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    $('.select2').select2({
      width: '100%'
    });
    $('#contractUpdate').select2({
      width: '100%'
    }).val(transferDonation.contract).trigger('change');
    $('#transfersAccountUpdate').select2({
      width: '100%'
    }).val(transferDonation.transfersAccount).trigger('change');
    document.getElementById('focusUpdate')?.focus();
  }

  openDeleteModal(content: any, transferDonation: TransferDonation) {
    this.transferDonation = transferDonation;
    this.modal.open(content)
    document.getElementById('delete')?.focus();
  }

  openAccModal(content: any, transferDonation: TransferDonation) {
    this.transferDonation = transferDonation;
    this.modal.open(content);
    document.getElementById('acc')?.focus();
  }

  openViewImage(content: any, transferDonation: TransferDonation) {
    this.transferDonation = transferDonation;
    this.modal.open(content);
    this.transferDonationService.getImageUrl(transferDonation.receiptPhoto);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSearch(search: string) {
    if (!this.originalTransferDonations) {
      this.originalTransferDonations = [...this.transferDonations];
    }

    if (search === '') {
      this.transferDonations = [...this.originalTransferDonations];
      return;
    }

    const searchValue = search.toLowerCase();
    this.transferDonations = this.originalTransferDonations.filter((transferDonation: TransferDonation) => {
      const date = new Date(transferDonation.date);
      const dateMatch = date.toLocaleDateString('id', {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).includes(searchValue);
      const donorIdMatch = transferDonation.donor.donorId?.toLowerCase().includes(searchValue);
      const donorNameMatch = transferDonation.donor.name.toLowerCase().includes(searchValue);
      const contractMatch = transferDonation.contract.replaceAll('_', ' ').toLowerCase().includes(searchValue);
      const amountMatch = transferDonation.amount.toLocaleString('id', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).includes(searchValue);
      const transfersAccountMatch = transferDonation.transfersAccount.replaceAll('_', ' ').toLowerCase().includes(searchValue);
      const statusMatch = transferDonation.status.toLowerCase().includes(searchValue);
      return dateMatch || donorIdMatch || donorNameMatch || contractMatch || amountMatch || transfersAccountMatch || statusMatch;
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
