import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'pe-7s-home', class: '' },
    { path: '/cadastros', title: 'Cadastros',  icon:'pe-7s-note2', class: '' },
    { path: '/notifications', title: 'Mesas',  icon:'pe-7s-wine', class: '' },
    { path: '/table', title: 'Atendimento',  icon:'pe-7s-users', class: '' },
    { path: '/financeiro', title: 'Financeiro',  icon:'pe-7s-cash', class: '' },
    { path: '/icons', title: 'Relatórios',  icon:'pe-7s-print', class: '' },
    { path: '/typography', title: 'typography',  icon:'pe-7s-cash', class: '' },
    { path: '/upgrade', title: 'Configurações',  icon:'pe-7s-config', class: 'active-pro'},
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
