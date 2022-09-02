import { Component, OnInit } from '@angular/core';
import { FormArrayName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.scss']
})
export class CustomerAddComponent implements OnInit {
  submit!: boolean;
  validationform!: FormGroup;

  constructor(private formBuilder: FormBuilder, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.validationform = this.formBuilder.group({
      CustCode: ['', [Validators.required]],
      CustName: ['', [Validators.required]],
      CustEmail: ['', [Validators.required]],
      CustPhone: ['', [Validators.required]],
      CustMoney: ['', [Validators.required]],
      CustPwd: ['', [Validators.required]],
      CustStartDate: ['', [Validators.required]],
    });
  }

  formSubmit() {
    console.log(this.validationform.value);
    this.customerService.create(this.validationform.value)
      .then((customers) => { console.log("customers") })
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'เพิ่มข้อมูลลูกค้าเรียบร้อย',
      showConfirmButton: false,
      timer: 3000
    })
      .catch(error => { console.log(error) });
  }
  validSubmit() {
    this.submit = true;
  }

}
