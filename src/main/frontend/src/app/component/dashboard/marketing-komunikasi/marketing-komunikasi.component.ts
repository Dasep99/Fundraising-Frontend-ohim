import { Component } from '@angular/core';
import {Donor} from "../../../common/donor";
import {AppComponent} from "../../../app.component";
import {DonorService} from "../../../service/donor.service";
import {AuthService} from "../../../service/auth.service";
import {DecimalPipe, formatDate} from "@angular/common";
import {TransferDonationService} from "../../../service/transfer-donation.service";
import {TransferDonation} from "../../../common/transfer-donation";
import {CashDeposit} from "../../../common/cash-deposit";
import {CashDepositService} from "../../../service/cash-deposit.service";
import {DailyValidation} from "../../../common/daily-validation";
import {DailyValidationService} from "../../../service/daily-validation.service";

@Component({
  selector: 'app-marketing-komunikasi',
  templateUrl: './marketing-komunikasi.component.html',
  styleUrls: ['./marketing-komunikasi.component.css']
})
export class MarketingKomunikasiComponent {

  donors: Donor[] = [];
  transferdonations: TransferDonation[] = []
  dailyValidations: DailyValidation[] = [];
  date!: string
  userId?: string


  constructor(private templateComponent: AppComponent,
              private donorData: DonorService,
              private TransferDonation: TransferDonationService,
              private authService: AuthService,
              private CashDepositData: CashDepositService,
              private dailyValidationService: DailyValidationService,) {
  }

  ngOnInit() {
    this.userId = '' + this.authService.getUserId()
    this.getDonors(this.userId)
    this.getTotalTransferToday(this.userId)
    this.getTotalTransferThisMonth(this.userId)
    this.getTotalTransferLastMonth(this.userId)
    this.getTotalCashDepositToday(this.userId)
    this.getTotalCashDepositThisMonth(this.userId)
    this.getTotalCashDepositLastMonth(this.userId)
    this.getTotalValidationToday(this.userId)
    this.getTotalDailyvalidationThisMonth(this.userId)
    this.getTotalDailyvalidationLastMonth(this.userId)


  }


  getDonors(userId: string): void{
    this.donorData.getDonors().subscribe(
      (donors: Donor[])=> {
        this.donors = donors.filter(donor => donor.user.id === userId)
      }
    )
  }

