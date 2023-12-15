import { Component } from '@angular/core';
import {Donor} from "../../../common/donor";
import {Visit, } from "../../../common/visit";
import {AppComponent} from "../../../app.component";
import {DonorService} from "../../../service/donor.service";
import {VisitService} from "../../../service/visit.service";
import {CashDonationService} from "../../../service/cash-donation.service";
import {TransferDonationService} from "../../../service/transfer-donation.service";
import {AuthService} from "../../../service/auth.service";
import {BoxDonationService} from "../../../service/box-donation.service";
import {EventCompensationService} from "../../../service/event-compensation.service";
import {CashDepositService} from "../../../service/cash-deposit.service";
import {CashDonation} from "../../../common/cash-donation";
import {BoxDonation} from "../../../common/box-donation";
import {TransferDonation} from "../../../common/transfer-donation";
import {EventCompensation} from "../../../common/event-compensation";
import {CashDeposit} from "../../../common/cash-deposit";
import {DailyValidation} from "../../../common/daily-validation";
import {DailyValidationService} from "../../../service/daily-validation.service";

@Component({
  selector: 'app-manager-fundraising',
  templateUrl: './manager-fundraising.component.html',
  styleUrls: ['./manager-fundraising.component.css']
})
export class ManagerFundraisingComponent {
  dailyValidations: DailyValidation[] = [];
  donors: Donor[] = [];
  visits: Visit[] = []
  date!: string
  userId?: string


  constructor(private donorService: DonorService,
              private visitService: VisitService,
              private cashDonationService: CashDonationService,
              private transferDonationService: TransferDonationService,
              private boxDonationService: BoxDonationService,
              private eventCompensationService: EventCompensationService,
              private cashDepositService: CashDepositService,
              private dailyValidationService: DailyValidationService,
  ) {
  }

  ngOnInit() {
    this.getVisits()
    this.getDonors()
    this.getTotalCashAmountToday()
    this.getTotalCashAmountThisMonth()
    this.getTotalCashAmountLastMonth()
    this.getTotalPundiAmountToday()
    this.getTotalPundiAmountThisMonth()
    this.getTotalPundiAmountLastMonth()
    this.getTotalTransferToday()
    this.getTotalTransferThisMonth()
    this.getTotalTransferLastMonth()
    this.getTotalEventComvensationThisMonth()
    this.getTotalEventComvensationLastMonth()
    this.getTotalCashDepositThisMonth()
    this.getTotalCashDepositLastMonth()
    this.getTotalValidationToday()
    this.getTotalDailyvalidationThisMonth()
    this.getTotalDailyvalidationLastMonth()
    this.getTotalCashDepositToday()
    this.getTotalEventComvensationToday()

  }
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  // TOTAL DATA KUNJUNGAN TAMU
  getVisits(): void {
    this.visitService.getVisits().subscribe(
      (response: Visit[]) => {
        this.visits = response
      }
    );
  }

  // TOTAL DATA DONATUR
  getDonors(): void{
    this.donorService.getDonors().subscribe(
      (donors: Donor[]) => {
        this.donors = donors
      }
    )
  }

  // DONASI CASH HARI INI
  totalCashAmountToday: number = 0;
  getTotalCashAmountToday(): void {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    this.cashDonationService.getCashDonations().subscribe(
      (donationcash: CashDonation[]) => {
        this.totalCashAmountToday = donationcash
          .filter(donationcash => {
            const transferDate = new Date(donationcash.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today
            );
          })
          .reduce((total, donationcash) => total + donationcash.amount, 0);
        this.totalCashAmountToday
      }
    );
  }

