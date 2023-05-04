import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators,} from "@angular/forms";
import { ShopService } from "src/app/service/shop.service";
// import { isThisTypeNode } from "typescript";
import Swal from "sweetalert2";
@Component({
  selector: "app-shop-edit",
  templateUrl: "./shop-edit.component.html",
  styleUrls: ["./shop-edit.component.scss"],
})
export class ShopEditComponent implements OnInit {
  shopId!: string;
  submit!: boolean;
  editform = new FormGroup({
    id: new FormControl(""),
    BoothCode: new FormControl(""),
    ContractNo: new FormControl(""),
    CustName: new FormControl(""),
    BoothName: new FormControl(""),
    BoothZone: new FormControl(""),
    BoothCateg: new FormControl(""),
    ContractDate: new FormControl(""),
    ContractEndDate: new FormControl(""),
  });

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    // this.updateshopData(),
    this.shopId = this.route.snapshot.params["id"];
    this.shopService.get(this.shopId).subscribe((data) => {

      this.editform.setValue(data);
    });
  }

  updateshopData() {
    this.editform = this.formBuilder.group({
      id: [""],
      BoothCode: [""],
      ContractNo: [""],
      CustName: [""],
      BoothName: [""],
      BoothZone: [""],
      BoothCateg: [""],
      ContractDate: [""],
      ContractEndDate: [""],
    });
  }

  formSubmit() {
    this.shopService.update(this.editform.value)
      .then((shop) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'แก้ไขข้อมูลร้านค้าเรียบร้อย',
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