  // DONASI TRANSFER HARI INI
  totalTransferToday: number = 0;
  getTotalTransferToday(userId: string): void {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    this.TransferDonation.getTransferDonations().subscribe(
      (transferdonations: TransferDonation[]) => {
        this.totalTransferToday = transferdonations
          .filter(transferdonation => {
            const transferDate = new Date(transferdonation.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today &&
              transferdonation.user.id === userId
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
        this.totalTransferToday
      }
    );
  }

  // DONASI TRANSFER BULAN INI
  totalTransferThisMonth: number = 0;

  getTotalTransferThisMonth(userId: string): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.TransferDonation.getTransferDonations().subscribe(
      (transferdonations: TransferDonation[]) => {
        this.totalTransferThisMonth = transferdonations
          .filter(transferdonation => {
            const transferDate = new Date(transferdonation.date);
            return (
              transferDate >= startOfMonth &&
              transferDate <= today &&
              transferdonation.user.id === userId
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
        this.totalTransferThisMonth
      }
    );
  }

  // DONASI TRANSFER BULAN LALU
  totalTransferLastMonth: number = 0;
  getTotalTransferLastMonth(userId: string): void {
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    this.TransferDonation.getTransferDonations().subscribe(
      (transferdonations: TransferDonation[]) => {
        this.totalTransferLastMonth = transferdonations
          .filter(transferdonation => {
            const transferDate = new Date(transferdonation.date);
            return (
              transferDate >= startOfLastMonth &&
              transferDate <= endOfLastMonth &&
              transferdonation.user.id === userId
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
        this.totalTransferLastMonth
      }
    );
  }

  // PENGELUARAN SETOR TUNAI HARI INI
  totalCashDepositToday: number = 0;
  getTotalCashDepositToday(userId: string): void {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    this.CashDepositData.getCashDeposits().subscribe(
      (cashdeposits: CashDeposit[]) => {
        this.totalCashDepositToday = cashdeposits
          .filter(cashdeposits => {
            const transferDate = new Date(cashdeposits.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today &&
              cashdeposits.user.id === userId
            );
          })
          .reduce((total, cashdeposits) => total + cashdeposits.amount, 0);
        this.totalCashDepositToday
      }
    );
  }

  // PENGELUARAN SETOR TUNAI BULAN INI / CASH DEPOSIT
  totalCashDepositThisMonth: number = 0;
  getTotalCashDepositThisMonth(userId: string): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.CashDepositData.getCashDeposits().subscribe(
      (cashdeposits: CashDeposit[]) => {
        this.totalCashDepositThisMonth = cashdeposits
          .filter(cashdeposits => {
            const transferDate = new Date(cashdeposits.date);
            return (
              transferDate >= startOfMonth &&
              transferDate <= today &&
              cashdeposits.user.id === userId
            );
          })
          .reduce((total, cashdeposits) => total + cashdeposits.amount, 0);
        this.totalCashDepositThisMonth
      }
    );
  }

  // PENGELUARAN SETOR TUNAI BULAN LALU

  totalCashDepositLastMonth: number = 0;
  getTotalCashDepositLastMonth(userId: string): void {
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    this.CashDepositData.getCashDeposits().subscribe(
      (cashdeposits: CashDeposit[]) => {
        this.totalCashDepositLastMonth = cashdeposits
          .filter(cashdeposits => {
            const transferDate = new Date(cashdeposits.date);
            return (
              transferDate >= startOfLastMonth &&
              transferDate <= endOfLastMonth &&
              cashdeposits.user.id === userId
            );
          })
          .reduce((total, cashdeposits) => total + cashdeposits.amount, 0);
        this.totalCashDepositLastMonth
      }
    );
  }

  // VALIDASI HARI INI
  totalValidationToday: number = 0
  getTotalValidationToday(userId: string): void{
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    this.dailyValidationService.getDailyValidations().subscribe(
      (dailyValidations: DailyValidation[]) => {
        this.totalValidationToday = dailyValidations
          .filter(dailyValidation => {
            const transferDate = new Date(dailyValidation.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today &&
            dailyValidation.user.id === userId
            );
          })
          .reduce((total, dailyValidation) => total + dailyValidation.amount, 0);
        this.totalValidationToday
      }
    );
  }
  // VALIDASI BULAN INI
  totalDailyvalidationThisMonth: number = 0
  getTotalDailyvalidationThisMonth(userId: string): void{
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.dailyValidationService.getDailyValidations().subscribe(
      (dailyValidations: DailyValidation[]) => {
        this.totalDailyvalidationThisMonth = dailyValidations
          .filter(dailyValidations => {
            const transferDate = new Date(dailyValidations.date);
            return (
              transferDate >= startOfMonth &&
              transferDate <= today &&
              dailyValidations.user.id === userId
            );
          })
          .reduce((total, dailyValidations) => total + dailyValidations.amount, 0);
        this.totalDailyvalidationThisMonth
      }
    );
  }

  // VALIDASI BULAN LALU
  totalDailyvalidationLastMonth: number = 0
  getTotalDailyvalidationLastMonth(userId: string): void {
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    this.dailyValidationService.getDailyValidations().subscribe(
      (dailyValidations: DailyValidation[]) => {
        this.totalDailyvalidationLastMonth = dailyValidations
          .filter(dailyValidations => {
            const transferDate = new Date(dailyValidations.date);
            return (
              transferDate >= startOfLastMonth &&
              transferDate <= endOfLastMonth &&
              dailyValidations.user.id === userId
            );
          })
          .reduce((total, dailyValidations) => total + dailyValidations.amount, 0);
        this.totalDailyvalidationLastMonth
      }
    );
  }


















}
