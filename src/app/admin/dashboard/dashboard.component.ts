import { Component, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { ChartType, DashboardUser ,DashboardShop} from "../dashboard/dashboard.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserService } from "src/app/service/user.service";
import Swal from "sweetalert2";
import { CustomerService } from "src/app/service/customer.service";
import { ShopService } from "src/app/service/shop.service";
import { MeterService } from "src/app/service/meter.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { DashboardSortableDirective, SortEventDashboard } from "./dashboard-sortable.directive";
import { Observable } from "rxjs/internal/Observable";
import { DashboardAdvancedServiceMD } from "./dashboard-datatable.service";
import { DashboardAdvancedService } from "./dashboardshop-datatable.service";
import { DashboardShopSortableDirective } from "./dashboardshop-sortable.directive";
import { take } from "rxjs/operators";


@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})

/**
 * Dashboard Component
 */
export class DashboardComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;


  tableData!: DashboardUser[];
  hideme: boolean[] = [];
  tables$: Observable<DashboardUser[]>;
  total$: Observable<number>;
  @ViewChildren(DashboardSortableDirective)
  headers!: QueryList<DashboardSortableDirective>;

  tableDatashop!: DashboardShop[];
  hidemeshop: boolean[] = [];
  tablesshop$: Observable<DashboardShop[]>;
  totalshop$: Observable<number>;
  @ViewChildren(DashboardShopSortableDirective)
  headersshop!: QueryList<DashboardShopSortableDirective>;

  

  emailSentBarChart!: ChartType;
  monthlyEarningChart!: ChartType;
  transactions: any;
  orders: any;
  users!: any;
  customers!: any;
  displayUsers: any = [];
  shops!: any;
  meters!: any;
  numberOfUsers!: number;
  numberOfCustomers = 0;
  numberOfShops!: number;
  numberOfMeters!: number;
  @ViewChild("content") content: any;

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private customerService: CustomerService,
    private shopService: ShopService,
    private meterService: MeterService,
    private authenService: AuthenticationService,
    public service: DashboardAdvancedServiceMD,
    public services: DashboardAdvancedService
  ) {  
    this.tables$ = service.tables$;
    this.total$ = service.total$;
    this.tablesshop$ = services.tables$;
    this.totalshop$ = services.total$;
  }

  ngOnInit(): void {
    this.displayUsers = [];
    this.numberOfUsers = 0;
    //BreadCrumb
    this.breadCrumbItems = [
      { label: "หน้าหลัก" },
      { label: "มิเตอร์ไฟฟ้า", active: true },
    ];

    const currentUser = this.authenService.currentUser();
   
    // Get all users show in dashboard
    this.userService.getAll().pipe(take(1)).subscribe((allUsers) => {
      this.users = allUsers;
      console.log(allUsers)
      this.numberOfUsers += allUsers.length;

      const tempUsers = allUsers.map(u => {
        return {
          typeUser: u.typeUser,
          displayName: u.displayName,
          email: u.email,
          phone: u.phone
        }
      })
    //   // console.log("tempUsers ",tempUsers);

      this.displayUsers.push(...tempUsers)

    //   // Get all customer show in dashboard
      this.customerService.getAll().subscribe((allCustomer) => {
        this.customers = allCustomer;
        this.numberOfUsers += allCustomer.length;
        const userCustomers = allCustomer.map(cust => {
          console.log(cust)
          return {
            typeUser: "ลูกค้า",
            displayName: cust.custName,
            email: cust.email,
            phone: cust.custPhone
          }
        })
        // console.log("userCustomer ",userCustomers);

        this.displayUsers.push(...userCustomers)
        this.service.dashboards =  this.displayUsers;
      });
    });

     // Get all shops
     this.shopService.getAll().subscribe((shops) => {
      this.shops = shops;
      this.numberOfShops = shops.length;
      // console.log("shops ",shops);
      this.services.dashboardshop = this.shops;
      console.log("this shops >>>> ///// ", this.shops);
    });

    // Get all meters
    this.meterService.getAll().subscribe((meters) => {
      this.meters = meters;
      this.numberOfMeters = meters.length;
    });
  }
  onSort({ column, direction }: SortEventDashboard) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortableDashboard !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.openModal();
  //   }, 2000);
  // }

  /***
   * Subscribe Model open
   */
  openModal() {
    this.modalService.open(this.content, { centered: true });
  }

  /**
   * cancel sweet alert
   * @param cancel modal content
   */
  cancel() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger ms-2",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "กดสวิตช์มิเตอร์",
        text: "คุณต้องการที่กดสวิตช์มิเตอร์?",
        icon: "warning",
        confirmButtonText: "ต้องการ",
        cancelButtonText: "ไม่ต้องการ",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            "สำเร็จ!",
            "ได้ทำการกดสวิตช์มิเตอร์เรียบร้อยแล้ว.",
            "success"
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "ยกเลิก",
            "ยกเลิกการกดสวิตช์มิเตอร์ :)",
            "error"
          );
        }
      });
  }
}
