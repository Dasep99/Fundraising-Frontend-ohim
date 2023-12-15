import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PickupDonationService} from "../../service/pickup-donation.service";
import {PickupDonation} from "../../common/pickup-donation";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {CharityBox} from "../../common/charity-box";
import {CharityBoxService} from "../../service/charity-box.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-pickup-donation',
  templateUrl: './pickup-donation.component.html',
  styleUrls: ['./pickup-donation.component.css']
})
export class PickupDonationComponent implements OnInit {

  pickupDonations: PickupDonation[] = [];
  pickupDonation?: PickupDonation;
  originalPickupDonations?: PickupDonation[];
  charityBoxes: CharityBox[] = [];
  userId: string = '' + this.authService.getUserId();
  userRole: string = '' + this.authService.getCurrentUserRole();
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  url: string | ArrayBuffer | null = null;
  selectedFile?: File | null = null;
  errors?: any;

  constructor(private pickupDonationService: PickupDonationService,
              private charityBoxService: CharityBoxService,
              private modal: NgbModal,
              private authService: AuthService) {
  }

  ngOnInit() {
    if (this.userRole === 'PETUGAS_PUNDI') {
      this.getPickupDonationsByUserId(this.userId)
      this.getCharityBoxesByUserId(this.userId)
    } else {
      this.getAllPickupDonations()
      this.getAllCharityBoxes()
    }
  }

