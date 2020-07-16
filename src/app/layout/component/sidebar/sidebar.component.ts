import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ISlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';
import { ServiceService } from '../../services/service.service';
import { PublisherModalService } from 'src/app/servies/modal/publisher-modal.service';
import { PopupService } from 'src/app/servies/modal/popup.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public modalService: PublisherModalService, public sideNavService: ServiceService, public router: Router) { }


  stringifiedData: any;
  data = JSON.parse(localStorage.getItem('username'))



  opts: ISlimScrollOptions;
  scrollEvents: EventEmitter<SlimScrollEvent>;
  menuArray:any=[]
  managepublisher:any;

  ngOnInit() {
   
    if(this.data.role=='buyer'){
      this.menuArray = [
        { path: 'dashboard', icon: 'mdi-av-timer', title: 'Dashboard', submenu: {} },
        // {
        //   path: '', icon: 'mdi-wallet', title: 'ACL Management',
        //   submenu: [
        //     { "path": "acl/page-access","icon":"mdi-content-duplicate", "title": "Page Access" },
        //     { "path": "acl/page-list","icon":"mdi-content-duplicate", "title": "Page List" },
        //     { "path": "acl/module-list","icon":"mdi-content-duplicate", "title": "Module List" },
        //   ]
        // },
        // {
        //   path: 'Campaign', icon: 'mdi-content-copy', title: 'Campaign',
        //   submenu: [
        //     //  {"path": "campaign/create", "title" : "Create Campaign"},
        //     //  {"path": "campaign/add", "title" : "Add Campaign"},
        //     { "path": "campaign/manage", "title": "Manage Campaigns" },
        //   ]
        // },
        // {
        //   path: '', icon: 'mdi-account', title: 'Manage Users',
        //   submenu: [
        //     // { "path": "manage-users/manage-publisher","icon":"mdi-content-duplicate", "title": "Manage Publisher" },
        //     //  {"path": "manage-users/manage-audit-profile", "title" : "Manage Audit Profile"},
        //     // { "path": "manage-users/buyer-list","icon":"mdi-content-duplicate", "title": "Manage Buyer" },
        //     { "path": 'queue-management', "icon": 'mdi-av-timer', "title": 'Manage Queue',},
        //     //{ "path": "manage-users/roles","icon":"mdi-content-duplicate", "title": "Manage Roles" },
        //     //{"path": "manage-users/manage-monitor-list", "title" : "Manage Monitor"},
        //     //{"path": "manage-users/manage-agent-list", "title" : "Manage Agents"}
        //   ]
        // },
        // {
        //   path: '', icon: 'mdi-deskphone', title: 'TFN',
        //   submenu: [
        //     { "path": "tfn/view","icon":"mdi-content-duplicate", "title": "View TFN" },
        //     //  {"path": "tfn/add-assign", "title" : "Add and Assign TFN"},
        //     //  {"path": "tfn/pending", "title" : "Pending TFN"},
        //     //  {"path": "tfn/ringpool", "title" : "Ringpool"},
    
        //   ]
        // },
        { path: 'dashboard/realtime', icon: 'mdi-av-timer', title: 'Realtime', submenu: {} },
        {
          path: '', icon: 'mdi-clipboard-text', title: 'Manage CDR',
          submenu: [
            { "path": "dashboard/CDR-manage/CDR-reports","icon":"mdi-content-duplicate", "title": "CDR Reports" },
            // { "path": "CDR-manage/queue-CDR","icon":"mdi-content-duplicate", "title": "Queue CDR" },
            // { "path": "CDR-manage/queue-CDR-outbound","icon":"mdi-content-duplicate", "title": "Queue CDR Outbound" },
    
          ]
        },
    //     { path: '', icon: 'mdi-alarm-check', title: 'Active Hours', submenu: [

    //       { "path": "active-hours","icon":"mdi-deskphone", "title": "TFN Active Hours" },
    //       { "path": "active-buyer","icon":"mdi-content-duplicate", "title": "Buyer Active Hours" }
    //    ] 
    //  },
 
        // { path: 'active-hours', icon: 'mdi-alarm-check', title: 'Active Hours', submenu: {} },
    
        // {
        //   path: '', icon: 'mdi-wallet', title: 'Wallet',
        //   submenu: [
        //     { "path": "wallet/view-publisher-balance","icon":"mdi-content-duplicate", "title": "View Publisher Balance" },
        //     { "path": "wallet/add-payment","icon":"mdi-content-duplicate", "title": "Add Payment" },
    
        //   ]
        // },
        // {
        //   path: '', icon: 'mdi-format-color-fill', title: 'Reports',
        //   submenu: [
        //     { "path": "reports/reportview","icon":"mdi-content-duplicate", "title": "Report View" }
        //   ]
        // },
        // { path: 'usage', icon: 'mdi-chart-bar', title: 'Usage', submenu: {} },
        // { path: 'queue-monitoring', icon: 'mdi-monitor-multiple', title: 'Queue Monitoring', submenu: {} },
        // { path: 'mohclass', icon: 'mdi-apps', title: 'MOH Class', submenu: {} },
      ];
    }else if(this.data.role=='publisher'){
      this.menuArray = [
        { path: 'dashboard', icon: 'mdi-av-timer', title: 'Dashboard', submenu: {} },
        // {
        //   path: '', icon: 'mdi-wallet', title: 'ACL Management',
        //   submenu: [
        //     { "path": "acl/page-access","icon":"mdi-content-duplicate", "title": "Page Access" },
        //     { "path": "acl/page-list","icon":"mdi-content-duplicate", "title": "Page List" },
        //     { "path": "acl/module-list","icon":"mdi-content-duplicate", "title": "Module List" },
        //   ]
        // },
         {
           path: '', icon: 'mdi-content-copy', title: 'Campaign',
           submenu: [
              {"path": "dashboard/campaign/create", "title" : "Create Campaign","icon":"mdi-content-duplicate"},
            //  {"path": "campaign/add", "title" : "Add Campaign"},
           { "path": "dashboard/campaign/manage","icon":"mdi-content-duplicate", "title": "Manage Campaigns" },
           {"path": "dashboard/campaign/extension","icon":"mdi-content-duplicate", "title": "Manage Extension" },
          ]
         },
         {
          path: '', icon: 'mdi-format-color-fill', title: 'Call Reports',
          submenu: [
            { "path": "dashboard/reports/reportview","icon":"mdi-content-duplicate", "title": "Report View" }
          ]
        },
        {
          path: '', icon: 'mdi-account', title: 'Manage Users',
          submenu: [
           // { "path": "manage-users/manage-publisher","icon":"mdi-content-duplicate", "title": "Manage Publisher" },
            //  {"path": "manage-users/manage-audit-profile", "title" : "Manage Audit Profile"},
            { "path": "dashboard/manage-users/buyer-list","icon":"mdi-content-duplicate", "title": "Manage Buyer" },
            { "path": 'dashboard/queue-management', "icon": 'mdi-av-timer', "title": 'Manage Queue',},
            //{ "path": "manage-users/roles","icon":"mdi-content-duplicate", "title": "Manage Roles" },
            // { "path": "manage-users/admin","icon":"mdi-content-duplicate", "title": "Manage Admin" },
            //  {"path": "manage-users/manage-monitor-list", "title" : "Manage Monitor"},
            //  {"path": "manage-users/manage-agent-list", "title" : "Manage Agents"}
          ]
        },
        {
          path: '', icon: 'mdi-deskphone', title: 'TFN',
          submenu: [
            { "path": "dashboard/tfn/view","icon":"mdi-content-duplicate", "title": "View TFN" },
            //  {"path": "tfn/add-assign", "title" : "Add and Assign TFN"},
            //  {"path": "tfn/pending", "title" : "Pending TFN"},
            //  {"path": "tfn/ringpool", "title" : "Ringpool"},
    
          ]
        },
        { path: 'dashboard/realtime', icon: 'mdi-av-timer', title: 'Realtime', submenu: {} },
        {
          path: '', icon: 'mdi-clipboard-text', title: 'Call detail Records',
          submenu: [
            { "path": "dashboard/CDR-manage/CDR-reports","icon":"mdi-content-duplicate", "title": "CDR Reports" },
          { "path": "dashboard/CDR-manage/queue-CDR","icon":"mdi-content-duplicate", "title": "Queue CDR" },
            { "path": "dashboard/CDR-manage/queue-CDR-outbound","icon":"mdi-content-duplicate", "title": "Queue CDR Outbound" },
           
          ]
        },
        { path: '', icon: 'mdi-alarm-check', title: 'Active Hours', submenu: [

          { "path": "dashboard/active-hours","icon":"mdi-deskphone", "title": "TFN Active Hours" },
          { "path": "dashboard/active-buyer","icon":"mdi-content-duplicate", "title": "Buyer Active Hours" }
       ] 
     },
     { path: 'dashboard/mohclass', icon: 'mdi-apps', title: 'MOH Class', submenu: {} },
        
        // { path: 'active-hours', icon: 'mdi-alarm-check', title: 'Active Hours', submenu: {} },
    
    
    
        // {
        //   path: '', icon: 'mdi-wallet', title: 'Wallet',
        //   submenu: [
        //     { "path": "wallet/view-publisher-balance","icon":"mdi-content-duplicate", "title": "View Publisher Balance" },
        //     { "path": "wallet/add-payment","icon":"mdi-content-duplicate", "title": "Add Payment" },
    
        //   ]
        // },
        // {
        //   path: '', icon: 'mdi-format-color-fill', title: 'Reports',
        //   submenu: [
        //     { "path": "reports/reportview","icon":"mdi-content-duplicate", "title": "Report View" }
        //   ]
        // },
        // { path: 'usage', icon: 'mdi-chart-bar', title: 'Usage', submenu: {} },
         { path: 'dashboard/queue-monitoring', icon: 'mdi-monitor-multiple', title: 'Queue Monitoring', submenu: {} },
        // { path: 'mohclass', icon: 'mdi-apps', title: 'MOH Class', submenu: {} },
      ];
    }else if(this.data.role=='monitor'){
      this.menuArray = [
        { path: 'dashboard', icon: 'mdi-av-timer', title: 'Dashboard', submenu: {} },
        {
          path: '', icon: 'mdi-clipboard-text', title: 'Call Detail Records',
          submenu: [
            { "path": "dashboard/CDR-manage/queue-CDR","icon":"mdi-content-duplicate", "title": "Queue CDR" },
            { "path": "dashboard/CDR-manage/queue-CDR-outbound","icon":"mdi-content-duplicate", "title": "Queue CDR Outbound" },
            
          ]
        },
        { path: 'dashboard/queue-monitoring', icon: 'mdi-monitor-multiple', title: 'Queue Monitoring', submenu: {} },
       
      ]
    }else{
      this.menuArray = [
        { path: 'dashboard', icon: 'mdi-av-timer', title: 'Dashboard', submenu: {} },
        {
          
          path:'', icon: 'mdi-wallet', title: 'ACL Management',
          submenu: [
            { "path": "dashboard/acl/page-access","icon":"mdi-content-duplicate", "title": "Page Access" },
            { "path": "dashboard/acl/page-list","icon":"mdi-content-duplicate", "title": "Page List" },
            { "path": "dashboard/acl/module-list","icon":"mdi-content-duplicate", "title": "Module List" },
          ]
        },

        {
          path: '', icon: 'mdi-format-color-fill', title: 'Call Reports',
          submenu: [
            { "path": "dashboard/reports/reportview","icon":"mdi-content-duplicate", "title": "Report View" }
          ]
        },

        {
          path: '', icon: 'mdi-bullhorn', title: 'Campaign',
          submenu: [
            {"path": "dashboard/campaign/create", "icon":"mdi-content-duplicate","title" : "Create Campaign"},
            //  {"path": "campaign/add", "title" : "Add Campaign"},
            { "path": "dashboard/campaign/manage","icon":"mdi-content-duplicate", "title": "Manage Campaigns" },
            {"path": "dashboard/campaign/extension","icon":"mdi-content-duplicate", "title": "Manage Extension" },
          ]
        },
        {
          path:'',icon:'mdi-phone-voip',title:'IVR',
          submenu:[
            {"path":"dashboard/ivr-music",'icon':"mdi-shopping-music",'title':"IVR-Music"},
            {"path":"dashboard/ivr-entry",'icon':"mdi-cellphone-settings",'title':"Manage IVR"},
            {"path":"dashboard/ivr",'icon':"mdi-cellphone-settings",'title':"Add IVR"},
           
          ]
        },

        {
          path: '', icon: 'mdi-account', title: 'Manage Users',
          submenu: [
            { "path": "dashboard/manage-users/manage-publisher","icon":"mdi-content-duplicate", "title": "Manage Publisher" },
            //  {"path": "manage-users/manage-audit-profile", "title" : "Manage Audit Profile"},
            { "path": "dashboard/manage-users/buyer-list","icon":"mdi-content-duplicate", "title": "Manage Buyer" },
            { "path": 'dashboard/queue-management', "icon": 'mdi-av-timer', "title": 'Manage Queue',},
            { "path": "dashboard/manage-users/roles","icon":"mdi-content-duplicate", "title": "Manage Roles" },
            // { "path": "manage-users/admin","icon":"mdi-content-duplicate", "title": "Manage Admin" },
            //  {"path": "manage-users/manage-monitor-list", "title" : "Manage Monitor"},
            //  {"path": "manage-users/manage-agent-list", "title" : "Manage Agents"}
          ]
        },
        {
          path: '', icon: 'mdi-deskphone', title: 'TFN',
          submenu: [
            { "path": "dashboard/tfn/view","icon":"mdi-content-duplicate", "title": "View TFN" },
            //{"path": "tfn/add-assign", "title" : "Add and Assign TFN"},
            //{"path": "tfn/pending", "title" : "Pending TFN"},
            //{"path": "tfn/ringpool", "title" : "Ringpool"},
    
          ]
        },
        

        
        {
          path: '', icon: 'mdi-clipboard-text', title: 'Call Detail Records',
          submenu: [
            { "path": "dashboard/CDR-manage/CDR-reports","icon":"mdi-content-duplicate", "title": "CDR Reports" },
            { "path": "dashboard/CDR-manage/queue-CDR","icon":"mdi-content-duplicate", "title": "Queue CDR" },
            { "path": "dashboard/CDR-manage/queue-CDR-outbound","icon":"mdi-content-duplicate", "title": "Queue CDR Outbound" },
            
          ]
        },
       
        { path: '', icon: 'mdi-alarm-check', title: 'Active Hours', submenu: [

           { "path": "dashboard/active-hours","icon":"mdi-deskphone", "title": "TFN Active Hours" },
           { "path": "dashboard/active-buyer","icon":"mdi-content-duplicate", "title": "Buyer Active Hours" }
        ] 
      },

        { path: 'dashboard/queue-monitoring', icon: 'mdi-monitor-multiple', title: 'Queue Monitoring', submenu: {} },
       
        { path: 'dashboard/realtime', icon: 'mdi-av-timer', title: 'Realtime', submenu: {} },
    
        { path: 'dashboard/usage', icon: 'mdi-chart-bar', title: 'Usage', submenu: {} },
        
        { path: 'dashboard/mohclass', icon: 'mdi-apps', title: 'MOH Class', submenu: {} },



        {
          path: '', icon: 'mdi-wallet', title: 'Wallet',
          submenu: [
            { "path": "dashboard/wallet/view-publisher-balance","icon":"mdi-content-duplicate", "title": "View Publisher Balance" },
            { "path": "dashboard/wallet/add-payment","icon":"mdi-content-duplicate", "title": "Add Payment" },
    
          ]
        },

        {
          path: 'dashboard/tfn/ringpool', icon: 'mdi-deskphone', title: 'Ringpool',submenu:{}
        },

        {
          path: '', icon: 'mdi-settings', title: 'Settings',submenu:[
            { "path": "dashboard/profile","icon":"mdi-account", "title": "My Profile" },
            { "path": "dashboard/setting/set-mail","icon":"mdi-account", "title": "Mail" },
          ]
        },

        
      ];


    }
    

   
    this.scrollEvents = new EventEmitter<SlimScrollEvent>();
    this.opts = {
      position: "right", // left | right
      barBackground: "rgba(83, 233, 255, 0.35)", // #C9C9C9
      barOpacity: "0.8", // 0.8
      barWidth: "4", // 10
      barBorderRadius: "10", // 20
      barMargin: "0", // 0
      gridBackground: "rgb(0, 33, 51)", // #D9D9D9
      gridOpacity: "1", // 1
      gridWidth: "2", // 2
      gridBorderRadius: "10", // 20
      gridMargin: "0", // 0
      alwaysVisible: true, // true
      visibleTimeout: 1000, // 1000
      //scrollSensitivity: 1, // 1
    }


  }
  
  sumenuu: boolean = false;
  activeName = '';
  menu = '';
  submenu = 0;
  submenuuactive='';
  rootFun(name, path, indx) {
    
    if (this.activeName == name) {
      //console.log(this.activeName)
      this.sumenuu = true;
      this.activeName = '';
      // this.activeName = '';
    } else {
      
      this.activeName = name;

    }
    


    if (path) {
      this.router.navigateByUrl('/' + path);
    }
    // console.log(name);
  }


refreshCss(add: boolean) {

   this.activeName = name;
}

logout(){
  this.router.navigate(['login']);
  localStorage.removeItem('username');
  localStorage.removeItem('token');
}
openModal(id: string) {
  console.log(id);
  this.modalService.open('logout1');
}

closeModal(id: string) {
  console.log(id);
  this.modalService.close(id);
}

  // submenuu(name, indx) {
  //   if (this.submenuuactive == name) {
  //     this.submenuuactive = '';
  //   } else {
  //     this.submenuuactive = name;

  //   }


  //     this.router.navigateByUrl('/' + indx);
  //   }
  // }

}
