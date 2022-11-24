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

  topupMoney!: any;
  topup: Topup = new Topup();
  topups!: any;

  @ViewChild("content") content: any;

  constructor(
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private userService: UserService,
    private topupService: TopupService,
    private customerService: CustomerService,
    private shopService: ShopService,

  ) {}

  ngOnInit(): void {
    this.customer = {
      currentMoney: 0,
    };

    this.topupMoney = 300;

    this.currentUser = this.authService.currentUser();
    
    console.log("currentUser: ", this.currentUser);

    // Get user data
    this.userService.getUser(this.currentUser.uid).subscribe((user) => {
      // this.userFullName = user.displayName;
      console.log("user: ", user);
    });

    // Get Balance Money
    this.customerService
      .getCustomer(this.currentUser.uid)
      .subscribe((customer) => {
        console.log("customer: ", customer);
        this.customer = customer;
      });

    // Get topup transactions
    this.topupService.getAll().subscribe((res) => {
      this.topups = res;
      // console.log("this.topups: ", this.topups);
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
    this.topup.status = "W";
    this.topup.statusName = "รอชำระ";
    this.topup.topupMoney = this.topupMoney;
    this.topup.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
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
}
