import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArrayName, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CustomerService } from 'src/app/service/customer.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.scss']
})
export class CustomerAddComponent implements OnInit {
  submit!: boolean;
  validationform!: FormGroup;

  @ViewChild('content') content: any;

  public itemCardMessageForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private customerService: CustomerService) {
    this.itemCardMessageForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
  }

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
  shopModal(shop: any) {
    this.modalService.open(shop, { backdrop: 'static', keyboard: false, centered: true, windowClass: 'modal-holder' });
  }

}
