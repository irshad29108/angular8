import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { JwtModule } from "@auth0/angular-jwt";


import { NgSlimScrollModule, SLIMSCROLL_DEFAULTS } from 'ngx-slimscroll';
import { MorrisJsModule } from 'angular-morris-js';
import { DataTableModule } from "angular-6-datatable";
import { ChartsModule } from 'ng2-charts';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './component/header/header.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ManagePublisherComponent } from './component/manage-publisher/manage-publisher.component';
import { ManageAuditProfileComponent } from './component/manage-audit-profile/manage-audit-profile.component';
import { ManageBuyerComponent } from './component/manage-buyer/manage-buyer.component';
import { ManageMonitorComponent } from './component/manage-monitor/manage-monitor.component';
import { ManageAgentsComponent } from './component/manage-agents/manage-agents.component';
import { CreatecampaignComponent } from './component/createcampaign/createcampaign.component';
import { ManagecampaignComponent } from './component/managecampaign/managecampaign.component';
import { ViewTfnComponent } from './component/view-tfn/view-tfn.component';
import { AddAssignTfnComponent } from './component/add-assign-tfn/add-assign-tfn.component';
import { PendingTfnComponent } from './component/pending-tfn/pending-tfn.component';
import { RingpoolComponent } from './component/ringpool/ringpool.component';
import { CdrReportsComponent } from './component/cdr-reports/cdr-reports.component';
import { CdrQueueComponent } from './component/cdr-queue/cdr-queue.component';
import { CdrQueueOutboundComponent } from './component/cdr-queue-outbound/cdr-queue-outbound.component';
import { ProfileComponent } from './component/profile/profile.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { UsageComponent } from './component/usage/usage.component';
import { ReportsviewComponent } from './component/reportsview/reportsview.component';
import { PublisherBalanceComponent } from './component/publisher-balance/publisher-balance.component';
import { AddPaymentComponent } from './component/add-payment/add-payment.component';
import { RealtimeComponent } from './component/realtime/realtime.component';
import { QueueMonitorComponent } from './component/queue-monitor/queue-monitor.component';
import { PlyrModule } from 'ngx-plyr';
import { AudioplayerComponent } from './component/audioplayer/audioplayer.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PublisherPipe } from './component/manage-buyer/publisher.pipe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from '../helpers/error.interceptor';
import { AddcampaignComponent } from './component/addcampaign/addcampaign.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { FilterPipe } from './component/manage-buyer/filter.pipe';
import { PublisherFilterPipe } from './component/manage-publisher/publisher-filter.pipe';
import { TfnFilterPipe } from './component/view-tfn/tfn-filter.pipe';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { CampaignFilterPipe } from './component/managecampaign/campaign-filter.pipe';
import { CdrReportFilterPipe } from './component/cdr-reports/cdr-report-filter.pipe';
import { RolesComponent } from './component/roles/roles.component';
import { CdrQueueFilterPipe } from './component/cdr-queue/cdr-queue-filter.pipe';
import { ManageQueueComponent } from './component/manage-queue/manage-queue.component';
import { PageAccessComponent } from './component/acl/page-access/page-access.component';
import { PageListComponent } from './component/acl/page-list/page-list.component';
import { ModuleListComponent } from './component/acl/module-list/module-list.component';
import { CdrbOutBoundPipe } from './component/cdr-queue-outbound/cdrb-out-bound.pipe';
import { ManageAdminComponent } from './component/manage-admin/manage-admin.component';
import { PagenotfoundComponent } from './component/pagenotfound/pagenotfound.component';
import { NgSelect2Module } from 'ng-select2';
import { ActiveHoursComponent } from './component/active-hours/active-hours.component';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { MohComponent } from './component/moh/moh.component';
import { ActiveBuyerHourComponent } from './component/active-buyer-hour/active-buyer-hour.component';
import { UsagePipe } from './component/usage/usage.pipe';
import { ToastrModule } from 'ngx-toastr';
import { ModalComponent } from './component/modal/modal.component';
import { ManageCampaignsComponent } from './component/manage-campaigns/manage-campaigns.component';
import { SetMailComponent } from './component/set-mail/set-mail.component';
import { PopupComponent } from './component/popup/popup.component';
import { EllipsisPipe } from './component/managecampaign/ellipsis.pipe';

