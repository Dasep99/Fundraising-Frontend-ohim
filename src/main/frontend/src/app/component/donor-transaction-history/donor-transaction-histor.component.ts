import { Component } from '@angular/core';
import {CashDonation} from "../../common/cash-donation";
import {CashDonationService} from "../../service/cash-donation.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../service/auth.service";
import {DonorService} from "../../service/donor.service";
import {DonorTransactionHistoryService} from "../../service/donor-transaction-history.service";
import {DonorTransactionHistory} from "../../common/donor-transaction-history";
import {TransferDonation} from "../../common/transfer-donation";
import {CashlessDonation} from "../../common/cashless-donation";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-donor-transaction-histor',
  templateUrl: './donor-transaction-history.component.html',
  styleUrls: ['./donor-transaction-histor.component.css']
})
export class DonorTransactionHistoryComponent {

  cashDonations: CashDonation[] = []
  transferDonations: TransferDonation[] = [];
  cashlessDonations: CashlessDonation[] = [];
  allDonations: (CashDonation | TransferDonation | CashlessDonation)[] = [];
  currentPage = 1;
  pageSize = 10;
  cashDonation?: CashDonation;





  constructor(private cashDonationService: CashDonationService,
              private authService: AuthService,
              private donorService: DonorService,
              private historyTransaction: DonorTransactionHistoryService,
              private route: ActivatedRoute,
              private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const donorId = params.get('id')
      if (donorId){
        this.getCashDonationsByDonorId(donorId)
        this.getDonorName(donorId)

      }
    })


  }

  getCashDonationsByDonorId(donorId: string): void {
    this.historyTransaction.getCashDonationsByDonorId(donorId).subscribe(
      (cashDonations: CashDonation[]) => {
        this.cashDonations = cashDonations;
        this.allDonations = [...this.cashDonations, ...this.transferDonations, ...this.cashlessDonations];
        console.log(this.allDonations);
      },

    );


    this.historyTransaction.getTransferDonationByDonorId(donorId).subscribe(
      (transferDonations: TransferDonation[]) => {
        this.transferDonations = transferDonations;
        this.allDonations = [...this.cashDonations, ...this.transferDonations, ...this.cashlessDonations];
        console.log(this.allDonations);
      },

    );

    this.historyTransaction.getCashlessDonationByDonorId(donorId).subscribe(
      (cashlessDonations: CashlessDonation[]) => {
        this.cashlessDonations = cashlessDonations;
        this.allDonations = [...this.cashDonations, ...this.transferDonations, ...this.cashlessDonations];
        console.log(this.allDonations);
      },

    )

  }

  getDonorName(donorId: string) {
    this.historyTransaction.getCashDonationsByDonorId(donorId).subscribe(response => {

    });
  }






}
