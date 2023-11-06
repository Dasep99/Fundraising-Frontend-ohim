import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GuestComponent} from './component/guest/guest.component';
import {DonorComponent} from './component/donor/donor.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CashDonationComponent} from './component/cash-donation/cash-donation.component';
import {BoxDonationComponent} from './component/box-donation/box-donation.component';
import {TransferDonationComponent} from './component/transfer-donation/transfer-donation.component';
import {CashlessDonationComponent} from './component/cashless-donation/cashless-donation.component';
import {EventCompensationComponent} from './component/event-compensation/event-compensation.component';
import {CashDepositComponent} from './component/cash-deposit/cash-deposit.component';
import {CashlessExpenseComponent} from './component/cashless-expense/cashless-expense.component';
import {DailyValidationComponent} from './component/daily-validation/daily-validation.component';
import {TemplateComponent} from "./component/template/template.component";
import {LoginComponent} from "./component/login/login.component";
import {CharityBoxComponent} from './component/charity-box/charity-box.component';
import {DotNumberDirective} from './helpers/dot-number.directive';
import {UserComponent} from './component/user/user.component';
import {AuthInterceptor} from "./guard/auth.interceptor";
import {NgbPaginationModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {DecimalPipe} from '@angular/common';
import {PickupDonationComponent} from "./component/pickup-donation/pickup-donation.component";
import {PetugasPundiComponent} from "./component/dashboard/petugas-pundi/petugas-pundi.component";
import {MarketingKomunikasiComponent} from "./component/dashboard/marketing-komunikasi/marketing-komunikasi.component";
import {FrontOfficeComponent} from "./component/dashboard/front-office/front-office.component";
import {TimJemputDonasiComponent} from "./component/dashboard/tim-jemput-donasi/tim-jemput-donasi.component";
import {AdmissionAdminComponent} from "./component/dashboard/admission-admin/admission-admin.component";
import {ManagerFundraisingComponent} from "./component/dashboard/manager-fundraising/manager-fundraising.component";
import {NotFoundComponent} from './component/not-found/not-found.component';
import { NumberDirective } from './helpers/number.directive';
import {DonorTransactionHistoryComponent
} from './component/donor-transaction-history/donor-transaction-histor.component';
import { ReportComponent } from './component/report/report.component';
import { CashDonationReportComponent } from './component/financial-statements/cash-donation-report/cash-donation-report.component';

@NgModule({
  declarations: [
    AppComponent,
    GuestComponent,
    DonorComponent,
    CashDonationComponent,
    BoxDonationComponent,
    PickupDonationComponent,
    TransferDonationComponent,
    CashlessDonationComponent,
    EventCompensationComponent,
    CashDepositComponent,
    CashlessExpenseComponent,
    DailyValidationComponent,
    TemplateComponent,
    LoginComponent,
    CharityBoxComponent,
    DotNumberDirective,
    UserComponent,
    PetugasPundiComponent,
    MarketingKomunikasiComponent,
    FrontOfficeComponent,
    TimJemputDonasiComponent,
    AdmissionAdminComponent,
    ManagerFundraisingComponent,
    NotFoundComponent,
    NumberDirective,
    DonorTransactionHistoryComponent,
    ReportComponent,
    CashDonationReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    ReactiveFormsModule,
  ],
  providers: [DecimalPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
