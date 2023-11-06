import { Component } from '@angular/core';
import {Donor} from "../../../common/donor";
import {Guest, } from "../../../common/guest";
import {AppComponent} from "../../../app.component";
import {DonorService} from "../../../service/donor.service";
import {GuestService} from "../../../service/guest.service";
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

@Component({
  selector: 'app-manager-fundraising',
  templateUrl: './manager-fundraising.component.html',
  styleUrls: ['./manager-fundraising.component.css']
})
export class ManagerFundraisingComponent {

  donors: Donor[] = [];
  guests: Guest[] = []
  date!: string
  userId?: string


  constructor(private templateComponent: AppComponent,
              private donorData: DonorService,
              private guestService: GuestService,
              private donationCash: CashDonationService,
              private TransferDonation: TransferDonationService,
              private authService: AuthService,
              private pundiFoService: BoxDonationService,
              private dataEvencompensation: EventCompensationService,
              private CashDepositData: CashDepositService,
  ) {
  }

  ngOnInit() {
    this.getGuests()
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

  }
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  // TOTAL DATA TAMU
  getGuests(): void {
    this.guestService.getGuests().subscribe(
      (response: Guest[]) => {
        this.guests = response
      }
    );
  }

  // TOTAL DATA DONATUR
  getDonors(): void{
    this.donorData.getDonors().subscribe(
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

    this.donationCash.getCashDonations().subscribe(
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

    this.donationCash.getCashDonations().subscribe(
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

    this.donationCash.getCashDonations().subscribe(
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

    this.pundiFoService.getBoxDonations().subscribe(
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

    this.pundiFoService.getBoxDonations().subscribe(
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

    this.pundiFoService.getBoxDonations().subscribe(
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

    this.TransferDonation.getTransferDonations().subscribe(
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

    this.TransferDonation.getTransferDonations().subscribe(
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

    this.TransferDonation.getTransferDonations().subscribe(
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

  // PENGELUARAN SANTUNAN ACARA BULAN INI
  totalEventComvensationThisMonth: number = 0;
  getTotalEventComvensationThisMonth(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.dataEvencompensation.getEventCompensation().subscribe(
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

    this.dataEvencompensation.getEventCompensation().subscribe(
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


  // PENGELUARAN SETOR TUNAI / CASH DEPOSIT
  totalCashDepositThisMonth: number = 0;
  getTotalCashDepositThisMonth(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.CashDepositData.getCashDeposits().subscribe(
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

    this.CashDepositData.getCashDeposits().subscribe(
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

}
