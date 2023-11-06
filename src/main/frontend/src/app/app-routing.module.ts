import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GuestComponent} from "./component/guest/guest.component";
import {DonorComponent} from "./component/donor/donor.component";
import {CashDonationComponent} from "./component/cash-donation/cash-donation.component";
import {BoxDonationComponent} from "./component/box-donation/box-donation.component";
import {TransferDonationComponent} from "./component/transfer-donation/transfer-donation.component";
import {CashlessDonationComponent} from "./component/cashless-donation/cashless-donation.component";
import {EventCompensationComponent} from "./component/event-compensation/event-compensation.component";
import {CashDepositComponent} from "./component/cash-deposit/cash-deposit.component";
import {CashlessExpenseComponent} from "./component/cashless-expense/cashless-expense.component";
import {DailyValidationComponent} from "./component/daily-validation/daily-validation.component";
import {CharityBoxComponent} from "./component/charity-box/charity-box.component";
import {UserComponent} from "./component/user/user.component";
import {PickupDonationComponent} from "./component/pickup-donation/pickup-donation.component";
import {LoginComponent} from "./component/login/login.component";
import {TemplateComponent} from "./component/template/template.component";
import {AuthGuard} from "./guard/auth.guard";
import {AdmissionAdminComponent} from "./component/dashboard/admission-admin/admission-admin.component";
import {ManagerFundraisingComponent} from "./component/dashboard/manager-fundraising/manager-fundraising.component";
import {FrontOfficeComponent} from "./component/dashboard/front-office/front-office.component";
import {TimJemputDonasiComponent} from "./component/dashboard/tim-jemput-donasi/tim-jemput-donasi.component";
import {PetugasPundiComponent} from "./component/dashboard/petugas-pundi/petugas-pundi.component";
import {MarketingKomunikasiComponent} from "./component/dashboard/marketing-komunikasi/marketing-komunikasi.component";
import {NotFoundComponent} from "./component/not-found/not-found.component";
import {DonorTransactionHistoryComponent} from "./component/donor-transaction-history/donor-transaction-histor.component";
import {ReportComponent} from "./component/report/report.component";
import {
  CashDonationReportComponent
} from "./component/financial-statements/cash-donation-report/cash-donation-report.component";


const routes: Routes = [
  {
    path: '', component: LoginComponent, children: [
      {path: 'masuk', component: LoginComponent}
    ]
  },

  {
    path: '', component: TemplateComponent, children: [
      {
        path: 'tamu',
        component: GuestComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['FRONT_OFFICE', 'ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING']}
      },
      {
        path: 'donatur',
        component: DonorComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['MARKETING_KOMUNIKASI', 'FRONT_OFFICE', 'ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING', 'TIM_JEMPUT_DONASI']}
      },
      {
        path: 'history/:id/transaction',
        component: DonorTransactionHistoryComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['MARKETING_KOMUNIKASI', 'FRONT_OFFICE', 'ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING', 'TIM_JEMPUT_DONASI']}
      },
      {
        path: 'report',
        component: ReportComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: [ 'ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING']}
      },
      {
        path: 'pundi',
        component: CharityBoxComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['PETUGAS_PUNDI', 'ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING']}
      },
      {
        path: 'donasi-cash',
        component: CashDonationComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['FRONT_OFFICE', 'ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING', 'TIM_JEMPUT_DONASI']}
      },
      {
        path: 'donasi-pundi-fo',
        component: BoxDonationComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['FRONT_OFFICE', 'ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING']}
      },
      {
        path: 'donasi-transfer',
        component: TransferDonationComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['MARKETING_KOMUNIKASI', 'FRONT_OFFICE', 'ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING']}
      },
      {
        path: 'donasi-non-tunai',
        component: CashlessDonationComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['FRONT_OFFICE', 'ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING']}
      },
      {
        path: 'donasi-pundi',
        component: PickupDonationComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['PETUGAS_PUNDI', 'ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING']}
      },
      {
        path: 'santunan-acara',
        component: EventCompensationComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['FRONT_OFFICE', 'ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING']}
      },
      {
        path: 'setor-tunai',
        component: CashDepositComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['FRONT_OFFICE', 'ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING', 'TIM_JEMPUT_DONASI', 'PETUGAS_PUNDI', 'MARKETING_KOMUNIKASI']}
      },
      {
        path: 'pengeluaran-non-tunai',
        component: CashlessExpenseComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['FRONT_OFFICE', 'ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING']}
      },
      {
        path: 'validasi-harian',
        component: DailyValidationComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['FRONT_OFFICE', 'ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING', 'TIM_JEMPUT_DONASI', 'PETUGAS_PUNDI', 'MARKETING_KOMUNIKASI']}
      },
      {
        path: 'pengguna',
        component: UserComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['ADMIN_PENERIMAAN', 'MANAGER_FUNDRAISING']}
      },
      {
        path: 'dashboard-admin-penerimaan',
        component: AdmissionAdminComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['ADMIN_PENERIMAAN']}
      },
      {
        path: 'dashboard-manager-fundraising',
        component: ManagerFundraisingComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['MANAGER_FUNDRAISING']}
      },
      {
        path: 'dashboard-front-office',
        component: FrontOfficeComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['FRONT_OFFICE']}
      },
      {
        path: 'dashboard-tim-jemput-donasi',
        component: TimJemputDonasiComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['TIM_JEMPUT_DONASI']}
      },
      {
        path: 'dashboard-petugas-pundi',
        component: PetugasPundiComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['PETUGAS_PUNDI']}
      },
      {
        path: 'dashboard-marketing-komunikasi',
        component: MarketingKomunikasiComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['MARKETING_KOMUNIKASI']}
      },
      {
        path: 'report/cash-donation-report',
        component: CashDonationReportComponent,
        canActivate: [AuthGuard],
        data: {expectedRoles: ['MANAGER_FUNDRAISING']}
      },
      {path: '404', component: NotFoundComponent},
      {path: '**', component: NotFoundComponent}
    ]
  },

  {path: '**', redirectTo: '', pathMatch: 'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}










