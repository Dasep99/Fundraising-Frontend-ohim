import {Component, OnInit} from '@angular/core';
import {CashlessDonationService} from "../../service/cashless-donation.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Donor} from "../../common/donor";
import {CashlessDonation} from "../../common/cashless-donation";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {DonorService} from "../../service/donor.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-cashless-donation',
  templateUrl: './cashless-donation.component.html',
  styleUrls: ['./cashless-donation.component.css']
})
export class CashlessDonationComponent implements OnInit {

  cashlessDonations: CashlessDonation[] = [];
  cashlessDonation?: CashlessDonation;
  originalCashlessDonations?: CashlessDonation[];
  donors: Donor[] = []
  donor?: Donor
  userId: string = '' + this.authService.getUserId()
  userRole: string = '' + this.authService.getCurrentUserRole()
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  url: string | ArrayBuffer | null = null;
  selectedFile?: File | null = null;
  errors?: any;

  constructor(private cashlessDonationService: CashlessDonationService,
              private modal: NgbModal,
              private donorService: DonorService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.getAllDonors();

    if (this.userRole === 'FRONT_OFFICE') {
      this.getCashlessDonationsByUserId(this.userId);
    } else {
      this.getAllCashlessDonations();
    }
  }

  getAllDonors() {
    this.donorService.getDonors().subscribe(
      (data: Donor[]) => {
        this.donors = data
      }
    )
  }

  getAllCashlessDonations() {
    this.cashlessDonationService.getCashlessDonations().subscribe(
      (data: CashlessDonation[]) => {
        this.cashlessDonations = data;
        this.originalCashlessDonations = [...this.cashlessDonations];
        this.cashlessDonations.forEach(cashlessDonation => {
          this.cashlessDonationService.getImageUrl(cashlessDonation.receiptPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                cashlessDonation.receiptPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  getCashlessDonationsByUserId(userId: string): void {
    this.cashlessDonationService.getCashlessDonations().subscribe(
      (data: CashlessDonation[]) => {
        this.cashlessDonations = data.filter(cashlessDonation => cashlessDonation.user.id === userId);
        this.originalCashlessDonations = [...this.cashlessDonations];
        this.cashlessDonations.forEach(cashlessDonation => {
          this.cashlessDonationService.getImageUrl(cashlessDonation.receiptPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                cashlessDonation.receiptPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  onAddCashlessDonation(addForm: NgForm) {
    const formData = new FormData();
    formData.append('date', addForm.value.date);
    formData.append('contract', addForm.value.contract);
    // formData.append('receiptNumber', addForm.value.receiptNumber);
    formData.append('items', addForm.value.items);
    formData.append('otherInfo', addForm.value.otherInfo);
    formData.append('donorId', addForm.value.donorId);
    formData.append('userId', this.userId);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.cashlessDonationService.addCashlessDonation(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        this.getAllDonors();

        if (this.userRole === 'FRONT_OFFICE') {
          this.getCashlessDonationsByUserId(this.userId);
        } else {
          this.getAllCashlessDonations();
        }

        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onUpdateCashlessDonation(updateForm: NgForm): void {
    const formData = new FormData();
    formData.append('id', updateForm.value.id);
    formData.append('date', updateForm.value.date);
    formData.append('contract', updateForm.value.contract);
    // formData.append('receiptNumber', updateForm.value.receiptNumber);
    formData.append('items', updateForm.value.items);
    formData.append('otherInfo', updateForm.value.otherInfo);
    formData.append('donorId', updateForm.value.donorId);
    formData.append('userId', this.cashlessDonation!.user.id);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.cashlessDonationService.updateCashLessDonation(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        this.getAllDonors();

        if (this.userRole === 'FRONT_OFFICE') {
          this.getCashlessDonationsByUserId(this.userId);
        } else {
          this.getAllCashlessDonations();
        }

        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil diubah';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onDeleteCashlessDonation(id: string): void {
    this.cashlessDonationService.deleteCashlessDonation(id).subscribe(
      () => {
        this.getAllDonors();

        if (this.userRole === 'FRONT_OFFICE') {
          this.getCashlessDonationsByUserId(this.userId);
        } else {
          this.getAllCashlessDonations();
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
    document.getElementById('addDonor')?.focus();
  }

  openUpdateModal(content: any, cashlessDonation: CashlessDonation) {
    this.cashlessDonation = cashlessDonation;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    document.getElementById('updateDonor')?.focus();
  }

  openDeleteModal(content: any, cashlessDonation: CashlessDonation) {
    this.cashlessDonation = cashlessDonation;
    this.modal.open(content)
    document.getElementById('delete')?.focus();
  }

  openViewImage(content: any, cashlessDonation: CashlessDonation) {
    this.modal.open(content)
    this.cashlessDonation = cashlessDonation;
    this.url = cashlessDonation.receiptPhoto;
    this.cashlessDonationService.getImageUrl(cashlessDonation.receiptPhoto)
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSearch(search: string) {
    if (!this.originalCashlessDonations) {
      this.originalCashlessDonations = [...this.cashlessDonations];
    }

    if (search === '') {
      this.cashlessDonations = [...this.originalCashlessDonations];
      return;
    }

    const searchValue = search.toLowerCase();
    this.cashlessDonations = this.originalCashlessDonations.filter((cashlessDonation: CashlessDonation) => {
      const date = new Date(cashlessDonation.date);
      const dateMatch = date.toLocaleDateString('id', {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).includes(searchValue);
      const contractMatch = cashlessDonation.contract.replaceAll('_', ' ').toLowerCase().includes(searchValue);
      const receiptNumberMatch = cashlessDonation.receiptNumber.toLowerCase().includes(searchValue);
      const itemsMatch = cashlessDonation.items.join(" ").toLowerCase().includes(searchValue);
      const otherInfoMatch = cashlessDonation.otherInfo?.toLowerCase().includes(searchValue);
      const donorMatch = cashlessDonation.donor.name.toLowerCase().includes(searchValue);
      return dateMatch || contractMatch || receiptNumberMatch || itemsMatch || otherInfoMatch || donorMatch;
    });
  }
}
