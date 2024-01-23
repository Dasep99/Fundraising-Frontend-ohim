import { Component } from '@angular/core';
import {PenerimaanAkad} from "../../common/penerimaan-akad";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../service/auth.service";
import {PenerimaanakadService} from "../../service/penerimaanakad.service";
import {CashDonationService} from "../../service/cash-donation.service";
import {Target} from "../../common/target";
import {catchError, Subject, takeUntil} from "rxjs";
import {TransferDonationService} from "../../service/transfer-donation.service";
import {CashDepositService} from "../../service/cash-deposit.service";
import {NgForm} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-penerimaan-perakad',
  templateUrl: './penerimaan-perakad.component.html',
  styleUrls: ['./penerimaan-perakad.component.css']
})
export class PenerimaanPerakadComponent {
  akads: PenerimaanAkad[] = []
  akad?: PenerimaanAkad
  alertMessage: string = '';
  currentPage = 1;
  pageSize = 10;
  errors?: any;
  userId: string = '' + this.authService.getUserId();
  userRole: string = '' + this.authService.getCurrentUserRole();

  constructor(private modal: NgbModal,
              private authService: AuthService,
              private contractService: PenerimaanakadService,
              private donationCashService: CashDonationService,
              private donationTransfer: TransferDonationService,
              private cashDepositService: CashDepositService
  ) {
  }

  ngOnInit() {
    console.log(this.getContract())
  }

  transformDates(data: PenerimaanAkad[]): PenerimaanAkad[] {
    return data.map((contract: PenerimaanAkad) => {

      return contract;
    });
  }
  uniqueUnits: Set<string> = new Set();
  getContract() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.contractService.getAkads().subscribe(
      (data: PenerimaanAkad[]) => {
        this.akads = this.transformDates(data);
        console.log(this.akads);
        this.cashDepositService.getCashDeposits().subscribe(
          cashDeposit => {
            data.forEach(akads => {
              akads.input = cashDeposit.filter(donation => {
                const transferDate = new Date(donation.date);
                return (
                  transferDate >= startOfMonth &&
                  transferDate <= today &&
                  donation.contract === akads.donationcontract &&  donation.user.workArea === akads.unit

                );
              })
                .reduce((total, donation) => total + donation.amount, 0);
            })
          }


        )


      },
    );
  }

  onAddAkads(addForm: NgForm){
    this.contractService.addAkads(addForm.value).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        return [];
      })
    ).subscribe(
      () => {
        this.getContract()
        this.modal.dismissAll('success');
        this.alertMessage = 'Data berhasil disimpan';
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000)
      }
    );
  }

  openAddModal(content: any) {
    this.modal.open(content).result.finally(() => {
      this.errors = undefined;
    });
    document.getElementById('addDate')?.focus();
  }


  }
