import { Component } from '@angular/core';
import {Donor} from "../../../common/donor";
import {AppComponent} from "../../../app.component";
import {DonorService} from "../../../service/donor.service";
import {AuthService} from "../../../service/auth.service";
import {DecimalPipe, formatDate} from "@angular/common";
import {TransferDonationService} from "../../../service/transfer-donation.service";
import {TransferDonation} from "../../../common/transfer-donation";

@Component({
  selector: 'app-marketing-komunikasi',
  templateUrl: './marketing-komunikasi.component.html',
  styleUrls: ['./marketing-komunikasi.component.css']
})
export class MarketingKomunikasiComponent {

  donors: Donor[] = [];
  date!: string
  userId?: string


  constructor(private templateComponent: AppComponent,
              private donorData: DonorService,
              private TransferDonation: TransferDonationService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.userId = '' + this.authService.getUserId()
    this.getDonors(this.userId)
    this.getTotalDonationThisWeek(this.userId)
    this.getTotalAmountToday(this.userId)
    this.getTotalAmountThisMonth(this.userId)
    this.getTotalAmountThisYear(this.userId)

  }

  removeDotNumber(input: string): number {
    input = input.replace(/\./g, '');
    input = input.replace(/,/g, '.');
    return Number(input);
  }

  getDonors(userId: string): void{
    this.donorData.getDonors().subscribe(
      (donors: Donor[])=> {
        this.donors = donors.filter(donor => donor.user.id === userId)
      }
    )
  }

  // DONASI TRANSFER HARI INI

  totalAmountToday: number = 0;

  getTotalAmountToday(userId: string): void {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    this.TransferDonation.getTransferDonations().subscribe(
      (transferdonations: TransferDonation[]) => {
        this.totalAmountToday = transferdonations
          .filter(transferdonation => {
            const transferDate = new Date(transferdonation.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today &&
              transferdonation.user.id === userId
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
        this.totalAmountToday
      }
    );
  }

  totalAmountThisWeek: number = 0;

      // DONASI TRANSFER MINGGU INI
  getTotalDonationThisWeek(userId: string): void {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    this.TransferDonation.getTransferDonations().subscribe(
      (transferdonations: TransferDonation[]) => {
        this.totalAmountThisWeek = transferdonations
          .filter(transferdonation => {
            const transferDate = new Date(transferdonation.date);
            return (
              transferDate >= oneWeekAgo &&
              transferDate <= today &&
              transferdonation.user.id === userId
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
       this.totalAmountThisWeek
      }
    );
  }

  // DONASI TRANSFER BULAN INI
  totalAmountThisMonth: number = 0;

  getTotalAmountThisMonth(userId: string): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.TransferDonation.getTransferDonations().subscribe(
      (transferdonations: TransferDonation[]) => {
        this.totalAmountThisMonth = transferdonations
          .filter(transferdonation => {
            const transferDate = new Date(transferdonation.date);
            return (
              transferDate >= startOfMonth &&
              transferDate <= today &&
              transferdonation.user.id === userId
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
        this.totalAmountThisMonth
      }
    );
  }


  totalAmountThisYear: number = 0;
  getTotalAmountThisYear(userId: string): void {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    this.TransferDonation.getTransferDonations().subscribe(
      (transferdonations: TransferDonation[]) => {
        this.totalAmountThisYear = transferdonations
          .filter(transferdonation => {
            const transferDate = new Date(transferdonation.date);
            return (
              transferDate >= startOfYear &&
              transferDate <= today &&
              transferdonation.user.id === userId
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);

        this.totalAmountThisYear
      }
    );
  }


















}
