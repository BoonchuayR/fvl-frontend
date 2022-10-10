import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";

import { AuthenticationService } from "../../../core/services/auth.service";
import { AuthfakeauthenticationService } from "../../../core/services/authfake.service";
import { environment } from "../../../../environments/environment";
import { LAYOUT_MODE } from "../../../layouts/layouts.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {
  layout_mode!: string;

  // set the currenr year
  year: number = new Date().getFullYear();
  loginForm!: FormGroup;
  submitted = false;
  returnUrl!: string;
  error = "";

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit(): void {
    this.layout_mode = LAYOUT_MODE;
    if (this.layout_mode === "dark") {
      document.body.setAttribute("data-layout-mode", "dark");
    }
    //Validation Set
    this.loginForm = this.formBuilder.group({
      email: ["admin@pichforest.com", [Validators.required, Validators.email]],
      password: ["123456", [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      console.log("environment.defaultauth: ", environment.defaultauth);
      if (environment.defaultauth === "firebase") {
        this.authenticationService
          .login(this.f.email.value, this.f.password.value)
          .then((res: any) => {
            this.router.navigate([""]);
          })
          .catch((error: string) => {
            this.error = error ? error : "";
          });
      } else {
        this.authFackservice
          .login(this.f.email.value, this.f.password.value)
          .pipe(first())
          .subscribe(
            (data: any) => {
              this.router.navigate([""]);
            },
            (error: string) => {
              this.error = error ? error : "";
            }
          );
      }
    }
  }
}
