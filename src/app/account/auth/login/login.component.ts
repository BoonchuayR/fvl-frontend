import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { LAYOUT_MODE } from "../../../layouts/layouts.model";
import { environment } from "../../../../environments/environment";
import { AuthService } from "src/app/service/auth.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { CustomerService } from "src/app/service/customer.service";
import { UserService } from "src/app/service/user.service";
import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { alertData } from './data';
import { AlertColor } from "src/app/pages/advanced/notification/notification.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {

  @ViewChild('staticAlert', { static: false }) staticAlert?: NgbAlert;

  alertData: AlertColor[] = [];

  show = true;
  translucentToast = true;
  placeholderToast = true;
  staticAlertClosed = false;

  loginForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  submit!: boolean;
  incorrectEmailOrPass!: boolean

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private customerService: CustomerService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.staticAlert?.close(), 20000);
    /***
     * Data Get 
    */
    this._fetchData();
  }

  /***
 * Notification Data Get
 */
  private _fetchData() {
    this.alertData = alertData;
  }

  closeToast() {
    this.show = false;
    setTimeout(() => this.show = true, 8000);
  }

  closeTranslucentToast() {
    this.translucentToast = false;
  }

  isplaceholderToast() {
    this.placeholderToast = false;
  }

  /***
   * Notification remove
   */
  close(alert: AlertColor, alertData: AlertColor[]) {
    alertData.splice(alertData.indexOf(alert), 1);
  }


  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }

  onSubmit() {

    this.submit = true;
    const { email, password } = this.loginForm.value;

    if (!this.loginForm.valid || !email || !password) {
      return;
    }

    this.authenticationService
      .login(email, password)
      .then(async (user) => {
        this.incorrectEmailOrPass = false;
        // Switch route role 
       
        const role = await this.userService.getRole(user.uid)
        .then(res => res.json())
        .then(function(res) {
          const role = res.role;
          return role;
        });

        console.log("role >>> ", role);
        
        if (role === 'customer') {
          this.router.navigate(["/mobile/profile-view"]) 
        } else if (role === 'sale') {
          this.router.navigate(["/ticket-list"]);
        } else if (role === 'account') {
          this.router.navigate(["/"]);
        } else if (role === 'service') {
          this.router.navigate(["/ticket-list"]);
        // } else if (role === 'noRole') {
        //   throw new Error('Something bad happened');
        }  else {
          this.router.navigate(["/"]);
        }
           
      })
      .catch((err) => {
        console.log("err: ", err);
        this.incorrectEmailOrPass = true;
      });
  }

  /**
 * Returns form
 */
  get form() {
    return this.loginForm.controls;
  }

  
}
