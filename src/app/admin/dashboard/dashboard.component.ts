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
import { AuthenticationService } from "src/app/core/services/auth.service";
import { Router } from "@angular/router";

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

  ) {}

  ngOnInit(): void {
    this.displayUsers = [];
    this.numberOfUsers = 0;
    //BreadCrumb
    this.breadCrumbItems = [
      { label: "หน้าหลัก" },
      { label: "Dashboard", active: true },
    ];

    const currentUser = this.authenService.currentUser();

    // Get all users show in dashboard
    this.userService.getAll().subscribe((allUsers) => {
      this.users = allUsers;
      this.numberOfUsers += allUsers.length;

      const tempUsers = allUsers.map(u => {
        return {
          typeUser: u.typeUser,
          displayName: u.displayName,
          email: u.email,
          phone: u.phone
        }
      })

      this.displayUsers.push(...tempUsers)

      // Get all customer show in dashboard
      this.customerService.getAll().subscribe((allCustomer) => {
        this.customers = allCustomer;
        this.numberOfUsers += allCustomer.length;
  
        const userCustomers = allCustomer.map(cust => {
          return {
            typeUser: "ลูกค้า",
            displayName: cust.custName,
            email: cust.email,
            phone: cust.custPhone
          }
        })

        this.displayUsers.push(...userCustomers)
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
