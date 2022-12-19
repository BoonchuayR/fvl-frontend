import { Component, OnInit, ViewChild } from "@angular/core";
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

@Component({
  selector: "app-profile-view",
  templateUrl: "./profile-view.component.html",
  styleUrls: ["./profile-view.component.scss"],
})
export class ProfileViewComponent implements OnInit {
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
  topup: Topup = new Topup();
  topups!: any;

  meters: any = [];
  allMeter!: any;

  shops: any = [];
  meterState: any;

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
  ) {}

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
      this.buildBarChart();
    });

    // Get shops of customer
    this.shopService.getAll().subscribe((shops) => {
      this.meterService.getAll().subscribe((allMeters) => {

        this.shops = shops.filter((s: any) => {
          return s.uid === this.currentUser.uid;
        });

        // console.log("shops: ", shops)

        const shopMeters = this.shops.map((s: any) => {
          return s.storeId;
        });

        // console.log("shopMeters: ", shopMeters)

        for (let i = 0; i < shopMeters.length; i++) {
          for (let j = 0; j < shopMeters[i].length; j++) {
            const filteredMeters = allMeters.filter((am) => {
              return am.storeId === shopMeters[i][j];
            });
            this.meters.push(...filteredMeters);
          }
        }
      });
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
      series: series,
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
      labels: labels,
      markers: {
        size: 0
      },
  
      xaxis: {
        type: "string"
      },
      yaxis: {
        title: {
          text: 'จำนวนเงิน',
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

  changMeterState(event: any, serialNo: any, id: string) {
    const isChecked = event.target.checked;
    const state = isChecked ? 1 : 0;
    this.iotService.meterUpdateState(serialNo, state).subscribe((res) => {
    });
    // const meterState = [{ id: id, state: state }];
    localStorage.clear();
    localStorage.setItem("meterState", `${state}`);
  }

  setPrintTopup(topup: any) {
    this.printTopup = topup
  }

  printPage() {
    window.print();
  }
  
}
