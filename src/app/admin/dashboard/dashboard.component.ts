import { Component, OnInit, ViewChild } from "@angular/core";
import {
  emailSentBarChart,
  monthlyEarningChart,
  transactions,
  orders,
  users,
} from "../dashboard/data";
import { ChartType } from "../dashboard/dashboard.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserService } from "src/app/service/user.service";
import Swal from "sweetalert2";
import { user } from "@angular/fire/auth";
import { CustomerService } from "src/app/service/customer.service";
import { ShopService } from "src/app/service/shop.service";
import { MeterService } from "src/app/service/meter.service";

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

  emailSentBarChart!: ChartType;
  monthlyEarningChart!: ChartType;
  transactions: any;
  orders: any;
  users!: any;
  customers!: any;
  shops!: any;
  meters!: any;
  numberOfusers!: number;
  numberOfShops!: number;
  numberOfMeters!: number;
  @ViewChild("content") content: any;

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private customerService: CustomerService,
    private shopService: ShopService,
    private meterService: MeterService
  ) {}

  ngOnInit(): void {
    this.numberOfusers = 0;
    //BreadCrumb
    this.breadCrumbItems = [
      { label: "หน้าหลัก" },
      { label: "Dashboard", active: true },
    ];

    // Get all users show in dashboard
    this.userService.getAllUser().subscribe((users) => {
      this.users = users;
      this.numberOfusers = users.length;
      // Get all customer show in dashboard
      this.customerService.getAll().subscribe((customers) => {
        // console.log("customers: ", customers);
        this.users.push(...customers);
        this.customers = customers;
        // this.numberOfusers = users.length + customers.length;
      });
    });

    // Get all shops
    this.shopService.getAll().subscribe((shops) => {
      this.shops = shops;
      this.numberOfShops = shops.length;
    });

    // Get all meters
    this.meterService.getAll().subscribe((meters) => {
      this.meters = meters;
      this.numberOfMeters = meters.length;
    });
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
