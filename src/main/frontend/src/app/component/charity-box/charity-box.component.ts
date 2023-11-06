import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CharityBoxService} from "../../service/charity-box.service";
import {CharityBox} from "../../common/charity-box";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {catchError} from "rxjs";
import * as L from 'leaflet';
import {LatLng} from "leaflet";

@Component({
  selector: 'app-charity-box',
  templateUrl: './charity-box.component.html',
  styleUrls: ['./charity-box.component.css']
})
export class CharityBoxComponent implements OnInit {

  charityBoxes: CharityBox[] = [];
  charityBox?: CharityBox;
  originalCharityBoxes?: CharityBox[];
  originalCharityBox?: CharityBox;
  userId: string = '' + this.authService.getUserId();
  userRole: string = '' + this.authService.getCurrentUserRole();
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  url: string | ArrayBuffer | null = null;
  selectedFile?: File | null = null;
  errors?: any;
  addMap?: L.Map;
  updateMap?: L.Map;
  coordinates?: L.LatLng;
  coordinatesText: string = '';
  activeMarker: L.Marker | null = null;

  constructor(private charityBoxService: CharityBoxService,
              private modal: NgbModal,
              private authService: AuthService) {
  }

  ngOnInit() {
    if (this.userRole === 'PETUGAS_PUNDI') {
      this.getCharityBoxesByUserId(this.userId);
    } else {
      this.getAllCharityBoxes();
    }
  }

