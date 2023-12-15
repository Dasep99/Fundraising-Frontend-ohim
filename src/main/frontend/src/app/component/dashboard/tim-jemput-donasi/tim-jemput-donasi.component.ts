import { Component } from '@angular/core';
import {Donor} from "../../../common/donor";
import {AppComponent} from "../../../app.component";
import {DonorService} from "../../../service/donor.service";
import {CashDonationService} from "../../../service/cash-donation.service";
import {AuthService} from "../../../service/auth.service";
import {BoxDonationService} from "../../../service/box-donation.service";
import {EventCompensationService} from "../../../service/event-compensation.service";
import {CashDepositService} from "../../../service/cash-deposit.service";
import {CashDonation} from "../../../common/cash-donation";
import {EventCompensation} from "../../../common/event-compensation";
import {CashDeposit} from "../../../common/cash-deposit";
import {DailyValidation} from "../../../common/daily-validation";
import {DailyValidationService} from "../../../service/daily-validation.service";

@Component({
  selector: 'app-tim-jemput-donasi',
  templateUrl: './tim-jemput-donasi.component.html',
  styleUrls: ['./tim-jemput-donasi.component.css']
})
export class TimJemputDonasiComponent {

  donors: Donor[] = [];
  dailyValidations: DailyValidation[] = [];
  date!: string
  userId?: string


  constructor(private templateComponent: AppComponent,
              private donorData: DonorService,
              private donationCash: CashDonationService,
              private authService: AuthService,
              private pundiFoService: BoxDonationService,
              private dataEvencompensation: EventCompensationService,
              private CashDepositData: CashDepositService,
              private dailyValidationService: DailyValidationService,
  ) {
  }

  ngOnInit() {
    this.userId = '' + this.authService.getUserId()
    this.getDonors(this.userId)
    this.getTotalCashAmountToday(this.userId)
    this.getTotalCashAmountThisMonth(this.userId)
    this.getTotalCashAmountLastMonth(this.userId)
    this.getTotalEventComvensationThisMonth(this.userId)
    this.getTotalCashDepositThisMonth(this.userId)
    this.getTotalEventComvensationLastMonth(this.userId)
    this.getTotalCashDepositLastMonth(this.userId)
    this.getTotalCashdepositToday(this.userId)
    this.getTotalDailyvalidationToday(this.userId)
    this.getTotalDailyvalidationThisMonth(this.userId)
    this.getTotalDailyvalidationLastMonth(this.userId)


  }
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;


  getDonors(userId: string): void{
    this.donorData.getDonors().subscribe(
      (donors: Donor[])=> {
        this.donors = donors.filter(donor => donor.user.id === userId)
      }
    )
  }

  // DONASI CASH HARI INI
  totalCashAmountToday: number = 0;
  getTotalCashAmountToday(userId: string): void{
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0, 0);

    this.donationCash.getCashDonations().subscribe(
      (donationcash: CashDonation[]) => {
        this.totalCashAmountToday = donationcash
          .filter(donationcash => {
            const transferDate = new Date(donationcash.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today &&
              donationcash.user.id === userId
            );
          })
          .reduce((total, donationcash) => total + donationcash.amount, 0);
        this.totalCashAmountToday
      }
    )
  }

  // DONASI CASH BULAN INI
  totalCashAmountThisMonth: number = 0;
  getTotalCashAmountThisMonth(userId: string): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.donationCash.getCashDonations().subscribe(
      (donationcash: CashDonation[]) => {
        this.totalCashAmountThisMonth = donationcash
          .filter(donationcash => {
            const transferDate = new Date(donationcash.date);
            return (
              transferDate >= startOfMonth &&
              transferDate <= today &&
              donationcash.user.id === userId
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
        this.totalCashAmountThisMonth
      }
    );
  }

  // DONASI CASH BULAN LALU
  totalCashAmountLastMonth: number = 0;
  getTotalCashAmountLastMonth(userId: string): void {
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    this.donationCash.getCashDonations().subscribe(
      (donationcash: CashDonation[]) => {
        this.totalCashAmountLastMonth = donationcash
          .filter(donationcash => {
            const donationDate = new Date(donationcash.date);
            return (
              donationDate >= startOfLastMonth &&
              donationDate <= endOfLastMonth &&
              donationcash.user.id === userId
            );
          })
          .reduce((total, donationcash) => total + donationcash.amount, 0);

        this.totalCashAmountLastMonth
      }
    );
  }

  // PENGELUARAN SANTUNAN ACARA BULAN INI
  totalEventComvensationThisMonth: number = 0;
  getTotalEventComvensationThisMonth(userId: string): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.dataEvencompensation.getEventCompensation().subscribe(
      (eventcompensations: EventCompensation[]) => {
        this.totalEventComvensationThisMonth = eventcompensations
          .filter(eventcompensations => {
            const transferDate = new Date(eventcompensations.date);
            return (
              transferDate >= startOfMonth &&
              transferDate <= today &&
              eventcompensations.user.id === userId
            );
          })
          .reduce((total, eventcompensations) => total + eventcompensations.amount, 0);
        this.totalEventComvensationThisMonth
      }
    );
  }

  // PENGELUARAN SANTUNAN ACARA BULAN LALU
  totalEventComvensationLastMonth: number = 0;
  getTotalEventComvensationLastMonth(userId: string): void {
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    this.dataEvencompensation.getEventCompensation().subscribe(
      (eventcompensations: EventCompensation[]) => {
        this.totalEventComvensationLastMonth = eventcompensations
          .filter(eventcompensations => {
            const transferDate = new Date(eventcompensations.date);
            return (
              transferDate >= startOfLastMonth &&
              transferDate <= endOfLastMonth &&
              eventcompensations.user.id === userId
            );
          })
          .reduce((total, eventcompensations) => total + eventcompensations.amount, 0);
       this.totalEventComvensationLastMonth
      }
    );
  }

  //PENGELUARAN SETOR TUNAI HARI INI / CASH DEPOSIT
  totalCashDepositToday: number = 0
  getTotalCashdepositToday(userId: string): void{
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    this.CashDepositData.getCashDeposits().subscribe(
      (cashDeposits: CashDeposit[]) => {
        this.totalCashDepositToday = cashDeposits
          .filter(cashDeposits => {
            const transferDate = new Date(cashDeposits.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today &&
              cashDeposits.user.id === userId
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
        this.totalCashDepositToday
      }
    );
  }

  // PENGELUARAN SETOR TUNAI / CASH DEPOSIT
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

  // VALIDASI HARIAN HARI INI
  totalDailyvalidationToday: number = 0
  getTotalDailyvalidationToday(userId: string): void{
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    this.dailyValidationService.getDailyValidations().subscribe(
      (dailyValidations: DailyValidation[]) => {
        this.totalDailyvalidationToday = dailyValidations
          .filter(dailyValidations => {
            const transferDate = new Date(dailyValidations.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today &&
              dailyValidations.user.id === userId
            );
          })
          .reduce((total, dailyValidations) => total + dailyValidations.amount, 0);
        this.totalDailyvalidationToday
      }
    );
  }

  // VALIDASI HARIAN BULAN INI
  totalDailyvalidationThisMonth: number = 0
  getTotalDailyvalidationThisMonth(userId: string){
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

  // VALIDASI HARIAN BULAN LALU
  totalDailyvalidationLastMonth: number = 0
  getTotalDailyvalidationLastMonth(userId: string){
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
