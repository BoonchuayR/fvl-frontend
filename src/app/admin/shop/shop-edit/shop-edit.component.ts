import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from 'src/app/service/shop.service';

@Component({
  selector: 'app-shop-edit',
  templateUrl: './shop-edit.component.html',
  styleUrls: ['./shop-edit.component.scss']
})
export class ShopEditComponent implements OnInit {
  shopId!:string

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.shopId = this.route.snapshot.paramMap.get("id")!;
  };
  

}
