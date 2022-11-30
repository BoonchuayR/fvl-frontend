import { Component, OnInit, ViewChild } from "@angular/core";
import {
  emailSentBarChart,
  monthlyEarningChart,
  transactions,
  orders,
  users,
} from "./data";
import { ChartType } from "./dashboard.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserService } from "src/app/service/user.service";
import { user } from "@angular/fire/auth";

@Component({
  selector: "app-dashboards",
  templateUrl: "./dashboards.component.html",
  styleUrls: ["./dashboards.component.scss"],
})

/**
 * Dashboard Component
 */
export class DashboardsComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  emailSentBarChart!: ChartType;
  monthlyEarningChart!: ChartType;
  transactions: any;
  orders: any;
  users: any;
  numberOfUsers!: any;
  @ViewChild("content") content: any;

  constructor(
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    //BreadCrumb
    this.breadCrumbItems = [
      { label: "Dashboard" },
      { label: "Dashboard", active: true },
    ];

    // Users
    this.userService.getAll().subscribe((users) => {
      this.users = users;
      // this.numberOfUsers = users.length;
    });

    /**
     * Fetches the data
     */
    // this.fetchData();
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
    this.transactions = transactions;
    this.orders = orders;
  }

  /***
   * Subscribe Model open
   */
  openModal() {
    this.modalService.open(this.content, { centered: true });
  }
}
