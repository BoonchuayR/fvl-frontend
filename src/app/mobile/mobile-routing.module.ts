import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { ProfileAddComponent } from './profile/profile-add/profile-add.component';
import { ProfileListComponent } from './profile/profile-list/profile-list.component';
import { ProfileViewComponent } from './profile/profile-view/profile-view.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { TopupComponent } from './topup/topup.component';
import { AnnounceListComponent } from './announce/announce-list/announce-list.component';
import { AnnounceAddComponent } from './announce/announce-add/announce-add.component';
import { AnnounceEditComponent } from './announce/announce-edit/announce-edit.component';
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
import { RepairListComponent } from './repair/repair-list/repair-list.component';
import { RepairAddComponent } from './repair/repair-add/repair-add.component';
import { RepairEditComponent } from './repair/repair-edit/repair-edit.component';
import { RepairViewComponent } from './repair/repair-view/repair-view.component';
import { HistoryListComponent } from './history/history-list/history-list.component';
import { HistoryViewComponent } from './history/history-view/history-view.component';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'profile-add',
    component: ProfileAddComponent
  },
  {
    path: 'profile-list/:id',
    component: ProfileListComponent
  },
  {
    path: 'profile-edit',
    component: ProfileEditComponent
  },
  {
    path: 'profile-view',
    component: ProfileViewComponent
  },
  {
    path: 'topup',
    component: TopupComponent
  },
  {
    path: 'announce-list',
    component: AnnounceListComponent
  },
  {
    path: 'announce-add',
    component: AnnounceAddComponent
  },
  {
    path: 'announce-edit',
    component: AnnounceEditComponent
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
    path: 'meter-list',
    component: MeterListComponent
  },
  {
    path: 'meter-add',
    component: MeterAddComponent
  },
  {
    path: 'meter-edit',
    component: MeterEditComponent
  },
  {
    path: 'meter-view',
    component: MeterViewComponent
  },
  {
    path: 'shop-list',
    component: ShopListComponent
  },
  {
    path: 'shop-add',
    component: ShopAddComponent
  },
  {
    path: 'shop-edit',
    component: ShopEditComponent
  },
  {
    path: 'shop-view',
    component: ShopViewComponent
  },
  {
    path: 'repair-list',
    component: RepairListComponent
  },
  {
    path: 'repair-add',
    component: RepairAddComponent
  },
  {
    path: 'repair-edit',
    component: RepairEditComponent
  },
  {
    path: 'repair-view',
    component: RepairViewComponent
  },
  {
    path: 'history-list',
    component: HistoryListComponent
  },
  {
    path: 'history-view',
    component: HistoryViewComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileRoutingModule { }
