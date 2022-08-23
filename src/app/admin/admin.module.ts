import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountToModule } from 'angular-count-to';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbDropdownModule, NgbAccordionModule, NgbNavModule, NgbProgressbarModule, NgbTooltipModule, NgbPopoverModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IconsModule } from '../pages/icons/icons.module';

import { SharedModule } from '../shared/shared.module';
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
import { RepairListComponent } from './repair/repair-list/repair-list.component';
import { RepairEditComponent } from './repair/repair-edit/repair-edit.component';
import { RepairAddComponent } from './repair/repair-add/repair-add.component';
import { RepairViewComponent } from './repair/repair-view/repair-view.component';
import { ShopListComponent } from './shop/shop-list/shop-list.component';
import { ShopAddComponent } from './shop/shop-add/shop-add.component';
import { ShopEditComponent } from './shop/shop-edit/shop-edit.component';
import { ShopViewComponent } from './shop/shop-view/shop-view.component';
import { TopupListComponent } from './topup/topup-list/topup-list.component';
import { TopupAddComponent } from './topup/topup-add/topup-add.component';
import { TopupEditComponent } from './topup/topup-edit/topup-edit.component';
import { TopupViewComponent } from './topup/topup-view/topup-view.component';
import { UserViewComponent } from './user/user-view/user-view.component';
import { ProductComponent } from './product/product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    UserListComponent,
    UserEditComponent,
    UserAddComponent,
    AnnounceListComponent,
    AnnounceEditComponent,
    AnnounceAddComponent,
    AnnounceViewComponent,
    MeterDashboardComponent,
    MeterListComponent,
    MeterAddComponent,
    MeterEditComponent,
    MeterViewComponent,
    RepairListComponent,
    RepairEditComponent,
    RepairAddComponent,
    RepairViewComponent,
    ShopListComponent,
    ShopAddComponent,
    ShopEditComponent,
    ShopViewComponent,
    TopupListComponent,
    TopupAddComponent,
    TopupEditComponent,
    TopupViewComponent,
    UserViewComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollToModule.forRoot(),
    NgApexchartsModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbNavModule,
    NgbProgressbarModule,
    NgbCollapseModule,
    NgbTooltipModule,
    NgbPopoverModule,
    CountToModule,
    IconsModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE'
    })
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AdminModule { }
