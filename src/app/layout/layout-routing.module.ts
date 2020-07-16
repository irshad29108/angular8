import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ManagePublisherComponent } from './component/manage-publisher/manage-publisher.component';
import { ManageAuditProfileComponent } from './component/manage-audit-profile/manage-audit-profile.component';
import { ManageBuyerComponent } from './component/manage-buyer/manage-buyer.component';
import { ManageMonitorComponent } from './component/manage-monitor/manage-monitor.component';
import { ManageAgentsComponent } from './component/manage-agents/manage-agents.component';
import { CreatecampaignComponent } from './component/createcampaign/createcampaign.component';
import { AddcampaignComponent } from './component/addcampaign/addcampaign.component';
import { ManagecampaignComponent } from './component/managecampaign/managecampaign.component';
import { ViewTfnComponent } from './component/view-tfn/view-tfn.component';
import { AddAssignTfnComponent } from './component/add-assign-tfn/add-assign-tfn.component';
import { PendingTfnComponent } from './component/pending-tfn/pending-tfn.component';
import { RingpoolComponent } from './component/ringpool/ringpool.component';
import { CdrReportsComponent } from './component/cdr-reports/cdr-reports.component';
import { CdrQueueComponent } from './component/cdr-queue/cdr-queue.component';
import { CdrQueueOutboundComponent } from './component/cdr-queue-outbound/cdr-queue-outbound.component';
import { ProfileComponent } from './component/profile/profile.component';
import { UsageComponent } from './component/usage/usage.component';
import { ReportsviewComponent } from './component/reportsview/reportsview.component';
import { PublisherBalanceComponent } from './component/publisher-balance/publisher-balance.component';
import { AddPaymentComponent } from './component/add-payment/add-payment.component';
import { RealtimeComponent } from './component/realtime/realtime.component';
import { QueueMonitorComponent } from './component/queue-monitor/queue-monitor.component'; 
import { ManageQueueComponent } from './component/manage-queue/manage-queue.component';
import { PageAccessComponent } from './component/acl/page-access/page-access.component';
import { PageListComponent } from './component/acl/page-list/page-list.component';
import { ModuleListComponent } from './component/acl/module-list/module-list.component';
import { RolesComponent } from './component/roles/roles.component';
import { LayoutComponent } from './layout.component';
import { LoginGuard } from '../guard/login.guard';
import { BuyerGuard } from '../guard/buyer.guard';
import { ManageAdminComponent } from './component/manage-admin/manage-admin.component';
import { PagenotfoundComponent } from './component/pagenotfound/pagenotfound.component';
import { PublisherGuard } from '../guard/publisher.guard';
import { ActiveHoursComponent } from './component/active-hours/active-hours.component';
import { MohComponent } from './component/moh/moh.component';
import { ActiveBuyerHourComponent } from './component/active-buyer-hour/active-buyer-hour.component';
import { MonitorGuard } from '../guard/monitor.guard';
import { ManageCampaignsComponent } from './component/manage-campaigns/manage-campaigns.component';
import { SetMailComponent } from './component/set-mail/set-mail.component';
import { RealtimeTfnComponent } from './component/realtime-tfn/realtime-tfn.component';
import { RealtimeBuyerComponent } from './component/realtime-buyer/realtime-buyer.component';
import { ExtensionComponent } from './component/extension/extension.component';
import { IvrMusicComponent } from './component/ivr-music/ivr-music.component';
import { IvrComponent } from './component/ivr/ivr.component';
import { IvrentryComponent } from './component/ivrentry/ivrentry.component';