  getAllCharityBoxes() {
    this.charityBoxService.getCharityBoxes().subscribe(
      (data: CharityBox[]) => {
        this.charityBoxes = data;
        this.originalCharityBoxes = [...this.charityBoxes];
        this.charityBoxes.forEach(charityBox => {
          this.charityBoxService.getImageUrl(charityBox.outletPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                charityBox.outletPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  getCharityBoxesByUserId(userId: string): void {
    this.charityBoxService.getCharityBoxes().subscribe(
      (data: CharityBox[]) => {
        this.charityBoxes = data.filter(charityBox => charityBox.user.id === userId);
        this.originalCharityBoxes = [...this.charityBoxes];
        this.charityBoxes.forEach(charityBox => {
          this.charityBoxService.getImageUrl(charityBox.outletPhoto).subscribe(
            (imageBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                charityBox.outletPhoto = reader.result as string;
              };
              reader.readAsDataURL(imageBlob);
            }
          );
        });
      }
    );
  }

  onAddCharityBox(addForm: NgForm) {
    const formData = new FormData();
    formData.append('charityBoxInfo', addForm.value.charityBoxInfo);
    formData.append('outletName', addForm.value.outletName);
    // formData.append('code', addForm.value.code);
    formData.append('address', addForm.value.address);
    formData.append('phoneNumber', addForm.value.phoneNumber);
    formData.append('ownerName', addForm.value.ownerName);
    formData.append('depositDate', addForm.value.depositDate);
    formData.append('coordinates', addForm.value.coordinates);
    formData.append('otherInfo', addForm.value.otherInfo);
    formData.append('userId', this.userId);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.charityBoxService.addCharityBox(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'PETUGAS_PUNDI') {
          this.getCharityBoxesByUserId(this.userId)
        } else {
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

  onUpdateCharityBox(updateForm: NgForm): void {
    const formData = new FormData();
    formData.append('id', updateForm.value.id);
    formData.append('charityBoxInfo', updateForm.value.charityBoxInfo);
    formData.append('outletName', updateForm.value.outletName);
    // formData.append('code', updateForm.value.code);
    formData.append('address', updateForm.value.address);
    formData.append('phoneNumber', updateForm.value.phoneNumber);
    formData.append('ownerName', updateForm.value.ownerName);
    formData.append('depositDate', updateForm.value.depositDate);
    formData.append('coordinates', updateForm.value.coordinates);
    formData.append('otherInfo', updateForm.value.otherInfo);
    formData.append('userId', this.charityBox!.user.id);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.charityBoxService.updateCharityBox(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        if (this.userRole === 'PETUGAS_PUNDI') {
          this.getCharityBoxesByUserId(this.userId)
        } else {
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

  onDeleteCharityBox(id: string): void {
    this.charityBoxService.deleteCharityBox(id).subscribe(
      () => {
        if (this.userRole === 'PETUGAS_PUNDI') {
          this.getCharityBoxesByUserId(this.userId)
        } else {
          this.getAllCharityBoxes()
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
      this.coordinatesText = '';
    });
    document.getElementById('addCharityBoxInfo')?.focus();

    this.addMap = L.map('addMap').setView([-6.737526, 108.5655139], 16);
    this.addMap.locate({setView: true, maxZoom: 16});

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.addMap);

    this.addMap.on('click', (e: L.LeafletMouseEvent) => {
      if (this.activeMarker) {
        this.addMap?.removeLayer(this.activeMarker);
      }

      this.activeMarker = L.marker(e.latlng).addTo(this.addMap!);
      this.coordinates = e.latlng;

      if (this.coordinates) {
        this.coordinatesText = `${this.coordinates.lat},${this.coordinates.lng}`;
      }
    });
  }

  openUpdateModal(content: any, charityBox: CharityBox) {
    this.charityBox = charityBox;
    this.originalCharityBox = {...charityBox};
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
      charityBox.coordinates = this.originalCharityBox!.coordinates;
    });
    document.getElementById('updateCharityBoxInfo')?.focus();

    const latLng: string[] = charityBox.coordinates.split(',');
    const lat: number = Number(latLng[0]);
    const lng: number = Number(latLng[1]);
    this.updateMap = L.map('updateMap').setView([lat, lng], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.updateMap);
    this.activeMarker = L.marker(new LatLng(lat, lng)).addTo(this.updateMap);

    this.updateMap.on('click', (e: L.LeafletMouseEvent) => {
      if (this.activeMarker) {
        this.updateMap?.removeLayer(this.activeMarker);
      }

      this.activeMarker = L.marker(e.latlng).addTo(this.updateMap!);
      this.coordinates = e.latlng;

      if (this.coordinates) {
        this.charityBox!.coordinates = `${this.coordinates.lat},${this.coordinates.lng}`;
      }
    });
  }

  openDeleteModal(content: any, charityBox: CharityBox) {
    this.charityBox = charityBox;
    this.modal.open(content)
    document.getElementById('delete')?.focus();
  }

  openViewImage(content: any, charityBox: CharityBox) {
    this.modal.open(content)
    this.charityBox = charityBox;
    this.url = charityBox.outletPhoto;
    this.charityBoxService.getImageUrl(charityBox.outletPhoto)
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSearch(search: string) {
    if (!this.originalCharityBoxes) {
      this.originalCharityBoxes = [...this.charityBoxes];
    }

    if (search === '') {
      this.charityBoxes = [...this.originalCharityBoxes];
      return;
    }

    const searchValue = search.toLowerCase();
    this.charityBoxes = this.originalCharityBoxes.filter((charityBox: CharityBox) => {
      const charityBoxInfoMatch = charityBox.charityBoxInfo.toLowerCase().includes(searchValue);
      const outletNameMatch = charityBox.outletName.toLowerCase().includes(searchValue);
      const codeMatch = charityBox.code.toLowerCase().includes(searchValue);
      const addressMatch = charityBox.address.toLowerCase().includes(searchValue);
      const ownerNameMatch = charityBox.ownerName.toLowerCase().includes(searchValue);
      const phoneNumberMatch = charityBox.phoneNumber.includes(searchValue);
      const depositDate = new Date(charityBox.depositDate);
      const depositDateMatch = depositDate.toLocaleDateString('id', {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).includes(searchValue);
      const coordinatesMatch = charityBox.coordinates.toLowerCase().includes(searchValue);
      const otherInfoMatch = charityBox.otherInfo?.toLowerCase().includes(searchValue);
      return charityBoxInfoMatch || outletNameMatch || codeMatch || addressMatch || ownerNameMatch || phoneNumberMatch || depositDateMatch || coordinatesMatch || otherInfoMatch;
    });
  }

  protected readonly console = console;
}
