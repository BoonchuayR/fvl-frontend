import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SimplebarAngularModule } from "simplebar-angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { NgApexchartsModule } from "ng-apexcharts";
import {
  NgbDropdownModule,
  NgbAccordionModule,
  NgbNavModule,
  NgbProgressbarModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbCollapseModule,
} from "@ng-bootstrap/ng-bootstrap";

import { MobileRoutingModule } from "./mobile-routing.module";
import { RegisterComponent } from "./register/register.component";
import { ProfileAddComponent } from "./profile/profile-add/profile-add.component";
import { ProfileListComponent } from "./profile/profile-list/profile-list.component";
import { ProfileViewComponent } from "./profile/profile-view/profile-view.component";
import { ProfileEditComponent } from "./profile/profile-edit/profile-edit.component";
import { TopupComponent } from "./topup/topup.component";
import { AnnounceListComponent } from "./announce/announce-list/announce-list.component";
import { AnnounceAddComponent } from "./announce/announce-add/announce-add.component";
import { AnnounceEditComponent } from "./announce/announce-edit/announce-edit.component";
import { AnnounceViewComponent } from "./announce/announce-view/announce-view.component";
import { MeterDashboardComponent } from "./meter/meter-dashboard/meter-dashboard.component";
import { MeterListComponent } from "./meter/meter-list/meter-list.component";
import { MeterAddComponent } from "./meter/meter-add/meter-add.component";
import { MeterEditComponent } from "./meter/meter-edit/meter-edit.component";
import { MeterViewComponent } from "./meter/meter-view/meter-view.component";
import { ShopListComponent } from "./shop/shop-list/shop-list.component";
import { ShopAddComponent } from "./shop/shop-add/shop-add.component";
import { ShopEditComponent } from "./shop/shop-edit/shop-edit.component";
import { ShopViewComponent } from "./shop/shop-view/shop-view.component";
import { RepairListComponent } from "./repair/repair-list/repair-list.component";
import { RepairAddComponent } from "./repair/repair-add/repair-add.component";
import { RepairEditComponent } from "./repair/repair-edit/repair-edit.component";
import { RepairViewComponent } from "./repair/repair-view/repair-view.component";
import { HistoryListComponent } from "./history/history-list/history-list.component";
import { HistoryViewComponent } from "./history/history-view/history-view.component";
import { PrintPageComponent } from './profile/print-page/print-page.component';

@NgModule({
  declarations: [
    RegisterComponent,
    TopupComponent,
    AnnounceListComponent,
    AnnounceAddComponent,
    AnnounceEditComponent,
    AnnounceViewComponent,
    MeterDashboardComponent,
    MeterListComponent,
    MeterAddComponent,
    MeterEditComponent,
    MeterViewComponent,
    ShopListComponent,
    ShopAddComponent,
    ShopEditComponent,
    ShopViewComponent,
    RepairListComponent,
    RepairAddComponent,
    RepairEditComponent,
    RepairViewComponent,
    ProfileListComponent,
    ProfileViewComponent,
    ProfileEditComponent,
    ProfileAddComponent,
    HistoryListComponent,
    HistoryViewComponent,
    PrintPageComponent
  ],
  imports: [
    CommonModule,
    MobileRoutingModule,
    ScrollToModule.forRoot(),
    NgApexchartsModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbNavModule,
    NgbProgressbarModule,
    NgbCollapseModule,
    NgbTooltipModule,
    NgbPopoverModule,
    SimplebarAngularModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class MobileModule {}
