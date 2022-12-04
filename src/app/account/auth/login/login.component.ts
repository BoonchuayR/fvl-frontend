import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { LAYOUT_MODE } from "../../../layouts/layouts.model";
import { environment } from "../../../../environments/environment";
import { AuthService } from "src/app/service/auth.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { CustomerService } from "src/app/service/customer.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {}

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;

    if (!this.loginForm.valid || !email || !password) {
      return;
    }

    this.authenticationService
      .login(email, password)
      .then((user) => {
        console.log("user: ", user);

        // Switch route role 
        this.customerService.get(user.uid).subscribe(cust => {
          if (cust) {
            this.router.navigate(["/mobile/profile-view"])
          } else {
            this.router.navigate(["/"]);
          }
        })  
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  }
}
