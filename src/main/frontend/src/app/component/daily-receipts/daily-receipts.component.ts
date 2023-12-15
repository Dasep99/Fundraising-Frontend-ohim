import { Component } from '@angular/core';
import {CashDonation} from "../../common/cash-donation";
import {CashDonationService} from "../../service/cash-donation.service";
import {DailyReceiptsService} from "../../service/daily-receipts.service";
import {subscribeOn} from "rxjs";

@Component({
  selector: 'app-daily-receipts',
  templateUrl: './daily-receipts.component.html',
  styleUrls: ['./daily-receipts.component.css']
})
export class DailyReceiptsComponent {

  cashDonations: CashDonation[] = []

  constructor(private cashDonationService: DailyReceiptsService ) {
  }

  ngOnInit(){
    const month = 12
    const year = 2023
    this.getCashDonationsByDate(month, year)
  }


  getCashDonationsByDate(month: number, year: number): void {
    this.cashDonationService.GetfindByDateMonthAndDateYear(month, year).subscribe(
      (cashDonations: CashDonation[]) => {
        this.cashDonations = cashDonations;
        console.log(CashDonation)
      },
      (error) => {

      }
    );
  }

}
