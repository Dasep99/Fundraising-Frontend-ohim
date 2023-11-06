import {Component, OnInit} from '@angular/core';
import {CashDonationService} from "../../../service/cash-donation.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../service/auth.service";
import {DonorService} from "../../../service/donor.service";
import {CashDonation} from "../../../common/cash-donation";



@Component({
  selector: 'app-cash-donation-report',
  templateUrl: './cash-donation-report.component.html',
  styleUrls: ['./cash-donation-report.component.css']
})
export class CashDonationReportComponent implements OnInit {
  cashDonations: CashDonation[] = [];
  selectedMonth: number = 1; // Defaultnya adalah Januari (1)
  totalCashAmountThisMonth!: number;

  constructor(private cashDonationService: CashDonationService) { }

  ngOnInit() {
    this.getAllCashDonations();

  }

  getAllCashDonations() {
    this.cashDonationService.getCashDonations().subscribe(
      (data: CashDonation[]) => {
        this.cashDonations = data;
      }
    );
  }





}