import { RealtimeTfnComponent } from './component/realtime-tfn/realtime-tfn.component';
import { ExtensionComponent } from './component/extension/extension.component';
import { TagInputModule } from 'ngx-chips';
import { RealtimeBuyerComponent } from './component/realtime-buyer/realtime-buyer.component';
import { IvrComponent } from './component/ivr/ivr.component';
import { IvrMusicComponent } from './component/ivr-music/ivr-music.component';
import {IvrMusicPipe} from './component/ivr-music/ivr-music.pipe';
import { IvrPipe } from './component/ivr/ivr.pipe';
import { IvrentryComponent } from './component/ivrentry/ivrentry.component';


export function tokenGetter() {
  return localStorage.getItem("access_token");
}
@NgModule({
  declarations: [
  LayoutComponent,
  HeaderComponent,
  SidebarComponent,
  DashboardComponent,
  ManagePublisherComponent,
  ManageAuditProfileComponent,
  ManageBuyerComponent,
  ManageMonitorComponent,
  ManageAgentsComponent,
  CreatecampaignComponent,
  ManagecampaignComponent,
  ViewTfnComponent,
  AddAssignTfnComponent,
  PendingTfnComponent,
  RingpoolComponent,
  CdrReportsComponent,
  CdrQueueComponent,
  CdrQueueOutboundComponent,
  ProfileComponent,
  UsageComponent,
  ReportsviewComponent,
  AddPaymentComponent,
  PublisherBalanceComponent,
  RealtimeComponent,
  QueueMonitorComponent,
  AudioplayerComponent,
  PublisherPipe,
  AddcampaignComponent,
  FilterPipe,
  PublisherFilterPipe,
  TfnFilterPipe,
  CampaignFilterPipe,
  CdrReportFilterPipe,
  RolesComponent,
  CdrQueueFilterPipe,
  ManageQueueComponent,
  PageAccessComponent,
  PageListComponent,
  ModuleListComponent,
  CdrbOutBoundPipe,
  ManageAdminComponent,
  PagenotfoundComponent,
  ActiveHoursComponent,
  MohComponent,
  ActiveBuyerHourComponent,
  UsagePipe,
  ModalComponent,
  ManageCampaignsComponent,
  SetMailComponent,
  PopupComponent,
  EllipsisPipe,
  RealtimeTfnComponent,
  RealtimeBuyerComponent,
  ExtensionComponent,
  IvrComponent,
  IvrMusicComponent,
  IvrMusicPipe,
  IvrPipe,
  IvrentryComponent
 
  ],
  imports: [
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: tokenGetter,
    //     // whitelistedDomains: ["example.com"],
    //     // blacklistedRoutes: ["example.com/examplebadroute/"]
    //   }
    // }),
   ToastrModule.forRoot({
      timeOut: 5000,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    }) ,
    TagInputModule,
    CommonModule,
    LayoutRoutingModule,
    NgSlimScrollModule,
    MorrisJsModule,
    DataTableModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule, 
    PlyrModule,
    HttpClientModule,
    AngularMultiSelectModule,
    NgSelect2Module,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    AmazingTimePickerModule,
    NgxDaterangepickerMd.forRoot({
      applyLabel: 'Okay',
      firstDay: 3,

}),
ConfirmationPopoverModule.forRoot({
  confirmButtonType: 'danger' // set defaults here
}),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },{
    provide: SLIMSCROLL_DEFAULTS,
    useValue: {
      alwaysVisible: false,
      gridOpacity: '0.2', barOpacity: '0.5',
      gridBackground: '#fff',
      gridWidth: '6',
      gridMargin: '2px 2px',
      barBackground: '#fff',
      barWidth: '6',
      barMargin: '2px 2px',
    },
  },DatePipe],
  
})
export class LayoutModule { }
