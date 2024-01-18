import { Component } from '@angular/core';
import {CashDonation} from "../../common/cash-donation";
import {CashDonationService} from "../../service/cash-donation.service";
import {DailyReceiptsService} from "../../service/daily-receipts.service";
import {subscribeOn} from "rxjs";
import {Target} from "../../common/target";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TargetService} from "../../service/target.service";
import {AuthService} from "../../service/auth.service";
import {DatePipe} from "@angular/common";
import {TransferDonationService} from "../../service/transfer-donation.service";

@Component({
  selector: 'app-daily-receipts',
  templateUrl: './daily-receipts.component.html',
  styleUrls: ['./daily-receipts.component.css']
})
export class DailyReceiptsComponent {

  targets: Target[] = [];
  target?: Target;
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  errors?: any;
  userId: string = '' + this.authService.getUserId();

  userRole: string = '' + this.authService.getCurrentUserRole();

  constructor( private modal: NgbModal,
               private targetService: TargetService,
               private authService: AuthService,
               private datePipe: DatePipe,
               private donationCashService: CashDonationService,
               private donationTransfer: TransferDonationService) {
  }

  ngOnInit(){

  }

  transformDates(data: Target[]): Target[] {
    return data.map((target: Target) => {

      return target;
    });
  }

  getDailyReceipts() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.targetService.getTargets().subscribe(
      (data: Target[]) => {
        this.targets = this.transformDates(data);

        this.donationCashService.getCashDonations().subscribe(
          cashDonations => {
            const cashMap = new Map();
            cashDonations.forEach(donation => {
              const transferDate = new Date(donation.date);
              if (
                transferDate >= startOfMonth &&
                transferDate <= today &&
                this.targets.find(target => target.unit === donation.user.workArea)
              ) {
                cashMap.set(
                  donation.user.workArea,
                  (cashMap.get(donation.user.workArea) || 0) + donation.amount
                );
              }
            });

            this.donationTransfer.getTransferDonations().subscribe(
              transferDonations => {
                const transferMap = new Map();
                transferDonations.forEach(donationTransfer => {
                  const transferDate = new Date(donationTransfer.date);
                  if (
                    transferDate >= startOfMonth &&
                    transferDate <= today &&
                    this.targets.find(target => target.unit === donationTransfer.user.workArea)
                  ) {
                    transferMap.set(
                      donationTransfer.user.workArea,
                      (transferMap.get(donationTransfer.user.workArea) || 0) + donationTransfer.amount
                    );
                  }
                });

                this.targets.forEach(target => {
                  const cashAmount = cashMap.get(target.unit) || 0;
                  const transferAmount = transferMap.get(target.unit) || 0;
                  target.input = cashAmount + transferAmount;
                  target.persentase = target.input / target.inputTarget * 100 || 0;
                });

                this.targets.forEach(target => {
                  const cashAmount = cashMap.get(target.unit) || 0;
                  const transferAmount = transferMap.get(target.unit) || 0;

                  target.input = cashAmount + transferAmount;
                  target.average =target.input / 28
                  // ESTIMASI
                  target.estimasi = target.average * 31
                })
              },
              (transferError) => {
                console.error(transferError);
              }
            );
          },
          (cashError) => {
            console.error(cashError);
          }
        );
      },
      (error) => {
        console.error(error);
      }
    );
  }


}
