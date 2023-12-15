import {Component, OnInit} from '@angular/core';
import {DonorService} from "../../service/donor.service";
import {Donor} from "../../common/donor";
import {NgForm} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../service/auth.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Region} from "../../common/region";
import {CashDonationService} from "../../service/cash-donation.service";
import {TransferDonationService} from "../../service/transfer-donation.service";
import {CashlessDonationService} from "../../service/cashless-donation.service";
import {VisitService} from "../../service/visit.service";

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
  donateMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  selectedFile?: File | null = null;
  errors?: any;
  error?: HttpErrorResponse;
  provinces: Region[] = [];
  regencies: Region[] = [];
  districts: Region[] = [];
  villages: Region[] = [];
  receiptNumber?: string;

  constructor(private donorService: DonorService,
              private modal: NgbModal,
              private authService: AuthService,
              private cashDonationService: CashDonationService,
              private transferDonationService: TransferDonationService,
              private cashlessDonationService: CashlessDonationService,
              private visitService: VisitService) {
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
    addForm.value.userId = this.userId;
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
    );
  }

  onUpdateDonor(updateForm: NgForm): void {
    updateForm.value.userId = this.userId;
    this.donorService.updateDonor(updateForm.value).pipe(
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
    this.donorService.deleteDonor(id).pipe(
      catchError((error: HttpErrorResponse) => {
        this.error = error;
        return [];
      })
    ).subscribe(
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

  onAddCashDonation(cashDonationForm: NgForm) {
    cashDonationForm.value.amount = this.removeDotNumber(cashDonationForm.value.amount);
    const formData = new FormData();
    formData.append('date', cashDonationForm.value.date);
    formData.append('contract', cashDonationForm.value.contract);
    formData.append('amount', cashDonationForm.value.amount);
    formData.append('receiptNumber', cashDonationForm.value.receiptNumber);
    formData.append('status', cashDonationForm.value.status);
    formData.append('donorId', cashDonationForm.value.donorId);
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
        this.getAllDonors();
        this.modal.dismissAll('success');
        this.alertMessage = 'Donatur berhasil berdonasi cash';
        this.donateMessage = '/donasi-cash';
        setTimeout(() => {
          this.alertMessage = '';
          this.donateMessage = '';
        }, 5000)
      }
    );
  }

  onAddTransferDonation(transferDonationForm: NgForm) {
    transferDonationForm.value.amount = this.removeDotNumber(transferDonationForm.value.amount)
    const formData = new FormData();
    formData.append('date', transferDonationForm.value.date);
    formData.append('contract', transferDonationForm.value.contract);
    formData.append('amount', transferDonationForm.value.amount);
    formData.append('transfersAccount', transferDonationForm.value.transfersAccount);
    formData.append('status', transferDonationForm.value.status);
    formData.append('donorId', transferDonationForm.value.donorId);
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
        this.getAllDonors();
        this.modal.dismissAll('success');
        this.alertMessage = 'Donatur berhasil berdonasi transfer';
        this.donateMessage = '/donasi-transfer';
        setTimeout(() => {
          this.alertMessage = '';
          this.donateMessage = '';
        }, 5000)
      }
    );
  }

  onAddVisit(visitForm: NgForm) {
    const formData = new FormData();
    formData.append('date', visitForm.value.date);
    formData.append('donorId', visitForm.value.donorId);
    formData.append('userId', this.userId);

    if (visitForm.value.purpose === 'LAINNYA') {
      formData.append('purpose', visitForm.value.otherPurpose);
    } else {
      formData.append('purpose', visitForm.value.purpose);
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
        this.getAllDonors();
        this.modal.dismissAll('success');
        this.alertMessage = 'Donatur berhasil berkunjung tamu';
        this.donateMessage = '/tamu';
        setTimeout(() => {
          this.alertMessage = '';
          this.donateMessage = '';
        }, 5000)
      }
    );
  }

  openAddModal(content: any) {
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
      this.provinces = [];
      this.regencies = [];
      this.districts = [];
      this.villages = [];
    });
    document.getElementById('focusAdd')?.focus();
  }

  openUpdateModal(content: any, donor: Donor) {
    this.onProvinceClicked();
    if (donor.province !== null) {
      this.onRegencyClicked(donor.province!.id);
    }
    if (donor.regency !== null) {
      this.onDistrictClicked(donor.regency!.id);
    }
    if (donor.district !== null) {
      this.onVillageClicked(donor.district!.id);
    }

    this.donor = donor;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
      this.provinces = [];
      this.regencies = [];
      this.districts = [];
      this.villages = [];
    });
    document.getElementById('focusUpdate')?.focus();
  }

  openDeleteModal(content: any, donor: Donor) {
    this.donor = donor;
    this.modal.open(content).result.finally(() => {
      this.error = undefined;
    });
    document.getElementById('delete')?.focus();
  }

  openAddCashDonation(content: any, donor: Donor) {
    this.cashDonationService.generateReceiptNumber(this.userId).subscribe(
      data => {
        this.receiptNumber = data.receiptNumber;
      }
    );

    this.donor = donor;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    $('.select2').select2({
      width: '100%'
    }).val('').trigger('change');
    document.getElementById('focusCash')?.focus();
  }

  openAddTransferDonation(content: any, donor: Donor) {
    this.donor = donor;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    $('.select2').select2({
      width: '100%'
    }).val('').trigger('change');
    document.getElementById('focusTransfer')?.focus();
  }

  openAddVisit(content: any, donor: Donor) {
    this.donor = donor;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    $('.select2').select2({
      width: '100%'
    }).val('').trigger('change');
    document.getElementById('focusVisit')?.focus();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
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
      const donorIdMatch = donor.donorId?.toLowerCase().includes(searchValue);
      const nikMatch = donor.nik?.toLowerCase().includes(searchValue);
      const nameMatch = donor.name.toLowerCase().includes(searchValue);
      const genderMatch = donor.gender?.toLowerCase().includes(searchValue);
      let birthDateMatch = false;
      if (donor.birthDate != null) {
        const birthDate = new Date(donor.birthDate);
        birthDateMatch = birthDate.toLocaleDateString('id', {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }).includes(searchValue);
      }
      const phoneNumberMatch = donor.phoneNumber?.includes(searchValue);
      const streetMatch = donor.street?.toLowerCase().includes(searchValue);
      const provinceNameMatch = donor.province?.name.toLowerCase().includes(searchValue);
      const regencyNameMatch = donor.regency?.name.toLowerCase().includes(searchValue);
      const districtNameMatch = donor.district?.name.toLowerCase().includes(searchValue);
      const villageNameMatch = donor.village?.name.toLowerCase().includes(searchValue);
      const emailMatch = donor.email?.toLowerCase().includes(searchValue);
      const jobMatch = donor.job?.toLowerCase().includes(searchValue);
      const typeMatch = donor.type.toLowerCase().includes(searchValue);
      const otherInfoMatch = donor.otherInfo?.toLowerCase().includes(searchValue);
      const ageSegmentationMatch = donor.ageSegmentation?.toLowerCase().includes(searchValue);
      const activenessMatch = donor.activeness?.toLowerCase().includes(searchValue);
      return donorIdMatch || nikMatch || nameMatch || genderMatch || birthDateMatch || phoneNumberMatch || streetMatch || provinceNameMatch || regencyNameMatch || districtNameMatch || villageNameMatch || emailMatch || jobMatch || typeMatch || otherInfoMatch || ageSegmentationMatch || activenessMatch;
    });
  }

  onProvinceClicked() {
    if (this.provinces.length === 0) {
      this.donorService.getProvinces().subscribe(
        data => {
          this.provinces = data;
        }
      );
    }
  }

  onRegencyClicked(provinceId: string) {
    if (this.regencies.length === 0 && provinceId !== '') {
      this.donorService.getRegencies(provinceId).subscribe(
        data => {
          this.regencies = data;
        }
      );
    }
  }

  onDistrictClicked(regencyId: string) {
    if (this.districts.length === 0 && regencyId !== '') {
      this.donorService.getDistricts(regencyId).subscribe(
        data => {
          this.districts = data;
        }
      );
    }
  }

  onVillageClicked(districtId: string) {
    this.donorService.getVillages(districtId).subscribe(
      data => {
        this.villages = data;
      }
    );
  }

  onProvinceChanged(regencySelect: HTMLSelectElement, districtSelect: HTMLSelectElement, villageSelect: HTMLSelectElement) {
    this.regencies = [];
    this.districts = [];
    this.villages = [];
    regencySelect.selectedIndex = 0;
    districtSelect.selectedIndex = 0;
    villageSelect.selectedIndex = 0;
    regencySelect.dispatchEvent(new Event('change'));
    districtSelect.dispatchEvent(new Event('change'));
    villageSelect.dispatchEvent(new Event('change'));
  }

  onRegencyChanged(districtSelect: HTMLSelectElement, villageSelect: HTMLSelectElement) {
    this.districts = [];
    this.villages = [];
    districtSelect.selectedIndex = 0;
    villageSelect.selectedIndex = 0;
    districtSelect.dispatchEvent(new Event('change'));
    villageSelect.dispatchEvent(new Event('change'));
  }

  onDistrictChanged(villageSelect: HTMLSelectElement) {
    this.villages = [];
    villageSelect.selectedIndex = 0;
    villageSelect.dispatchEvent(new Event('change'));
  }

  removeDotNumber(input: string): number {
    input = input.replace(/\./g, '');
    input = input.replace(/,/g, '.');
    return Number(input);
  }
}
