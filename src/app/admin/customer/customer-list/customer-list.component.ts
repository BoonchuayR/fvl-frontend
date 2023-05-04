import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import Swal from 'sweetalert2';
import { DecimalPipe, formatDate } from '@angular/common';
import {FirebaseTSFirestore} from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { Observable } from 'rxjs';
import { Customer } from 'src/app/core/models/customer.models';
import { CustomerSortableDirective, SortEventCustomer } from './customer-sortable.directive';
import { CustomerServicecus } from './customer-datatable.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TopupService } from 'src/app/service/topup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { updateCurrentUser } from '@angular/fire/auth';
import { Topup } from 'src/app/core/models/topup.model';
import * as moment from 'moment';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  providers: [CustomerServicecus, DecimalPipe]
  
})
export class CustomerListComponent implements OnInit {
  submit!: boolean;
  validationform!: FormGroup;
  private firestorets: FirebaseTSFirestore = new FirebaseTSFirestore;
  item:any;
  tableData!: Customer[];
  hideme: boolean[] = [];
  tables$: Observable<Customer[]>;
  total$: Observable<number>;
  @ViewChildren(CustomerSortableDirective)
  headers!: QueryList<CustomerSortableDirective>;
  customer!:any
  selectedCustomer!: any;
  topupAmt!: any;
  Date1 : Date = new Date();
  createdAttoday:any;
  custNametopup:any;
  topupMoneyAt!: any;
  statusNametopup:any;

  constructor(
    private modalService: NgbModal,
    private customerService:CustomerService, 
    public service:CustomerServicecus, 
    private topupService:TopupService) {
      this.tables$ = service.tables$;
      this.total$ = service.total$;
  }

  ngOnInit(): void {
    this.topupAmt = 300;
    this.customerService.getAll().subscribe((customers) => {
      this.customer = customers;
      this.service.customers = this.customer
    });
   
  }

  onSort({ column, direction }: SortEventCustomer) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortableCustomer !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
  /**
   * Confirm sweet alert
   * @param confirm modal content
   */
   confirm(id:string) {
    Swal.fire({
      title: 'ลบข้อมูลลูกค้า',
      text: "คุณต้องการลบลูกค้านี้ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'ใช่, ต้องการ!',
      cancelButtonText:'ไม่, ยกเลิก!',
    }).then((result) => {
      if (result.value) {
        this.customerService.delete(id).then(deletedcustomer => {
          
        })
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'ลบข้อมูลลูกค้าเรียบร้อย',
          showConfirmButton: false,
          timer: 3000
        })
      }
    });
  }

  topupModal(topup: any, table: any) {
    this.selectedCustomer = table;
    this.modalService.open(topup, { backdrop: 'static', keyboard: false, centered: true, windowClass: 'modal-holder' });
  }
  alertsweetalert(alert:any) {
   
    this.modalService.open(alert, { backdrop: 'static', keyboard: false, centered: true, windowClass: 'sweetalert-holder' });
  }

  updatecurrentMoney(topupAmt: any) {
    const topupMoney = topupAmt;
    const currntMoney = this.selectedCustomer.currentMoney;
    const updateCurrentMoney = topupMoney + currntMoney;

    this.firestorets = new FirebaseTSFirestore;
    this.firestorets.update({
      path:["customers",this.selectedCustomer.uid],
      data:{currentMoney:updateCurrentMoney},
    });

    this.createdAttoday= this.Date1;
    this.custNametopup = this.selectedCustomer.custName;
    this.topupMoneyAt = updateCurrentMoney;
    this.statusNametopup = 'รอชำระ';
   
    const topup: any = {} ;
    topup.createdAt = moment().format("yyyy-MM-DD HH:mm:ss");
    topup.statusName = "รอชำระ";
    topup.custName = this.selectedCustomer.custName;
    topup.topupMoney = updateCurrentMoney;
    topup.uid = this.selectedCustomer.uid;
    this.topupService.create(topup)
      .then((topup) => {
        
    });
  }
 
}
