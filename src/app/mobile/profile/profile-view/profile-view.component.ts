import { Component, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
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
import { profileElectricData, profileMeterData, profileShopData, profileTopupData } from "./profile-view-models";
import { ProfileViewShopSortableDirective, SortEventShop } from "./profile-view-shop-sortable.directive";
import { ProfileShopAdvancedServiceMD } from "./profile-shop-datatable.service";
import { ProfileViewMeterSortableDirective } from "./profile-view-meter-sortable.directive";
import { ProfileMeterAdvancedServiceMD } from "./profile-meter-datatable.service";
import { ProfileTopupAdvancedServiceMD } from "./profile-topup-datatable.service";
import { ProfileViewTopupSortableDirective } from "./profile-view-topup-sortable.directive";
import { ProfileViewElectricSortableDirective } from "./profile-view-electric-sortable.directive";
import { ProfileElectricAdvancedServiceMD } from "./profile-electric-datatable.service";

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
    public serviceElectric : ProfileElectricAdvancedServiceMD,
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
    this.userService.getUser(this.currentUser.uid).subscribe((user) => {
    });

    // Get Balance Money
    this.customerService
      .getCustomer(this.currentUser.uid)
      .subscribe((customer) => {
        this.customer = customer;
      });
      
    
    this.topUpAndChargeBarChart = emailSentBarChart;

    // Get topup transactions
    this.topupService.getAll().subscribe((res) => {
      this.topups = res.filter(r => {return r.uid === this.currentUser.uid});
      this.topups.sort((a: { createdAt: number; },b: { createdAt: number; })=>{
        if(a.createdAt > b.createdAt){
          return -1
        }
        return 1
      });
      // console.log("this.topups >>> ", this.topups)
      this.serviceTopup.profileTopups = this.topups;
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
          return s.storeId;
        });
        //  console.log("shopMeters >>>> ",shopMeters);

        if (shopMeters && shopMeters[0] && shopMeters.length > 0) {
          for (let i = 0; i < shopMeters.length; i++) {
            this.meters = [];
            for (let j = 0; j < shopMeters[i].length; j++) {
              const filteredMeters: any = allMeters.filter((am) => {
                return am.boothId === shopMeters[i][j];
              });
  
              this.meters.push(...filteredMeters);
              this.services.profileMeters =this.meters
              // console.log("shop >>>> ",filteredMeters);
              // this.electricityList = [];
  
              // for(let k = 0; k < filteredMeters.length; k++) {
              //     this.electricityService.findByStoreId(filteredMeters[k].storeId).subscribe(eltList => {
              //       this.electricityList.push(...eltList);
              //     })
              // }
            }
          }
        }
      });
    });

    // Get electricity of customer
      this.electricityService.findByUID(this.currentUser.uid).subscribe(eltList => {
      this.electricityList = eltList.sort((a, b) => {
        if (a.date! > b.date!) {
          return -1;
        }
        return 1;
      });
      this.serviceElectric.profileElectrics = this.electricityList;
      console.log("electricity == ",this.electricityList);
    });
    // console.log("electricity == ",this.currentUser);

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
    this.headers.forEach(header => {
      if (header.sortableShop !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
  buildBarChart() {

    const topUpMonths = [
      {
        month: "JAN", 
        topUp: 0
      },
      {
        month: "FEB",
        topUp: 0
      },
      {
        month: "MAR",
        topUp: 0
      },
      {
        month: "APR",
        topUp: 0
      },
      {
        month: "MAY",
        topUp: 0
      },
      {
        month: "JUN",
        topUp: 0
      },
      {
        month: "JUL",
        topUp: 0
      }, 
      {
        month: "AUG",
        topUp: 0
      },
      {
        month: "SEP",
        topUp: 0
      },
      {
        month: "OCT",
        topUp: 0
      },
      {
        month: "NOV",
        topUp: 0
      },
      {
        month: "DEC",
        topUp: 0
      }
    ]
      
    for (let i = 0 ; i < this.topups.length ; i++) {
      const createdAt = this.topups[i].createdAt;
      if (moment(createdAt, "YYYY-MM-DD").month() === 0) {
        topUpMonths[0].topUp += +this.topups[i].topupMoney
      } else if (moment(createdAt, "YYYY-MM-DD").month() === 1) {
        topUpMonths[1].topUp += +this.topups[i].topupMoney
      } else if (moment(createdAt, "YYYY-MM-DD").month() === 2) {
        topUpMonths[2].topUp += +this.topups[i].topupMoney
      } else if (moment(createdAt, "YYYY-MM-DD").month() === 3) {
        topUpMonths[3].topUp += +this.topups[i].topupMoney
      } else if (moment(createdAt, "YYYY-MM-DD").month() === 4) {
        topUpMonths[4].topUp += +this.topups[i].topupMoney
      } else if (moment(createdAt, "YYYY-MM-DD").month() === 4) {
        topUpMonths[5].topUp += +this.topups[i].topupMoney
      } else if (moment(createdAt, "YYYY-MM-DD").month() === 4) {
        topUpMonths[6].topUp += +this.topups[i].topupMoney
      } else if (moment(createdAt, "YYYY-MM-DD").month() === 4) {
        topUpMonths[7].topUp += +this.topups[i].topupMoney
      } else if (moment(createdAt, "YYYY-MM-DD").month() === 4) {
        topUpMonths[8].topUp += +this.topups[i].topupMoney
      } else if (moment(createdAt, "YYYY-MM-DD").month() === 4) {
        topUpMonths[9].topUp += +this.topups[i].topupMoney
      } else if (moment(createdAt, "YYYY-MM-DD").month() === 4) {
        topUpMonths[10].topUp += +this.topups[i].topupMoney
      } else{
        topUpMonths[11].topUp += +this.topups[i].topupMoney
      }
    }
    
    const filteredTopUpMonth = topUpMonths.filter(topUp => {return topUp.topUp > 0})

    const series = [
      {
        name: 'เติมเงิน',
        type: 'column',
        data: filteredTopUpMonth.map(t => {return t.topUp})
        // data: [10,20]
      },
      {
        name: 'เติมเงิน',
        type: 'column',
        data: filteredTopUpMonth.map(t => {return t.topUp})
    }
    ]

    const labels = filteredTopUpMonth.map(t => {return t.month})
    this.topUpAndChargeBarChart  = {
      chart: {
          height: 338,
          type: 'line',
          stacked: false,
          offsetY: -5,
          toolbar: {
              show: false
          }
      },
      stroke: {
          width: [0, 0, 0, 1],
          curve: 'smooth'
      },
      plotOptions: {
          bar: {
              columnWidth: '40%'
          }
      },
      colors: ['#2cb57e', '#f1b44c'],
      series: [{
          name: 'ค่าไฟ',
          type: 'column',
          data: [10, 20, 30, 40, 50, 60]
      }, {
          name: 'เติมเงิน',
          type: 'column',
          data: [60, 50, 40, 30, 20, 10]
      }],
      fill: {
          opacity: [0.85, 1, 0.25, 1],
          gradient: {
              inverseColors: false,
              shade: 'light',
              type: "vertical",
              opacityFrom: 0.85,
              opacityTo: 0.55,
              stops: [0, 100, 100, 100]
          }
      },
      labels: ['01/01/2022', '02/01/2022', '03/01/2022', '04/01/2022', '05/01/2022', '06/01/2022'],
      markers: {
          size: 0
      },
  
      xaxis: {
          type: "datetime"
      },
      yaxis: {
          title: {
              text: 'ยอดเงินคงเหลือ',
          },
      },
      tooltip: {
          shared: true,
          intersect: false,
          y: {
              formatter: function (y: any) {
                  if (typeof y !== "undefined") {
                      return y.toFixed(0) + " points";
                  }
                  return y;
  
              }
          }
      },
      grid: {
          borderColor: '#f1f1f1',
          padding: {
              bottom: 15
          }
      }
  };
  }
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.openModal();
  //   }, 2000);
  // }

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
      title: `${isChecked ? "ยืนยันการเปิดมิเตอร์":"ยืนยันการปิดมิเตอร์"}`,
      text: "คุณต้องการลบข้อมูลมิเตอร์นี้ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'ใช่, ต้องการ!',
      cancelButtonText: 'ไม่, ยกเลิก!',
    }).then((result) => {
      if (result.value) {
        this.iotService.meterUpdateState(storeId, isChecked ? "1" : "2").subscribe(res => {
          meter.meterState = isChecked ? "1" : "2"
          this.meterService.update(meter).then(res => {
            window.location.reload();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `${isChecked ? "เปิดมิเตอร์สำเร็จ":"ปิดมิเตอร์สำเร็จ"}`,
              showConfirmButton: false,
              timer: 3000
            })
          }).catch(err => {
            console.log("error: ", id)
          });
        })
      }
    });
  }

  setPrintTopup(topup: any) {
    this.printTopup = topup
  }

  // printPage() {
  //   window.print();
  // }
  
}
