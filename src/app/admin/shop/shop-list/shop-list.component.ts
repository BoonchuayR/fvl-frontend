import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/service/shop.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {  
  shops!: any

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.shopService.getAll().subscribe(shops => {
      this.shops = shops;
      console.log("shops");
    })
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
      console.log(id)
      if (result.value) {
        this.shopService.delete(id).then(deletedShop => {console.log(deletedShop);
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
