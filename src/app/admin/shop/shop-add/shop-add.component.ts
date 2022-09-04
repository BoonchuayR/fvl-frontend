import { Component, OnInit } from "@angular/core";
import {
  FormArrayName,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ShopService } from "src/app/service/shop.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-shop-add",
  templateUrl: "./shop-add.component.html",
  styleUrls: ["./shop-add.component.scss"],
})
export class ShopAddComponent implements OnInit {
  // Form submition
  submit!: boolean;
  validationform!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    this.validationform = this.formBuilder.group({
      boothCode: ["", [Validators.required]],
      contractNo: ["", [Validators.required]],
      custName: ["", [Validators.required]],
      boothName: ["", [Validators.required]],
      boothZone: ["", [Validators.required]],
      boothCateg: ["", [Validators.required]],
      contractDate: ["", [Validators.required]],
      contractEndDate: ["", [Validators.required]],
    });
  }

  formSubmit() {
    console.log(this.validationform.value);
    this.shopService.create(this.validationform.value).then((shop) => {
      console.log("shop");
    });
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "เพิ่มข้อมูลร้านค้าเรียบร้อย",
      showConfirmButton: false,
      timer: 3000,
    }).catch((error) => {
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