  // DONASI CASH BULAN INI
  totalCashAmountThisMonth: number = 0;
  getTotalCashAmountThisMonth(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.cashDonationService.getCashDonations().subscribe(
      (donationcash: CashDonation[]) => {
        this.totalCashAmountThisMonth = donationcash
          .filter(donationcash => {
            const transferDate = new Date(donationcash.date);
            return (
              transferDate >= startOfMonth &&
              transferDate <= today
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
        this.totalCashAmountThisMonth
      }
    );
  }

  // DONASI CASH BULAN LALU
  totalCashAmountLastMonth: number = 0;
  getTotalCashAmountLastMonth(): void {
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    this.cashDonationService.getCashDonations().subscribe(
      (donationcash: CashDonation[]) => {
        this.totalCashAmountLastMonth = donationcash
          .filter(donationcash => {
            const donationDate = new Date(donationcash.date);
            return (
              donationDate >= startOfLastMonth &&
              donationDate <= endOfLastMonth
            );
          })
          .reduce((total, donationcash) => total + donationcash.amount, 0);

       this.totalCashAmountLastMonth
      }
    );
  }

  // DONASI PUNDI FO HARI INI
  totalPundiAmountToday: number = 0;
  getTotalPundiAmountToday(): void{
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0, 0);

    this.boxDonationService.getBoxDonations().subscribe(
      (pundidonations: BoxDonation[]) => {
        this.totalPundiAmountToday = pundidonations
          .filter(pundidonations => {
            const transferDate = new Date(pundidonations.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today
            );
          })
          .reduce((total, pundidonations) => total + pundidonations.amount, 0);
        this.totalPundiAmountToday
      }
    )
  }

  // DONASI FO BULAN INI
  totalPundiAmountThisMonth: number = 0;
  getTotalPundiAmountThisMonth(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.boxDonationService.getBoxDonations().subscribe(
      (pundidonations: BoxDonation[]) => {
        this.totalPundiAmountThisMonth = pundidonations
          .filter(pundidonations => {
            const transferDate = new Date(pundidonations.date);
            return (
              transferDate >= startOfMonth &&
              transferDate <= today
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
       this.totalPundiAmountThisMonth
      }
    );
  }

  // DONASI PUNDI FO BULAN LALU
  totalPundiAmountLastMonth: number = 0;
  getTotalPundiAmountLastMonth(): void {
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
              transferDate <= endOfLastMonth
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
        this.totalPundiAmountLastMonth
      }
    );
  }

  // DONASI TRANSFER HARI INI
  totalTransferToday: number = 0;
  getTotalTransferToday(): void {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    this.transferDonationService.getTransferDonations().subscribe(
      (transferdonations: TransferDonation[]) => {
        this.totalTransferToday = transferdonations
          .filter(transferdonation => {
            const transferDate = new Date(transferdonation.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
       this.totalTransferToday
      }
    );
  }

  // DONASI TRANSFER BULAN INI
  totalTransferThisMonth: number = 0;

  getTotalTransferThisMonth(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.transferDonationService.getTransferDonations().subscribe(
      (transferdonations: TransferDonation[]) => {
        this.totalTransferThisMonth = transferdonations
          .filter(transferdonation => {
            const transferDate = new Date(transferdonation.date);
            return (
              transferDate >= startOfMonth &&
              transferDate <= today
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
      this.totalTransferThisMonth
      }
    );
  }

  // DONASI TRANSFER BULAN LALU
  totalTransferLastMonth: number = 0;
  getTotalTransferLastMonth(): void {
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    this.transferDonationService.getTransferDonations().subscribe(
      (transferdonations: TransferDonation[]) => {
        this.totalTransferLastMonth = transferdonations
          .filter(transferdonation => {
            const transferDate = new Date(transferdonation.date);
            return (
              transferDate >= startOfLastMonth &&
              transferDate <= endOfLastMonth
            );
          })
          .reduce((total, transferdonation) => total + transferdonation.amount, 0);
        this.totalTransferLastMonth
      }
    );
  }

  // PENGELUARAN SANTUNAN ACARA Hari INI
  totalEventComvensationToday: number = 0;
  getTotalEventComvensationToday(): void {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    this.eventCompensationService.getEventCompensation().subscribe(
      (eventcompensations: EventCompensation[]) => {
        this. totalEventComvensationToday = eventcompensations
          .filter(eventcompensations => {
            const transferDate = new Date(eventcompensations.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today
            );
          })
          .reduce((total, eventcompensations) => total + eventcompensations.amount, 0);
        this. totalEventComvensationToday
      }
    );
  }

  // PENGELUARAN SANTUNAN ACARA BULAN INI
  totalEventComvensationThisMonth: number = 0;
  getTotalEventComvensationThisMonth(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.eventCompensationService.getEventCompensation().subscribe(
      (eventcompensations: EventCompensation[]) => {
        this.totalEventComvensationThisMonth = eventcompensations
          .filter(eventcompensations => {
            const transferDate = new Date(eventcompensations.date);
            return (
              transferDate >= startOfMonth &&
              transferDate <= today
            );
          })
          .reduce((total, eventcompensations) => total + eventcompensations.amount, 0);
        this.totalEventComvensationThisMonth
      }
    );
  }

  // PENGELUARAN SANTUNAN ACARA BULAN LALU
  totalEventComvensationLastMonth: number = 0;
  getTotalEventComvensationLastMonth(): void {
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
              transferDate <= endOfLastMonth
            );
          })
          .reduce((total, eventcompensations) => total + eventcompensations.amount, 0);
        this.totalEventComvensationLastMonth
      }
    );
  }

  // PENGELUARAN SETOR TUNAI HARI INI
  totalCashDepositToday: number = 0;
  getTotalCashDepositToday(): void {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    this.cashDepositService.getCashDeposits().subscribe(
      (cashdeposits: CashDeposit[]) => {
        this.totalCashDepositToday = cashdeposits
          .filter(cashdeposits => {
            const transferDate = new Date(cashdeposits.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today
            );
          })
          .reduce((total, cashdeposits) => total + cashdeposits.amount, 0);
        this.totalCashDepositToday
      }
    );
  }


  // PENGELUARAN SETOR TUNAI BULAN INI / CASH DEPOSIT
  totalCashDepositThisMonth: number = 0;
  getTotalCashDepositThisMonth(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.cashDepositService.getCashDeposits().subscribe(
      (cashdeposits: CashDeposit[]) => {
        this.totalCashDepositThisMonth = cashdeposits
          .filter(cashdeposits => {
            const transferDate = new Date(cashdeposits.date);
            return (
              transferDate >= startOfMonth &&
              transferDate <= today
            );
          })
          .reduce((total, cashdeposits) => total + cashdeposits.amount, 0);
            this.totalCashDepositThisMonth
      }
    );
  }

  // PENGELUARAN SETOR TUNAI BULAN LALU
  totalCashDepositLastMonth: number = 0;
  getTotalCashDepositLastMonth(): void {
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    this.cashDepositService.getCashDeposits().subscribe(
      (cashdeposits: CashDeposit[]) => {
        this.totalCashDepositLastMonth = cashdeposits
          .filter(cashdeposits => {
            const transferDate = new Date(cashdeposits.date);
            return (
              transferDate >= startOfLastMonth &&
              transferDate <= endOfLastMonth
            );
          })
          .reduce((total, cashdeposits) => total + cashdeposits.amount, 0);
         this.totalCashDepositLastMonth
      }
    );
  }

  // VALIDASI HARI INI
  totalValidationToday: number = 0
  getTotalValidationToday(): void{
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    this.dailyValidationService.getDailyValidations().subscribe(
      (dailyValidations: DailyValidation[]) => {
        this.totalValidationToday = dailyValidations
          .filter(dailyValidation => {
            const transferDate = new Date(dailyValidation.date);
            return (
              transferDate >= startOfDay &&
              transferDate <= today
            );
          })
          .reduce((total, dailyValidation) => total + dailyValidation.amount, 0);
        this.totalValidationToday
      }
    );
  }
  // VALIDASI BULAN INI
  totalDailyvalidationThisMonth: number = 0
  getTotalDailyvalidationThisMonth(): void{
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.dailyValidationService.getDailyValidations().subscribe(
      (dailyValidations: DailyValidation[]) => {
        this.totalDailyvalidationThisMonth = dailyValidations
          .filter(dailyValidations => {
            const transferDate = new Date(dailyValidations.date);
            return (
              transferDate >= startOfMonth &&
              transferDate <= today
            );
          })
          .reduce((total, dailyValidations) => total + dailyValidations.amount, 0);
        this.totalDailyvalidationThisMonth
      }
    );
  }

  // VALIDASI BULAN LALU
  totalDailyvalidationLastMonth: number = 0
  getTotalDailyvalidationLastMonth(): void {
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
              transferDate <= endOfLastMonth
            );
          })
          .reduce((total, dailyValidations) => total + dailyValidations.amount, 0);
        this.totalDailyvalidationLastMonth
      }
    );
  }

}
