import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import MetisMenu from 'metismenujs';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { MENU } from './menu';
import { CUST_MENU } from './menu.cust';
import { MenuItem } from './menu.model';

import { SIDEBAR_COLOR } from '../layouts.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CustomerService } from 'src/app/service/customer.service';
import { UserService } from 'src/app/service/user.service';
import { MENU_SERVICE } from './menu.service';
import { MENU_SALE } from './menu.sale';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})

/**
 * Sidebar Component
 */
export class SidebarComponent implements OnInit {

  @ViewChild('sideMenu') sideMenu!: ElementRef;
  menu: any;
  menuItems: MenuItem[] = [];

  currentUser: any;

  isSidebar: any;

  constructor(
    private router: Router, 
    public translate: TranslateService, 
    private authService: AuthenticationService,
    private customerService: CustomerService,
    private userService: UserService) {
    
    translate.setDefaultLang('en');
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
      }
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    
    this.customerService.getCustomer(this.currentUser.uid).subscribe(cust => {
      if (cust) {
        this.menuItems = CUST_MENU
      } else {
        this.userService.getUser(this.currentUser.uid).subscribe(user => {
          if (user && user.typeUser === 'ฝ่ายซ่อมบำรุง') {
            this.menuItems = MENU_SERVICE
          } else if (user && user.typeUser === 'ฝ่ายขาย') {
            this.menuItems = MENU_SALE
          } else if (user && user.typeUser === 'ฝ่ายบัญชี') {
            this.menuItems = MENU
          } else {
            this.menuItems = MENU
          }
        })
      }
    })
    
    this.isSidebar = SIDEBAR_COLOR;
    if(this.isSidebar === 'dark') {
      document.body.setAttribute('data-sidebar', 'dark');
    }
  }

  /**
   * Initialize
   */
  initialize(): void {
    this.menuItems = MENU;
  }

  /***
   * Activate droup down set 
   */
  ngAfterViewInit() {
    this.menu = new MetisMenu('#side-menu');
    this._activateMenuDropdown();
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className: any) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');
    const links: any = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    // tslint:disable-next-line: prefer-for-of
    const paths = [];
    for (let i = 0; i < links.length; i++) {
      paths.push(links[i]['pathname']);
    }
    var itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }
    if (menuItemEl) {
      menuItemEl.classList.add('active');
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement.closest('ul');
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== 'side-menu') {
            parent3El.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');
            if (childAnchor) {
              childAnchor.classList.add('mm-active');
            }
            if (childDropdown) {
              childDropdown.classList.add('mm-active');
            }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== 'side-menu') {
              parent4El.classList.add('mm-show');
              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== 'side-menu') {
                parent5El.classList.add('mm-active');
                const childanchor = parent5El.querySelector('.is-parent');
                if (childanchor && parent5El.id !== 'side-menu') {
                  childanchor.classList.add('mm-active');
                }
              }
            }
          }
        }
      }
    }
  }
}
