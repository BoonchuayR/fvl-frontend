import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { CustomerService } from 'src/app/service/customer.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnInit {
  customerId!: string;
  submit!: boolean;
  editform = new FormGroup({
    id: new FormControl(""),
    CustCode: new FormControl(""),
    CustName: new FormControl(""),
    CustEmail: new FormControl(""),
    CustPhone: new FormControl(""),
    CustPwd: new FormControl(""),
    CustStartDate: new FormControl(""),
  });

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params["id"];
    this.customerService.get(this.customerId).subscribe((data) => {
      this.editform.setValue(data);

      console.log(data);
    });
  }

  updatecustomerData() {
    this.editform = this.formBuilder.group({
      id: [''],
      CustCode: [''],
      CustName: [''],
      CustEmail: [''],
      CustPhone: [''],
      CustPwd: [''],
      CustStartDate: [''],
    });
  }

  formSubmit() {
    this.customerService.update(this.editform.value)
      .then((customer) => {
        console.log("customer");
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'แก้ไขข้อมูลลูกค้าเรียบร้อย',
          showConfirmButton: false,
          timer: 3000
        });

      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Bootsrap validation form submit method
   */
  validSubmit() {
    this.submit = true;
  }


}
