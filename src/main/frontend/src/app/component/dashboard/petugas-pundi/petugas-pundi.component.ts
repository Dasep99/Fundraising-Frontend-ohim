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
import {CashDeposit} from "../../../common/cash-deposit";
import {CashDepositService} from "../../../service/cash-deposit.service";
import {DailyValidationService} from "../../../service/daily-validation.service";
import {DailyValidation} from "../../../common/daily-validation";

@Component({
  selector: 'app-petugas-pundi',
  templateUrl: './petugas-pundi.component.html',
  styleUrls: ['./petugas-pundi.component.css']
})
export class PetugasPundiComponent {

  charityboxs: CharityBox[] = []
  dailyValidations: DailyValidation[] = [];
  userId?: string

  constructor(private templateComponent: AppComponent,
              private dataPickUpDonations: PickupDonationService,
              private CharityboxData: CharityBoxService,
              private authService: AuthService,
              private CashDepositData: CashDepositService,
              private dailyValidationService: DailyValidationService,
              ) {
  }

  ngOnInit() {
    this.userId = '' + this.authService.getUserId()
    this.getTotalPundi(this.userId)
    this.getTotalPundiAmountThisMonth(this.userId)
    this.getTotalPundiAmountLastMonth(this.userId)
    this.getTotalPundiBroken(this.userId)
    this.getTotalPundiLostThisMonth(this.userId)
    this.getTotalCashDepositThisMonth(this.userId)
    this.getTotalCashDepositLastMonth(this.userId)
    this.getTotalCashDepositToday(this.userId)
    this.getTotalValidationToday(this.userId)
    this.getTotalDailyvalidationThisMonth(this.userId)
    this.getDailyvalidationLastMonth(this.userId)

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

  // DONASI TRANSFER HARI INI
  totalCashDepositToday: number = 0;
  getTotalCashDepositToday(userId: string): void {
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

  // PENGELUARAN SETOR TUNAI BULAN INI
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
  getDailyvalidationLastMonth(userId: string): void{
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