  getAllPickupDonations() {
    this.pickupDonationService.getPickUpDonations().subscribe(
      (data: PickupDonation[]) => {
        this.pickupDonations = data;
        this.originalPickupDonations = [...this.pickupDonations];
        this.pickupDonations.forEach(pickupDonation => {
          this.pickupDonationService.getImageUrl(pickupDonation.photo).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                pickupDonation.photo = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  getAllCharityBoxes() {
    this.charityBoxService.getCharityBoxes().subscribe(
      (data: CharityBox[]) => {
        this.charityBoxes = data
      }
    )
  }

  getCharityBoxesByUserId(userId: string): void {
    this.charityBoxService.getCharityBoxes().subscribe(
      data => {
        this.charityBoxes = data.filter(charityBoxes => charityBoxes.user.id === userId);
      }
    )
  }

  getPickupDonationsByUserId(userId: string): void {
    this.pickupDonationService.getPickUpDonations().subscribe(
      (data: PickupDonation[]) => {
        this.pickupDonations = data.filter(pickupDonation => pickupDonation.user.id === userId);
        this.originalPickupDonations = [...this.pickupDonations];
        this.pickupDonations.forEach(pickupDonation => {
          this.pickupDonationService.getImageUrl(pickupDonation.photo).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                pickupDonation.photo = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  onAddPickupDonation(addForm: NgForm) {
    if (addForm.value.amount) {
      addForm.value.amount = this.removeDotNumber(addForm.value.amount);
    }
    const formData = new FormData();
    formData.append('date', addForm.value.date);
    formData.append('pickUpInfo', addForm.value.pickUpInfo);
    formData.append('amount', addForm.value.amount || '');
    formData.append('receiptNumber', addForm.value.receiptNumber || '');
    formData.append('replaced', addForm.value.replaced || '');
    formData.append('otherInfo', addForm.value.otherInfo || '');
    formData.append('charityBoxId', addForm.value.charityBoxId);
    formData.append('donorId', addForm.value.donorId);
    formData.append('userId', this.userId);

    if (addForm.value.contract === 'LAINNYA') {
      formData.append('contract', addForm.value.otherContract || '');
    } else {
      formData.append('contract', addForm.value.contract || '');
    }

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.pickupDonationService.addPickUpDonation(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'PETUGAS_PUNDI') {
          this.getPickupDonationsByUserId(this.userId)
          this.getCharityBoxesByUserId(this.userId)
        } else {
          this.getAllPickupDonations()
          this.getAllCharityBoxes()
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onUpdatePickupDonation(updateForm: NgForm): void {
    if (updateForm.value.amount) {
      updateForm.value.amount = this.removeDotNumber(updateForm.value.amount);
    }
    const formData = new FormData();
    formData.append('id', updateForm.value.id);
    formData.append('date', updateForm.value.date);
    formData.append('pickUpInfo', updateForm.value.pickUpInfo);
    formData.append('amount', updateForm.value.amount || '');
    formData.append('receiptNumber', updateForm.value.receiptNumber || '');
    formData.append('replaced', updateForm.value.replaced || '');
    formData.append('otherInfo', updateForm.value.otherInfo || '');
    formData.append('charityBoxId', updateForm.value.charityBoxId);
    formData.append('donorId', updateForm.value.donorId);
    formData.append('userId', this.pickupDonation!.user.id);

    if (updateForm.value.contract === 'LAINNYA') {
      formData.append('contract', updateForm.value.otherContract || '');
    } else {
      formData.append('contract', updateForm.value.contract || '');
    }

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.pickupDonationService.updatePickUpDonation(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'PETUGAS_PUNDI') {
          this.getPickupDonationsByUserId(this.userId)
          this.getCharityBoxesByUserId(this.userId)
        } else {
          this.getAllPickupDonations()
          this.getAllCharityBoxes()
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil diubah';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onDeletePickupDonation(id: string): void {
    this.pickupDonationService.deletePickUpDonation(id).subscribe(
      () => {
        if (this.userRole === 'PETUGAS_PUNDI') {
          this.getPickupDonationsByUserId(this.userId)
          this.getCharityBoxesByUserId(this.userId)
        } else {
          this.getAllPickupDonations()
          this.getAllCharityBoxes()
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil dihapus'
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

  openUpdateModal(content: any, pickupDonation: PickupDonation) {
    const oldContract = pickupDonation.contract;
    this.pickupDonation = pickupDonation;

    if (pickupDonation.contract !== 'ZAKAT' && pickupDonation.contract !== 'INSHO') {
      pickupDonation.otherContract = pickupDonation.contract;
      pickupDonation.contract = 'LAINNYA';
    }

    this.modal.open(content).result.then(() => {
      this.errors = undefined;
    }, () => {
      pickupDonation.contract = oldContract;
      this.errors = undefined;
    });

    document.getElementById('updateDate')?.focus();
  }

  openDeleteModal(content: any, pickupDonation: PickupDonation) {
    this.pickupDonation = pickupDonation;
    this.modal.open(content);
    document.getElementById('delete')?.focus();
  }

  openViewImage(content: any, pickupDonation: PickupDonation) {
    this.modal.open(content);
    this.pickupDonation = pickupDonation;
    this.url = pickupDonation.photo;
    this.pickupDonationService.getImageUrl(pickupDonation.photo)
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSearch(search: string) {
    if (!this.originalPickupDonations) {
      this.originalPickupDonations = [...this.pickupDonations];
    }

    if (search === '') {
      this.pickupDonations = [...this.originalPickupDonations];
      return;
    }

    const searchValue = search.toLowerCase();
    this.pickupDonations = this.originalPickupDonations.filter((pickupDonation: PickupDonation) => {
      const date = new Date(pickupDonation.date);
      const dateMatch = date.toLocaleDateString('id', { day: "2-digit", month: "2-digit", year: "numeric" }).includes(searchValue);
      const pickUpInfoMatch = pickupDonation.pickUpInfo.toLowerCase().includes(searchValue);
      const amountMatch = pickupDonation.amount?.toLocaleString('id', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).includes(searchValue);
      const contractMatch = pickupDonation.contract?.replaceAll('_', ' ').toLowerCase().includes(searchValue);
      const receiptNumberMatch = pickupDonation.receiptNumber?.toLowerCase().includes(searchValue);
      const replacedMatch = pickupDonation.replaced?.toLowerCase().includes(searchValue);
      const otherInfoMatch = pickupDonation.otherInfo?.toLowerCase().includes(searchValue);
      const charityBox = pickupDonation.charityBox.code + " (" + pickupDonation.charityBox.outletName + "-" + pickupDonation.charityBox.ownerName + ")";
      const charityBoxMatch = charityBox.toLowerCase().includes(searchValue);
      return dateMatch || pickUpInfoMatch || amountMatch || contractMatch || receiptNumberMatch || replacedMatch || otherInfoMatch || charityBoxMatch;
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
