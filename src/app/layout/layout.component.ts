import { Component, OnInit } from '@angular/core';
import { ServiceService } from './services/service.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  collapedSideBar: boolean;

  constructor(public sideNavService: ServiceService) { }

  ngOnInit() {}

  // receiveCollapsed($event) {
  //     this.collapedSideBar = $event;
  // }

}
