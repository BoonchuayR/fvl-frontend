import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { emailSentBarChart, monthlyEarningChart } from "../data";
import { ChartType } from "../profile.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { UserService } from "src/app/service/user.service";
import { TopupService } from "src/app/service/topup.service";
import { CustomerService } from "src/app/service/customer.service";
import { Timestamp } from "@angular/fire/firestore/firebase";
import { Topup } from "src/app/core/models/topup.model";
import * as moment from "moment";
import { ShopService } from "src/app/service/shop.service";
import { MeterService } from "src/app/service/meter.service";
import { IotService } from "src/app/service/iot.service";
import { Meter } from "src/app/core/models/meter.model";
import { Router } from "@angular/router";
import { ElectricityService } from "src/app/service/electricity.service";
import { ticketData } from "src/app/admin/ticket/ticket-list/ticket-data";
import { Observable } from "rxjs/internal/Observable";
import {
  profileElectricData,
  profileMeterData,
  profileShopData,
  profileTopupData,
} from "./profile-view-models";
import {
  ProfileViewShopSortableDirective,
  SortEventShop,
} from "./profile-view-shop-sortable.directive";
import { ProfileShopAdvancedServiceMD } from "./profile-shop-datatable.service";
import { ProfileViewMeterSortableDirective } from "./profile-view-meter-sortable.directive";
import { ProfileMeterAdvancedServiceMD } from "./profile-meter-datatable.service";
import { ProfileTopupAdvancedServiceMD } from "./profile-topup-datatable.service";
import { ProfileViewTopupSortableDirective } from "./profile-view-topup-sortable.directive";
import { ProfileViewElectricSortableDirective } from "./profile-view-electric-sortable.directive";
import { ProfileElectricAdvancedServiceMD } from "./profile-electric-datatable.service";
import { Electricity } from "src/app/core/models/electricity.model";

@Component({
  selector: "app-profile-view",
  templateUrl: "./profile-view.component.html",
  styleUrls: ["./profile-view.component.scss"],
})
export class ProfileViewComponent implements OnInit {
  tableData!: profileShopData[];
  hideme: boolean[] = [];
  tables$: Observable<profileShopData[]>;
  total$: Observable<number>;
  @ViewChildren(ProfileViewShopSortableDirective)
  headers!: QueryList<ProfileViewShopSortableDirective>;

  tableDataMeter!: profileMeterData[];
  hidemeMeter: boolean[] = [];
  tablesMeter$: Observable<profileMeterData[]>;
  totalMeter$: Observable<number>;
  @ViewChildren(ProfileViewMeterSortableDirective)
  headersMeter!: QueryList<ProfileViewMeterSortableDirective>;

  tableDataTopup!: profileTopupData[];
  hidemeTopup: boolean[] = [];
  tablesTopup$: Observable<profileTopupData[]>;
  totalTopup$: Observable<number>;
  @ViewChildren(ProfileViewTopupSortableDirective)
  headersTopup!: QueryList<ProfileViewTopupSortableDirective>;

  tableDataElectric!: profileElectricData[];
  hidemeElectric: boolean[] = [];
  tablesElectric$: Observable<profileElectricData[]>;
  totalElectric$: Observable<number>;
  @ViewChildren(ProfileViewElectricSortableDirective)
  headersElectric!: QueryList<ProfileViewElectricSortableDirective>;

  currentUser!: any;
  customer!: any;
  customerId!: string;
  email!: string;
  userFullName!: string;
  CurrentMoney!: number;
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  emailSentBarChart!: ChartType;
  monthlyEarningChart!: ChartType;

  topUpAndChargeBarChart!: ChartType;

  topupMoney!: any;

  topup: any;
  topups!: any;

  meters: any = [];
  allMeter!: any;

  shops: any = [];
  meterState: any;

  electricityList: any = [];

  printTopup = {};
  meterchart: any = [];
  currentchart: any = [];

  balancAmtItems: any[] = [];

  @ViewChild("content") content: any;

