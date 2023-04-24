import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CustomerService } from 'src/app/service/customer.service';
import Swal from 'sweetalert2';
import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { Customer } from 'src/app/core/models/customer.models';
import { CustomerSortableDirective, SortEventCustomer } from './customer-sortable.directive';
import { CustomerServicecus } from './customer-datatable.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  providers: [CustomerServicecus, DecimalPipe]
  
})
export class CustomerListComponent implements OnInit {
  tableData!: Customer[];
  hideme: boolean[] = [];
  tables$: Observable<Customer[]>;
  total$: Observable<number>;
  @ViewChildren(CustomerSortableDirective)
  headers!: QueryList<CustomerSortableDirective>;
  customer!:any

  constructor(private customerService:CustomerService,public service:CustomerServicecus) { 
    this.tables$ = service.tables$;
      this.total$ = service.total$;
  }

  ngOnInit(): void {
    this.customerService.getAll().subscribe((customers) => {
      this.customer = customers;
     console.log('customer >>>>>>>>>>>.....[]',this.customer);

    })
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
      console.log(id)
      if (result.value) {
        this.customerService.delete(id).then(deletedcustomer => {console.log(deletedcustomer);
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


}
