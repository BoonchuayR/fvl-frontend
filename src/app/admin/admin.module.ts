import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountToModule } from "angular-count-to";
import { ToastrService } from 'ngx-toastr';

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
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { AgmCoreModule } from "@agm/core";
import { Select2Module } from 'ng-select2-component';

import { AdminRoutingModule } from "./admin-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { IconsModule } from "../pages/icons/icons.module";

import { SharedModule } from "../shared/shared.module";
import { UserListComponent } from "./user/user-list/user-list.component";
import { UserEditComponent } from "./user/user-edit/user-edit.component";
import { UserAddComponent } from "./user/user-add/user-add.component";
import { AnnounceListComponent } from "./announce/announce-list/announce-list.component";
import { AnnounceEditComponent } from "./announce/announce-edit/announce-edit.component";
import { AnnounceAddComponent } from "./announce/announce-add/announce-add.component";
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
import { TopupListComponent } from "./topup/topup-list/topup-list.component";
import { TopupAddComponent } from "./topup/topup-add/topup-add.component";
import { TopupEditComponent } from "./topup/topup-edit/topup-edit.component";
import { TopupViewComponent } from "./topup/topup-view/topup-view.component";
import { UserViewComponent } from "./user/user-view/user-view.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomerAddComponent } from "./customer/customer-add/customer-add.component";
import { CustomerEditComponent } from "./customer/customer-edit/customer-edit.component";
import { CustomerListComponent } from "./customer/customer-list/customer-list.component";
import { CustomerViewComponent } from "./customer/customer-view/customer-view.component";
import { TicketAddComponent } from './ticket/ticket-add/ticket-add.component';
import { TicketEditComponent } from './ticket/ticket-edit/ticket-edit.component';
import { TicketListComponent } from './ticket/ticket-list/ticket-list.component';
import { TicketViewComponent } from './ticket/ticket-view/ticket-view.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { TablesRoutingModule } from "../pages/tables/tables-routing.modules";
import { TicketSortableDirective } from "./ticket/ticket-list/ticket-sortable.directive";
import { TopupSortableDirective } from "./topup/topup-list/topup-sortable.directive";
import { MeterSortableDirective } from "./meter/meter-list/meter-sortable.directive";
import { ShopSortableDirective } from "./shop/shop-list/shop-sortable.directive";
import { UserSortableDirective } from "./user/user-list/user-sortable.directive";
import { CustomerSortableDirective } from "./customer/customer-list/customer-sortable.directive";
import {FirebaseTSApp} from 'firebasets/firebasetsApp/firebaseTSApp';
import { environment } from "src/environments/environment";
@NgModule({
  declarations: [
    MeterSortableDirective,
    ShopSortableDirective,
    UserSortableDirective,
    CustomerSortableDirective,
    TopupSortableDirective,
    TicketSortableDirective,
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
    ShopListComponent,
    ShopAddComponent,
    ShopEditComponent,
    ShopViewComponent,
    TopupListComponent,
    TopupAddComponent,
    TopupEditComponent,
    TopupViewComponent,
    UserViewComponent,
    CustomerAddComponent,
    CustomerEditComponent,
    CustomerListComponent,
    CustomerViewComponent,
    TicketAddComponent,
    TicketEditComponent,
    TicketListComponent,
    TicketViewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TablesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AdminRoutingModule,
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
    Select2Module,
    IconsModule,
    FlatpickrModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE",
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule {

}