  constructor(
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private userService: UserService,
    private topupService: TopupService,
    private customerService: CustomerService,
    private shopService: ShopService,
    private meterService: MeterService,
    private iotService: IotService,
    private electricityService: ElectricityService,
    public service: ProfileShopAdvancedServiceMD,
    public services: ProfileMeterAdvancedServiceMD,
    public serviceTopup: ProfileTopupAdvancedServiceMD,
    public serviceElectric: ProfileElectricAdvancedServiceMD
  ) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
    this.tablesMeter$ = services.tables$;
    this.totalMeter$ = services.total$;
    this.tablesTopup$ = serviceTopup.tables$;
    this.totalTopup$ = serviceTopup.total$;
    this.tablesElectric$ = serviceElectric.tables$;
    this.totalElectric$ = serviceElectric.total$;
  }

  ngOnInit(): void {
    this.meterState = localStorage.getItem("meterState");

    this.customer = {
      currentMoney: 0,
    };

    this.topupMoney = 300;

    this.currentUser = this.authService.currentUser();

    // Get user data
    this.userService.getUser(this.currentUser.uid).subscribe((user) => {});

    // Get Balance Money
    this.customerService
      .getCustomer(this.currentUser.uid)
      .subscribe((customer) => {
        this.customer = customer;
      });

    // Get topup transactions
    this.topupService.getAll().subscribe((res) => {
      this.topups = res.filter((r) => {
        return r.uid === this.currentUser.uid;
      });
      this.topups.sort((a: { createdAt: number }, b: { createdAt: number }) => {
        if (a.createdAt > b.createdAt) {
          return 1;
        }
        return 1;
      });
      // console.log("this.topups >>> ", this.topups)
      this.serviceTopup.profileTopups = this.topups;
      this.customerService
        .getCustomer(this.currentUser.uid)
        .subscribe((meter) => {
          this.meterchart = meter;
          // console.log(this.meterchart);
        });
    });

    this.electricityService.getAll().subscribe((items) => {
      const sortedItems = items.sort((a, b) => {
        if (a.date! > b.date!) {
          return -1;
        } else {
          return 1;
        }
      });
      const last10Items = sortedItems.slice(0, 5);
      this.balancAmtItems = last10Items.reverse();
      this.buildBarChart();
    });

    // Get shops of customer
    this.shopService.getAll().subscribe((shops) => {
      this.meterService.getAll().subscribe((allMeters) => {
        this.shops = shops.filter((s: any) => {
          return s.uid === this.currentUser.uid;
        });
        this.service.profileShops = this.shops;
        const shopMeters = this.shops.map((s: any) => {
          return s.boothIds;
        });
        //  console.log("shopMeters >>>> ",this.shops);

        if (shopMeters && shopMeters[0] && shopMeters.length > 0) {
          for (let i = 0; i < shopMeters.length; i++) {
            this.meters = [];
            for (let j = 0; j < shopMeters[i].length; j++) {
              const filteredMeters: any = allMeters.filter((am) => {
                return am.boothId === shopMeters[i][j];
              });

              this.meters.push(...filteredMeters);
              this.services.profileMeters = this.meters;
            }
          }
        }
      });
    });

    // Get electricity of customer
    this.electricityService
      .findByUID(this.currentUser.uid)
      .subscribe((eltList) => {
        this.electricityList = eltList.sort((a, b) => {
          if (a.date! > b.date!) {
            return -1;
          }
          return 1;
        });
        this.serviceElectric.profileElectrics = this.electricityList;
        console.log("electricity == ", this.electricityList);
      });

    //BreadCrumb
    this.breadCrumbItems = [
      { label: "Pages" },
      { label: "Profile", active: true },
    ];

    /**
     * Fetches the data
     */
    this.fetchData();
  }

  onSort({ column, direction }: SortEventShop) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortableShop !== column) {
        header.direction = "";
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  buildBarChart() {

    // console.log(labels);
    this.topUpAndChargeBarChart = {
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      colors: ["#f1b44c"],
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: string) => {
          return val;
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"],
        },
      },
      series: [
        {
          name: "ยอดคงเหลือ",
          data: this.balancAmtItems.map((i:Electricity) => Math.round(i.balanceAmt! * 100) / 100),
        },
      ],
      xaxis: {
        categories: this.balancAmtItems.map((i:Electricity) => i.date?.substring(0,10)),
        position: "bottom",
        labels: {
          offsetY: -5,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
          offsetY: -35,
        },
      },
      fill: {
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100],
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: (val: string) => {
            return val;
          },
        },
      },
      // title: {
      //   text: "ยอดเงินคงเหลือรายวัน",
      //   floating: true,
      //   offsetY: 320,
      //   align: "center",
      //   style: {
      //     color: "#444",
      //   },
      // },
    };
  }

  /**
   * Fetches the data
   */
  private fetchData() {
    this.emailSentBarChart = emailSentBarChart;
    this.monthlyEarningChart = monthlyEarningChart;
  }

  /***
   * Subscribe Model open
   */
  openModal() {
    this.modalService.open(this.content, { centered: true });
  }

  /**
   * Open scroll modal
   * @param staticDataModal scroll modal data
   */
  repairModal(repair: any) {
    this.modalService.open(repair, {
      backdrop: "static",
      keyboard: false,
      centered: true,
      windowClass: "modal-holder",
    });
  }

  /**
   * Open scroll modal
   * @param staticDataModal scroll modal data
   */
  topupModal(topup: any) {
    this.modalService.open(topup, {
      backdrop: "static",
      keyboard: false,
      centered: true,
      windowClass: "modal-holder",
    });
  }

  setTopupMoney(money: any) {
    this.topupMoney = money;
  }

  submitTopup() {
    this.topup.uid = this.currentUser.uid;
    this.topup.status = "W";
    this.topup.statusName = "รอชำระ";
    this.topup.topupMoney = this.topupMoney;
    this.topup.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
    this.topup.custName = this.customer.custName;
    this.topupService.create({ ...this.topup }).then((res) => {
      // Update customer's current money
      this.customer.currentMoney =
        +this.customer.currentMoney + +this.topupMoney;
      this.customerService.update(this.customer).then((res) => {});
    });
    this.modalService.dismissAll();
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

  changMeterState(event: any, storeId: any, id: any, meter: any) {
    const isChecked = event.target.checked;
    Swal.fire({
      title: `${isChecked ? "ยืนยันการเปิดมิเตอร์" : "ยืนยันการปิดมิเตอร์"}`,
      text: "คุณต้องการลบข้อมูลมิเตอร์นี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "ใช่, ต้องการ!",
      cancelButtonText: "ไม่, ยกเลิก!",
    }).then((result) => {
      if (result.value) {
        this.iotService
          .meterUpdateState(storeId, isChecked ? "1" : "2")
          .subscribe((res) => {
            meter.meterState = isChecked ? "1" : "2";
            this.meterService
              .update(meter)
              .then((res) => {
                window.location.reload();
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: `${
                    isChecked ? "เปิดมิเตอร์สำเร็จ" : "ปิดมิเตอร์สำเร็จ"
                  }`,
                  showConfirmButton: false,
                  timer: 3000,
                });
              })
              .catch((err) => {
                console.log("error: ", id);
              });
          });
      }
    });
  }

  setPrintTopup(topup: any) {
    this.printTopup = topup;
  }

}
