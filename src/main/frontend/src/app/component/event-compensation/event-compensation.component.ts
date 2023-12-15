import {Component, OnInit} from '@angular/core';
import {EventCompensation} from "../../common/event-compensation";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EventCompensationService} from "../../service/event-compensation.service";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-event-compensation',
  templateUrl: './event-compensation.component.html',
  styleUrls: ['./event-compensation.component.css']
})
export class EventCompensationComponent implements OnInit {

  eventCompensations: EventCompensation[] = [];
  eventCompensation?: EventCompensation;
  originalEventCompensations?: EventCompensation[];
  userId: string = '' + this.authService.getUserId();
  userRole: string = '' + this.authService.getCurrentUserRole();
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  urlBkk: string | ArrayBuffer | null = null;
  urlDossier: string | ArrayBuffer | null = null;
  selectedFileBkk?: File | null = null;
  selectedFileDossier?: File | null = null;
  errors?: any;

  constructor(private modal: NgbModal,
              private eventCompensationService: EventCompensationService,
              private authService: AuthService) {
  }

  ngOnInit() {
    if (this.userRole === 'FRONT_OFFICE') {
      this.getEventCompensationsByUserId(this.userId)
    } else {
      this.getAllEventCompensations()
    }
  }

  getAllEventCompensations() {
    this.eventCompensationService.getEventCompensation().subscribe(
      (data: EventCompensation[]) => {
        this.eventCompensations = data;
        this.originalEventCompensations = [...this.eventCompensations];
        this.eventCompensations.forEach(eventCompensation => {
          this.eventCompensationService.getImageUrl(eventCompensation.bkkPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                eventCompensation.bkkPhoto = reader.result as string
              };
              reader.readAsDataURL(imageBlob);
            }
          );
          this.eventCompensationService.getImageUrl(eventCompensation.dossierPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                eventCompensation.dossierPhoto = reader.result as string
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );

  }

  getEventCompensationsByUserId(userId: string): void {
    this.eventCompensationService.getEventCompensation().subscribe(
      (data: EventCompensation[]) => {
        this.eventCompensations = data.filter(eventCompensation => eventCompensation.user.id === userId);
        this.originalEventCompensations = [...this.eventCompensations];
        this.eventCompensations.forEach(eventCompensation => {
          this.eventCompensationService.getImageUrl(eventCompensation.bkkPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                eventCompensation.bkkPhoto = reader.result as string
              };
              reader.readAsDataURL(imageBlob);
            }
          );
          this.eventCompensationService.getImageUrl(eventCompensation.dossierPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                eventCompensation.dossierPhoto = reader.result as string
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  onAddEventCompensation(addForm: NgForm) {
    addForm.value.amount = this.removeDotNumber(addForm.value.amount)
    const formData = new FormData();
    formData.append('date', addForm.value.date);
    formData.append('contract', addForm.value.contract);
    formData.append('amount', addForm.value.amount);
    formData.append('userId', this.userId);

    if (this.selectedFileBkk) {
      formData.append('bkkFile', this.selectedFileBkk);
    }
    if (this.selectedFileDossier) {
      formData.append('dossierFile', this.selectedFileDossier);
    }

    this.eventCompensationService.addEventCompensation(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getEventCompensationsByUserId(this.userId)
        } else {
          this.getAllEventCompensations()
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onUpdateEventCompensation(updateForm: NgForm): void {
    updateForm.value.amount = this.removeDotNumber(updateForm.value.amount)
    const formData = new FormData();
    formData.append('id', updateForm.value.id);
    formData.append('date', updateForm.value.date);
    formData.append('contract', updateForm.value.contract);
    formData.append('amount', updateForm.value.amount);
    formData.append('userId', this.eventCompensation!.user.id);

    if (this.selectedFileBkk) {
      formData.append('bkkFile', this.selectedFileBkk);
    }
    if (this.selectedFileDossier) {
      formData.append('dossierFile', this.selectedFileDossier);
    }

    this.eventCompensationService.updateEventCompensation(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getEventCompensationsByUserId(this.userId)
        } else {
          this.getAllEventCompensations()
        }
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil diubah';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onDeleteEventCompensation(id: string): void {
    this.eventCompensationService.deleteEventCompensation(id).subscribe(
      () => {
        if (this.userRole === 'FRONT_OFFICE') {
          this.getEventCompensationsByUserId(this.userId)
        } else {
          this.getAllEventCompensations()
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

  openUpdateModal(content: any, eventCompensation: EventCompensation) {
    this.eventCompensation = eventCompensation;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    document.getElementById('updateDate')?.focus();
  }

  openDeleteModal(content: any, eventCompensation: EventCompensation) {
    this.eventCompensation = eventCompensation;
    this.modal.open(content)
    document.getElementById('delete')?.focus();
  }

  openViewImageBkk(content: any, eventCompensation: EventCompensation) {
    this.modal.open(content)
    this.eventCompensation = eventCompensation;
    this.urlBkk = eventCompensation.bkkPhoto;
    this.eventCompensationService.getImageUrl(eventCompensation.bkkPhoto)
  }

  openViewImageDossier(content: any, eventCompensation: EventCompensation) {
    this.modal.open(content)
    this.eventCompensation = eventCompensation;
    this.urlDossier = eventCompensation.dossierPhoto;
    this.eventCompensationService.getImageUrl(eventCompensation.dossierPhoto)
  }

  onFileSelectedBkk(event: any): void {
    this.selectedFileBkk = event.target.files[0];
  }

  onFileSelectedDossier(event: any): void {
    this.selectedFileDossier = event.target.files[0];
  }

  onSearch(search: string) {
    if (!this.originalEventCompensations) {
      this.originalEventCompensations = [...this.eventCompensations];
    }

    if (search === '') {
      this.eventCompensations = [...this.originalEventCompensations];
      return;
    }

    const searchValue = search.toLowerCase();
    this.eventCompensations = this.originalEventCompensations.filter((eventCompensation: EventCompensation) => {
      const date = new Date(eventCompensation.date);
      const dateMatch = date.toLocaleDateString('id', { day: "2-digit", month: "2-digit", year: "numeric" }).includes(searchValue);
      const contractMatch = eventCompensation.contract.replaceAll('_', ' ').toLowerCase().includes(searchValue);
      const amountMatch = eventCompensation.amount.toLocaleString('id', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).includes(searchValue);
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
