import { Component } from '@angular/core';
import {AppComponent} from "../../../app.component";
import {DonorService} from "../../../service/donor.service";
import {TransferDonationService} from "../../../service/transfer-donation.service";
import {AuthService} from "../../../service/auth.service";
import {BoxDonationService} from "../../../service/box-donation.service";
import {CharityBoxService} from "../../../service/charity-box.service";
import {PickupDonationService} from "../../../service/pickup-donation.service";
import {CharityBox} from "../../../common/charity-box";
import {TransferDonation} from "../../../common/transfer-donation";
import {PickupDonation} from "../../../common/pickup-donation";

@Component({
  selector: 'app-petugas-pundi',
  templateUrl: './petugas-pundi.component.html',
  styleUrls: ['./petugas-pundi.component.css']
})
export class PetugasPundiComponent {

  charityboxs: CharityBox[] = []
  userId?: string

  constructor(private templateComponent: AppComponent,
              private dataPickUpDonations: PickupDonationService,
              private CharityboxData: CharityBoxService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.userId = '' + this.authService.getUserId()
    this.getTotalPundi(this.userId)
    this.getTotalPundiAmountThisMonth(this.userId)
    this.getTotalPundiAmountLastMonth(this.userId)
    this.getTotalPundiBroken(this.userId)
    this.getTotalPundiLostThisMonth(this.userId)



  }

  // TOTAL DATA PUNDI
  getTotalPundi(userId: string): void{
    this.CharityboxData.getCharityBoxes().subscribe(
      (charityboxs: CharityBox[]) => {
        this.charityboxs = charityboxs.filter(charitybox => charitybox.user.id === userId)
      }
    )
  }

  // DONASI PUNDI BULAN INI

  totalPundiAmountThisMonth: number = 0;
  getTotalPundiAmountThisMonth(userId: string): void{
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    this.dataPickUpDonations.getPickUpDonations().subscribe(
      (pickupdonations:PickupDonation[]) => {
        this.totalPundiAmountThisMonth = pickupdonations
          .filter(pickupdonations => {
            const transferDate = new Date(pickupdonations.date);
            return (
              transferDate >= startOfMonth &&
                transferDate <= today &&
                pickupdonations.user.id === userId
            );
          })
          .reduce((total, pickupdonation) => total + pickupdonation.amount, 0);
        this.totalPundiAmountThisMonth
      }
    );
  }

  // DONASI PUNDI BULAN LALU

  totalPundiAmountLastMonth: number = 0;
  getTotalPundiAmountLastMonth(userId: string): void{
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    this.dataPickUpDonations.getPickUpDonations().subscribe(
      (pickupdonations: PickupDonation[]) => {
        this.totalPundiAmountLastMonth = pickupdonations
          .filter(pickupdonation => {
            const donationDate = new Date(pickupdonation.date);
            return (
              donationDate >= startOfLastMonth &&
              donationDate <= endOfLastMonth &&
              pickupdonation.user.id === userId
            );
          })
          .reduce((total, pickupdonation) => total + pickupdonation.amount, 0);
        this.totalPundiAmountLastMonth
      }
    );
  }

  // TOTAL PUNDI RUSAK
  totalPundiBrokenThisMonth: number = 0;
  getTotalPundiBroken(userId: string): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.dataPickUpDonations.getPickUpDonations().subscribe(
      (pickupdonations: PickupDonation[]) => {
        this.totalPundiBrokenThisMonth = pickupdonations
          .filter(pickupdonation => pickupdonation.pickUpInfo === 'RUSAK' && pickupdonation.user.id === userId && new Date(pickupdonation.date) >= startOfMonth)
          .length;
      }
    );
  }

  // TOTAL PUNDI Hilang
  totalPundiLostThisMonth: number = 0;
  getTotalPundiLostThisMonth(userId: string): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.dataPickUpDonations.getPickUpDonations().subscribe(
      (pickupdonations: PickupDonation[]) => {
        this.totalPundiLostThisMonth = pickupdonations
          .filter(pickupdonation => pickupdonation.pickUpInfo === 'HILANG' && pickupdonation.user.id === userId && new Date(pickupdonation.date) >= startOfMonth)
          .length;
       this.totalPundiLostThisMonth
      }
    );
  }

  // // TOTAL PUNDI DI TARIK
  // totalPundiPullThisMonth: number = 0;
  // getTotalPundiPullThisMonth(userId: string): void {
  //   const today = new Date();
  //   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  //
  //   this.dataPickUpDonations.getPickUpDonations().subscribe(
  //     (pickupdonations: PickupDonation[]) => {
  //       this.totalPundiPullThisMonth = pickupdonations
  //         .filter(pickupdonation => pickupdonation.pickUpInfo === 'TARIK' && pickupdonation.user.id === userId && new Date(pickupdonation.date) >= startOfMonth)
  //         .length;
  //       console.log('Total Pundi Pull This Month:', this.totalPundiLostThisMonth);
  //     }
  //   );
  // }










}
