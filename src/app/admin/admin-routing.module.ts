import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component'
import { UserListComponent } from './user/user-list/user-list.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { AnnounceListComponent } from './announce/announce-list/announce-list.component';
import { AnnounceEditComponent } from './announce/announce-edit/announce-edit.component';
import { AnnounceAddComponent } from './announce/announce-add/announce-add.component';
import { AnnounceViewComponent } from './announce/announce-view/announce-view.component';
import { MeterDashboardComponent } from './meter/meter-dashboard/meter-dashboard.component';
import { MeterListComponent } from './meter/meter-list/meter-list.component';
import { MeterAddComponent } from './meter/meter-add/meter-add.component';
import { MeterEditComponent } from './meter/meter-edit/meter-edit.component';
import { MeterViewComponent } from './meter/meter-view/meter-view.component';
import { ShopListComponent } from './shop/shop-list/shop-list.component';
import { ShopAddComponent } from './shop/shop-add/shop-add.component';
import { ShopEditComponent } from './shop/shop-edit/shop-edit.component';
import { ShopViewComponent } from './shop/shop-view/shop-view.component';
import { TopupListComponent } from './topup/topup-list/topup-list.component';
import { TopupAddComponent } from './topup/topup-add/topup-add.component';
import { TopupEditComponent } from './topup/topup-edit/topup-edit.component';
import { TopupViewComponent } from './topup/topup-view/topup-view.component';
import { UserViewComponent } from './user/user-view/user-view.component';
import { CustomerAddComponent } from './customer/customer-add/customer-add.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerViewComponent } from './customer/customer-view/customer-view.component';
import { TicketAddComponent } from './ticket/ticket-add/ticket-add.component';
import { TicketEditComponent } from './ticket/ticket-edit/ticket-edit.component';
import { TicketListComponent } from './ticket/ticket-list/ticket-list.component';
import { TicketViewComponent } from './ticket/ticket-view/ticket-view.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'user-list',
    component: UserListComponent
  },
  {
    path: 'user-edit/:id',
    component: UserEditComponent
  },
  {
    path: 'user-add',
    component: UserAddComponent
  },
  {
    path: 'user-view',
    component: UserViewComponent
  },
  {
    path: 'customer-list',
    component: CustomerListComponent
  },
  {
    path: 'customer-edit/:id',
    component: CustomerEditComponent
  },
  {
    path: 'customer-add',
    component: CustomerAddComponent
  },
  {
    path: 'customer-view/:id',
    component: CustomerViewComponent
  },
  {
    path: 'announce-list',
    component: AnnounceListComponent
  },
  {
    path: 'announce-edit',
    component: AnnounceEditComponent
  },
  {
    path: 'announce-add',
    component: AnnounceAddComponent
  },
  {
    path: 'announce-view',
    component: AnnounceViewComponent
  },
  {
    path: 'meter-dashboard',
    component: MeterDashboardComponent
  },
  {
    path: 'meter-list/:zone',
    component: MeterListComponent
  },
  {
    path: 'meter-edit/:id',
    component: MeterEditComponent
  },
  {
    path: 'meter-add',
    component: MeterAddComponent
  },
  {
    path: 'meter-view/:id',
    component: MeterViewComponent
  },
  {
    path: 'shop-list',
    component: ShopListComponent
  },
  {
    path: 'shop-edit/:id',
    component: ShopEditComponent
  },
  {
    path: 'shop-add',
    component: ShopAddComponent
  },
  {
    path: 'shop-view',
    component: ShopViewComponent
  },
  {
    path: 'topup-list',
    component: TopupListComponent
  },
  {
    path: 'topup-edit',
    component: TopupEditComponent
  },
  {
    path: 'topup-add',
    component: TopupAddComponent
  },
  {
    path: 'topup-view',
    component: TopupViewComponent
  },
  {
    path: 'ticket-list',
    component: TicketListComponent
  },
  {
    path: 'ticket-edit/:id',
    component: TicketEditComponent
  },
  {
    path: 'ticket-add',
    component: TicketAddComponent
  },
  {
    path: 'ticket-view/:id',
    component: TicketViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
