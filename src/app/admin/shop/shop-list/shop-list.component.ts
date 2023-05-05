import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { Shop } from 'src/app/core/models/shop.models';
import { ShopService } from 'src/app/service/shop.service';
import Swal from 'sweetalert2';
import { ShopSortableDirective, SortEventShop } from './shop-sortable.directive';
import { ShopServiceshop } from './shop-datatable.service';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss'],
  providers: [ShopServiceshop, DecimalPipe]

})
export class ShopListComponent implements OnInit {  
  

  tableData!: Shop[];
  hideme: boolean[] = [];
  tables$: Observable<Shop[]>;
  total$: Observable<number>;
  @ViewChildren(ShopSortableDirective)
  headers!: QueryList<ShopSortableDirective>;
  
  shops!: any

  constructor(private shopService: ShopService, 
    public service: ShopServiceshop) {
    this.tables$ = service.tables$;
    this.total$ = service.total$; 
   
  }

  ngOnInit(): void {
    this.shopService.getAll().subscribe(shops => {
      console.log("shops >>> ", shops);
      this.shops = shops;
      this.service.shops = this.shops;
    })
  }
  onSort({ column, direction }: SortEventShop) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortableShop !== column) {
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
      title: 'ลบข้อมูลร้านค้า',
      text: "คุณต้องการลบข้อมูลร้านค้านี้ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'ใช่, ต้องการ!',
      cancelButtonText:'ไม่, ยกเลิก!',
    }).then((result) => {

      if (result.value) {
        this.shopService.delete(id).then(deletedShop => {
        })
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'ลบข้อมูลร้านค้าเรียบร้อย',
          showConfirmButton: false,
          timer: 3000
        })
      }
    });
  }

}
