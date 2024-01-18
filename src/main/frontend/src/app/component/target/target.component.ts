import { Component } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TargetService} from "../../service/target.service";
import {Target} from "../../common/target";
import {AuthService} from "../../service/auth.service";
import {DatePipe} from "@angular/common";
import {NgForm} from "@angular/forms";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {CashDonationService} from "../../service/cash-donation.service";
import {User} from "../../common/user";
import {CashDonation} from "../../common/cash-donation";
import {TransferDonationService} from "../../service/transfer-donation.service";
import {PickupDonation} from "../../common/pickup-donation";
import {DailyValidation} from "../../common/daily-validation";

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.css']
})
export class TargetComponent {
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


  ngOnInit() {
   this.getTargets()
  }

  transformDates(data: Target[]): Target[] {
    return data.map((target: Target) => {

      return target;
    });
  }
  // getTarge() {
  //   const today = new Date();
  //   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  //   this.targetService.getTargets().subscribe(
  //     (data: Target[]) => {
  //       this.targets = this.transformDates(data);
  //       console.log(this.targets);
  //
  //       this.donationCashService.getCashDonations().subscribe(
  //         donasicash => {
  //           data.forEach(target => {
  //             target.input = donasicash.filter(donation => {
  //               const transferDate = new Date(donation.date);
  //               return (
  //                 transferDate >= startOfMonth &&
  //                 transferDate <= today &&
  //                 donation.user.workArea === target.unit
  //
  //               );
  //             })
  //               .reduce((total, donation) => total + donation.amount, 0);
  //           })
  //         }
  //       )
  //
  //       this.donationTransfer.getTransferDonations().subscribe(
  //         donationtransfer => {
  //           data.forEach(target => {
  //            target.input = donationtransfer.filter(donationtransfer => {
  //              const transferDate = new Date(donationtransfer.date);
  //              return (
  //                transferDate >= startOfMonth &&
  //                transferDate <= today &&
  //                donationtransfer.user.workArea === target.unit
  //              );
  //            })
  //              .reduce((total, donationtransfer) => total + donationtransfer.amount, 0);
  //           })
  //         }
  //       )
  //     },
  //
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  getTargets() {
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



  onAddTargets(addForm: NgForm){
    addForm.value.inputTarget = this.removeDotNumber(addForm.value.inputTarget);
    this.targetService.addTargets(addForm.value).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        this.getTargets()
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onUpdateTarget(updateForm: NgForm): void {
    console.log(updateForm.value)
    updateForm.value.inputTarget = this.removeDotNumber(updateForm.value.inputTarget);
    this.targetService.updateTarget(updateForm.value).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        this.getTargets()
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  onDeleteTarget(id: string): void {
    this.targetService.deleteTarget(id).subscribe(
      () => {
        this.getTargets()
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil dihapus';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    )
  }

  openAddModal(content: any) {
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    document.getElementById('addDate')?.focus();
  }

  openUpdateModal(content: any, target: Target) {
    this.target = target;
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    document.getElementById('updateDate')?.focus();
  }

  openDeleteModal(content: any, target: Target) {
    this.target = target;
    this.modal.open(content);
    document.getElementById('delete')?.focus();
  }





  addDotNumber(input: number): string {
    let inputString: string = String(input);
    inputString = inputString.replace(/\./g, ',');
    inputString = inputString.replace(/[^0-9,]/g, '');
    inputString = inputString.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return inputString;
  }

  removeDotNumber(input: string): number {
    input = input.replace(/\./g, '');
    input = input.replace(/,/g, '.');
    return Number(input);
  }
}
