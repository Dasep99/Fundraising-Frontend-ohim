import { Component } from '@angular/core';
import {Donor} from "../../../common/donor";
import {AppComponent} from "../../../app.component";
import {DonorService} from "../../../service/donor.service";
import {TransferDonationService} from "../../../service/transfer-donation.service";
import {AuthService} from "../../../service/auth.service";
import {VisitService} from "../../../service/visit.service";
import {Visit, } from "../../../common/visit";
import {TransferDonation} from "../../../common/transfer-donation";
import {CashDonation} from "../../../common/cash-donation";
import {CashDonationService} from "../../../service/cash-donation.service";
import {BoxDonationService} from "../../../service/box-donation.service";
import {BoxDonation} from "../../../common/box-donation";
import {EventCompensationService} from "../../../service/event-compensation.service";
import {EventCompensation} from "../../../common/event-compensation";
import {CashDepositService} from "../../../service/cash-deposit.service";
import {CashDeposit} from "../../../common/cash-deposit";
import {DailyValidation} from "../../../common/daily-validation";
import {DailyValidationService} from "../../../service/daily-validation.service";

@Component({
  selector: 'app-front-office',
  templateUrl: './front-office.component.html',
  styleUrls: ['./front-office.component.css']
})
export class FrontOfficeComponent {

  donors: Donor[] = [];
  visits: Visit[] = []
  dailyValidations: DailyValidation[] = [];
  date!: string
  userId?: string


  constructor(private donorData: DonorService,
              private visitService: VisitService,
              private donationCash: CashDonationService,
              private TransferDonation: TransferDonationService,
              private authService: AuthService,
              private boxDonationService: BoxDonationService,
              private eventCompensationService: EventCompensationService,
              private CashDepositData: CashDepositService,
              private dailyValidationService: DailyValidationService,
              ) {
  }

  ngOnInit() {
    this.userId = '' + this.authService.getUserId()
    this.getDonors(this.userId)
    this.getVisits(this.userId)
    this.getTotalCashAmountToday(this.userId)
    this.getTotalCashAmountThisMonth(this.userId)
    this.getTotalCashAmountLastMonth(this.userId)
    this.getTotalPundiAmountToday(this.userId)
    this.getTotalPundiAmountThisMonth(this.userId)
    this.getTotalPundiAmountLastMonth(this.userId)
    this.getTotalTransferToday(this.userId)
    this.getTotalTransferThisMonth(this.userId)
    this.getTotalTransferLastMonth(this.userId)
    this.getTotalEventComvensationThisMonth(this.userId)
    this.getTotalCashDepositThisMonth(this.userId)
    this.getTotalEventComvensationLastMonth(this.userId)
    this.getTotalCashDepositLastMonth(this.userId)
    this.getTotalValidationToday(this.userId)
    this.getTotalDailyvalidationThisMonth(this.userId)
    this.getTotalDailyvalidationLastMonth(this.userId)
    this.getTotalCashDepositToday(this.userId)
    this.getTotalEventComvensationToday(this.userId)

  }
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  getVisits(userId: string): void{
    this.visitService.getVisits().subscribe(
      (response: Visit[]) => {
        this.visits = response.filter(data => data.user.id === userId);
      }
    )
  }

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

  // DONASI PUNDI FO HARI INI
  totalPundiAmountToday: number = 0;
  getTotalPundiAmountToday(userId: string): void{
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0, 0);

    this.boxDonationService.getBoxDonations().subscribe(
      (pundidonations: BoxDonation[]) => {
        this.totalPundiAmountToday = pundidonations
          .filter(pundidonations => {
            const transferDate = new Date(pundidonations.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today &&
              pundidonations.user.id === userId
            );
          })
          .reduce((total, pundidonations) => total + pundidonations.amount, 0);
         this.totalPundiAmountToday
      }
    )
  }

  // DONASI FO BULAN INI
  totalPundiAmountThisMonth: number = 0;
  getTotalPundiAmountThisMonth(userId: string): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.boxDonationService.getBoxDonations().subscribe(
      (pundidonations: BoxDonation[]) => {
        this.totalPundiAmountThisMonth = pundidonations
          .filter(pundidonations => {
            const transferDate = new Date(pundidonations.date);
            return (
              transferDate >= startOfMonth &&
              transferDate <= today &&
              pundidonations.user.id === userId
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
        this.totalPundiAmountThisMonth
      }
    );
  }

  // DONASI PUNDI FO BULAN LALU
  totalPundiAmountLastMonth: number = 0;
  getTotalPundiAmountLastMonth(userId: string): void {
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    this.boxDonationService.getBoxDonations().subscribe(
      (pundidonations: BoxDonation[]) => {
        this.totalPundiAmountLastMonth = pundidonations
          .filter(pundidonations => {
            const transferDate = new Date(pundidonations.date);
            return (
              transferDate >= startOfLastMonth &&
              transferDate <= endOfLastMonth &&
              pundidonations.user.id === userId
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
        this.totalPundiAmountLastMonth
      }
    );
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

  // PENGELUARAN SANTUNAN ACARA Hari INI
  totalEventComvensationToday: number = 0;
  getTotalEventComvensationToday(userId: string): void {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    this.eventCompensationService.getEventCompensation().subscribe(
      (eventcompensations: EventCompensation[]) => {
        this. totalEventComvensationToday = eventcompensations
          .filter(eventcompensations => {
            const transferDate = new Date(eventcompensations.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today &&
              eventcompensations.user.id === userId
            );
          })
          .reduce((total, eventcompensations) => total + eventcompensations.amount, 0);
        this. totalEventComvensationToday
      }
    );
  }

  // PENGELUARAN SANTUNAN ACARA BULAN INI
  totalEventComvensationThisMonth: number = 0;
  getTotalEventComvensationThisMonth(userId: string): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.eventCompensationService.getEventCompensation().subscribe(
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

    this.eventCompensationService.getEventCompensation().subscribe(
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