const routes: Routes = [
  
  {path:'', component:LayoutComponent, 
    children: [
      { path: '', component: DashboardComponent},
      { path: 'active-hours', component: ActiveHoursComponent },
      {path:'mohclass',component:MohComponent},
      {path:'active-buyer',component:ActiveBuyerHourComponent,canActivate:[BuyerGuard,MonitorGuard]},
      { path:'manage-users/manage-publisher', component: ManagePublisherComponent,canActivate:[BuyerGuard,PublisherGuard,MonitorGuard] },
      { path: 'manage-users/manage-audit-profile', component: ManageAuditProfileComponent },
      { path: 'manage-users/buyer-list', component: ManageBuyerComponent ,canActivate:[BuyerGuard,MonitorGuard]},
      { path: 'manage-users/roles', component: RolesComponent ,canActivate:[BuyerGuard,PublisherGuard,MonitorGuard]},
      { path: 'manage-users/admin', component: ManageAdminComponent },
      { path: 'manage-users/manage-monitor-list', component: ManageMonitorComponent },
      { path: 'manage-users/manage-agent-list', component: ManageAgentsComponent },
      { path: 'campaign/create', component: CreatecampaignComponent,canActivate:[BuyerGuard]},
      {path:'campaign/extension',component:ExtensionComponent,canActivate:[BuyerGuard]},
      {path:'campaigns/manage/:id',component:ManageCampaignsComponent,canActivate:[BuyerGuard]},
      { path: 'campaign/add', component: AddcampaignComponent,canActivate:[PublisherGuard,MonitorGuard]},
      { path: 'campaign/manage', component: ManagecampaignComponent,canActivate:[BuyerGuard,MonitorGuard]},
      { path: 'tfn/view', component: ViewTfnComponent ,canActivate:[BuyerGuard,MonitorGuard]},
      { path: 'tfn/add-assign', component: AddAssignTfnComponent },
      { path: 'tfn/pending', component: PendingTfnComponent },
      { path: 'tfn/ringpool', component: RingpoolComponent },
      { path: 'CDR-manage/CDR-reports', component: CdrReportsComponent ,canActivate:[MonitorGuard]},
      { path: 'CDR-manage/CDR-reports/:id', component: CdrReportsComponent ,canActivate:[MonitorGuard]},
      { path: 'CDR-manage/queue-CDR', component: CdrQueueComponent,canActivate:[BuyerGuard]  },
      { path: 'CDR-manage/queue-CDR-outbound', component: CdrQueueOutboundComponent ,canActivate:[BuyerGuard] },
      { path: 'profile', component:ProfileComponent,canActivate:[BuyerGuard]},
      { path: 'usage', component:UsageComponent ,canActivate:[MonitorGuard]},
      { path: 'reports/reportview/:id', component: ReportsviewComponent,canActivate:[BuyerGuard,MonitorGuard]},
      { path: 'reports/reportview', component: ReportsviewComponent,canActivate:[BuyerGuard,MonitorGuard]},
      { path: 'wallet/view-publisher-balance', component: PublisherBalanceComponent ,canActivate:[BuyerGuard,PublisherGuard,MonitorGuard]},
      { path: 'wallet/add-payment', component: AddPaymentComponent,canActivate:[BuyerGuard,PublisherGuard,MonitorGuard] },
      { path: 'realtime', component: RealtimeComponent },
      {path:'queue-monitoring', component:QueueMonitorComponent,canActivate:[BuyerGuard]},
      {path:'queue-management', component:ManageQueueComponent,canActivate:[BuyerGuard,MonitorGuard]},
      {path:'acl/page-access', component:PageAccessComponent,canActivate:[BuyerGuard,PublisherGuard,MonitorGuard]},
      {path:'acl/page-list', component:PageListComponent,canActivate:[BuyerGuard,PublisherGuard,MonitorGuard]},
      {path:'acl/module-list', component:ModuleListComponent,canActivate:[BuyerGuard,PublisherGuard,MonitorGuard]},
      { path: 'setting/set-mail', component: SetMailComponent,canActivate:[BuyerGuard,PublisherGuard,MonitorGuard] },
      { path: 'realtime-tfn', component: RealtimeTfnComponent },
      { path: 'app-realtime-buyer', component: RealtimeBuyerComponent },
      { path: 'ivr-music', component: IvrMusicComponent },
      { path: 'ivr', component: IvrComponent },
      { path: 'ivr-entry', component: IvrentryComponent },
      
      

    ]
  },
  //{ path: '**', redirectTo: '', pathMatch: 'full' },
  //{path:'**',component:PagenotfoundComponent}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
