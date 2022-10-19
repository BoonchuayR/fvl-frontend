import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormArrayName,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
import { CustomerService } from "src/app/service/customer.service";
import { ShopService } from "src/app/service/shop.service";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-customer-add",
  templateUrl: "./customer-add.component.html",
  styleUrls: ["./customer-add.component.scss"],
})
export class CustomerAddComponent implements OnInit {
  submit!: boolean;
  validationform!: FormGroup;
  public itemShopForm: FormGroup;
  public item_collapsed: Array<any> = [];
  public keyActionItemCard: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private shopService: ShopService
  ) {
    this.itemShopForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.validationform = this.formBuilder.group({
      custCode: ["", [Validators.required]],
      custName: ["", [Validators.required]],
      custEmail: ["", [Validators.required]],
      custPhone: ["", [Validators.required]],
      custMoney: ["", [Validators.required]],
      custPwd: ["", [Validators.required]],
      custStartDate: ["", [Validators.required]],
      firstMoney: ["", [Validators.required]],
    });

    this.addItem();
  }

  formSubmit() {
    console.log(this.validationform.value);
    this.customerService.create(this.validationform.value).then((customers) => {
      console.log("customers");
    });

    this.shopService.create(this.itemShopForm.value).then((shop) => {
      console.log("shop")
    });
    
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "เพิ่มข้อมูลลูกค้าเรียบร้อย",
      showConfirmButton: false,
      timer: 3000,
    }).catch((error) => {
      console.log(error);
    });
  }
  validSubmit() {
    this.submit = true;
  }

  formShopMessage(isNew: boolean, key?: number) {
    const control = <FormArray>this.itemShopForm.controls["items"];
    if (control.controls.length < 20) {
      control.push(this.createItem());
      this.item_collapsed.push(true);
      // this.buildFormContents();
    }
  }

  createItem(item: any = {}) {
    return this.formBuilder.group({
      boothCode: ["", [Validators.required]],
      contractNo: ["", [Validators.required]],
      custName: ["", [Validators.required]],
      boothName: ["", [Validators.required]],
      boothZone: ["", [Validators.required]],
      boothCate: ["", [Validators.required]],
      contractDate: ["", [Validators.required]],
      contractEndDate: ["", [Validators.required]],
      SLAVE_ID: ["", [Validators.required]],
    });
  }

  getItemShopForm(): FormArray {
    return this.itemShopForm.get("items") as FormArray;
  }

  onclickItem(index: any) {
    this.keyActionItemCard = index;
  }

  checkCountItemDisabledButton() {
    const control = this.getItemShopForm();
    return control.controls.length <= 1 ? true : false;
  }

  sortItemCardMessage(slip_type: string = "up") {
    const control = this.getItemShopForm();
    if (slip_type == "up") {
      this.move(-1, 0, control);
    } else if (slip_type == "down") {
      this.move(1, control.length - 1, control);
    }
  }

  move(shift: any, currentIndex: any, control: FormArray) {
    let newIndex: number = currentIndex + shift;
    if (newIndex === -1) {
      newIndex = control.length - 1;
    } else if (newIndex == control.length) {
      newIndex = 0;
    }

    const currentGroup = control.at(currentIndex);
    control.removeAt(currentIndex);
    control.insert(newIndex, currentGroup);
  }

  removeformCardMessage(index?: any) {
    const itemProduct: FormArray = this.itemShopForm.get("items") as FormArray;
    index = itemProduct.length - 1;
    if (itemProduct.length === 1) return;
    if (itemProduct.length == this.keyActionItemCard + 1) {
      this.keyActionItemCard = 0;
    }
    this.item_collapsed.splice(index, 1);
    itemProduct.removeAt(index);
  }

  addItem() {
    const control = <FormArray>this.itemShopForm.controls["items"];
    control.push(this.createItem());
    this.item_collapsed.push(true);
  }

  getValueItemShopForm(index: any, field: string) {
    const control = this.getItemShopForm();
    return control.at(index).get(field)?.value;
  }

  countlengthWord(index: any, field: string) {
    let count = 0;
    let value = this.getValueItemShopForm(index, field);
    count = value ? value.length : 0;
    return count;
  }

  // buildFormContents() {
  //   const control = <FormArray>this.itemShopForm.controls["items"];
  //   let contetns_key = 1;
  //   if (this.qna.cardMessageTemplate == "C2") contetns_key = 2;
  //   let contacs_array = Array.from(new Array(contetns_key), (x, i) => i + 1);
  //   control.controls.forEach(async (i, k) => {
  //     let content = i.get("contents") as FormArray;
  //     //remove all
  //     if (content.controls.length != contetns_key) {
  //       content.clear();
  //     }

  //     //new push
  //     if (content.controls.length != contetns_key) {
  //       await Promise.all(
  //         contacs_array.map((e) => {
  //           content.push(this.createItemContent());
  //           return e;
  //         })
  //       );
  //     }

  //     //reset validation
  //     if (this.qna.cardMessageTemplate == "C3") {
  //       let field = [
  //         {
  //           slug: "title",
  //           type: "clear",
  //           reset: true,
  //         },
  //         {
  //           slug: "desc",
  //           type: "clear",
  //           reset: true,
  //         },
  //       ];
  //       this.upsertValidate(field, i as FormArray);
  //     } else {
  //       let field = [
  //         {
  //           slug: "title",
  //           type: "add",
  //           reset: false,
  //         },
  //         {
  //           slug: "desc",
  //           type: "add",
  //           reset: false,
  //         },
  //       ];
  //       this.upsertValidate(field, i as FormArray);
  //     }
  //   });
  // }
}
