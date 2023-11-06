import { Component } from '@angular/core';
import {Donor} from "../../../common/donor";
import {AppComponent} from "../../../app.component";
import {DonorService} from "../../../service/donor.service";
import {TransferDonationService} from "../../../service/transfer-donation.service";
import {AuthService} from "../../../service/auth.service";
import {GuestService} from "../../../service/guest.service";
import {Guest, } from "../../../common/guest";
import {TransferDonation} from "../../../common/transfer-donation";
import {CashDonation} from "../../../common/cash-donation";
import {CashDonationService} from "../../../service/cash-donation.service";
import {BoxDonationService} from "../../../service/box-donation.service";
import {BoxDonation} from "../../../common/box-donation";
import {EventCompensationService} from "../../../service/event-compensation.service";
import {EventCompensation} from "../../../common/event-compensation";
import {CashDepositService} from "../../../service/cash-deposit.service";
import {CashDeposit} from "../../../common/cash-deposit";

@Component({
  selector: 'app-front-office',
  templateUrl: './front-office.component.html',
  styleUrls: ['./front-office.component.css']
})
export class FrontOfficeComponent {

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
    this.userId = '' + this.authService.getUserId()
    this.getDonors(this.userId)
    this.getGuests(this.userId)
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

  }
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  getGuests(userId: string): void{
    this.guestService.getGuests().subscribe(
      (response: Guest[]) => {
        this.guests = response.filter(data => data.user.id === userId);
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

    this.pundiFoService.getBoxDonations().subscribe(
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

    this.pundiFoService.getBoxDonations().subscribe(
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

    this.pundiFoService.getBoxDonations().subscribe(
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





}
