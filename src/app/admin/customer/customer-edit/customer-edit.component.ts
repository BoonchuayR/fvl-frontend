import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
import { CustomerService } from "src/app/service/customer.service";
import { ShopService } from "src/app/service/shop.service";
import { Select2Data, Select2Value } from "ng-select2-component";
import { ActivatedRoute, Router } from "@angular/router";
import { MeterService } from "src/app/service/meter.service";
import { Meter } from "src/app/core/models/meter.model";
import { Shop } from "src/app/core/models/shop.models";
import { Customer } from "src/app/core/models/customer.models";

@Component({
  selector: "app-customer-edit",
  templateUrl: "./customer-edit.component.html",
  styleUrls: ["./customer-edit.component.scss"],
})
export class CustomerEditComponent implements OnInit {
  [x: string]: any;
  uId: any;
  customer: any;
  shops: any;
  submit!: boolean;
  validationform = this.formBuilder.group({
    email: ["", [Validators.required]],
    password: ["", Validators.required],
    custCode: ["", [Validators.required]],
    custName: ["", [Validators.required]],
    custPhone: ["", [Validators.required]],
    custStartDate: ["", [Validators.required]],
    minimumMoney: ["", [Validators.required]],
    currentMoney: ["", [Validators.required]],
  });

  public itemShopForm: FormGroup;
  public item_collapsed: Array<any> = [];
  public keyActionItemCard: number = 0;

  meters: Meter[] = [];
  boothOptions: any = [];
  meterOptions: Select2Data = [];
  shopOptions: Select2Data = [];

  // select multi options End
  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private shopService: ShopService,
    private meterService: MeterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.itemShopForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    
    this.uId = this.route.snapshot.paramMap.get("id");

    // Set customer
    this.customerService.get(this.uId).subscribe((cust) => {
      this.customer = cust;
      this.setCustomerForm();
      
      // Set boothOptions
      this.meterService.getAllMeters().then((meters: Meter[]) => {
        this.meters = meters.filter((meter: Meter) => {
          if (meter.custName && meter.custName !== cust.custName) {
            return false;
          } else {
            return true;
          }
        });
        this.createBoothOptions();

        // Set shops
        this.shopService.findByUID(this.uId).subscribe(shops => {
          this.shops = shops;
          this.setShopForms();
        });
      });
    });

    
  }

  formSubmit() {
    const customer = { uid: this.customer.uid, ...this.validationform.value };

    this.customerService
      .update(customer)
      .then((res) => {
        const shopItems: FormArray = this.itemShopForm.get(
          "items"
        ) as FormArray;
        shopItems.value.forEach((shop: any) => {
          console.log("shop => ", shop);
          this.shopService
            .update(shop)
            .then((res) => {
              // Update meter
              // Set custname and shopname to meter
              shop.boothIds.forEach((bootId: string) => {
                this.meterService.findMeterByBooothId(bootId).subscribe((meters: Meter[]) => {
                    meters.forEach((meter: Meter) => {
                      meter.custName = customer.custName;
                      meter.shopName = shop.boothName;
                      this.meterService.update(meter).then(() => {});
                    })
                })
              });
            })
            .catch((err) => {
              console.log("err: ", err);
            });
        });

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "แก้ไขข้อมูลลูกค้าเรียบร้อย",
          showConfirmButton: false,
          timer: 3000,
        });

        this.router.navigate(["/customer-list"]);

      })
      .catch((err) => {
        console.log("err: ", err);
      });
  }

  createBoothOptions() {
    const sortedMeters = this.meters.sort((meterA: Meter, meterB: Meter) => {
      if (meterA.boothId > meterB.boothId) {
        return 1;
      }
      return -1;
    });

    const data = {
      label: "",
      data: { name: "" },
      options: sortedMeters.map((meter: Meter) => {
        return {
          value: meter.boothId,
          label: meter.boothId,
          data: { name: meter.boothId },
          templateId: "template1",
          id: meter.boothId,
        };
      }),
    };

    this.shopOptions.push(data);
  }

  setCustomerForm() {
    this.custCode?.setValue(this.customer.custCode);
    this.custName?.setValue(this.customer.custName);
    this.email?.setValue(this.customer.email);
    // this.password?.setValue(this.customer.password);
    this.custPhone?.setValue(this.customer.custPhone);
    this.custStartDate?.setValue(this.customer.custStartDate);
    this.minimumMoney?.setValue(this.customer.minimumMoney);
  }

  setShopForms() {
    const control = <FormArray>this.itemShopForm.controls["items"];
    this.shops.forEach((shop: any) => {
      if (control.controls.length < 20) {
        const shopForm = this.createItem();
        shopForm.get("id")?.setValue(shop.id);
        shopForm.get("uid")?.setValue(shop.uid);
        shopForm.get("boothCode")?.setValue(shop.boothCode);
        shopForm.get("boothCate")?.setValue(shop.boothCate);
        shopForm.get("boothName")?.setValue(shop.boothName);
        shopForm.get("boothZone")?.setValue(shop.boothZone);
        shopForm.get("contractDate")?.setValue(shop.contractDate);
        shopForm.get("contractEndDate")?.setValue(shop.contractEndDate);
        shopForm.get("contractNo")?.setValue(shop.contractNo);
        shopForm.get("custName")?.setValue(shop.custName);
        shopForm.get("boothIds")?.setValue(shop.boothIds);
        // shopForm.get("boothIds")?.disable();
        control.push(shopForm);
        this.item_collapsed.push(true);
        // this.buildFormContents();
      }
    });
  }

  get email() {
    return this.validationform.get("email");
  }

  get password() {
    return this.validationform.get("password");
  }

  get custCode() {
    return this.validationform.get("custCode");
  }

  get custName() {
    return this.validationform.get("custName");
  }

  get custPhone() {
    return this.validationform.get("custPhone");
  }

  get custStartDate() {
    return this.validationform.get("custStartDate");
  }

  get minimumMoney() {
    return this.validationform.get("minimumMoney");
  }

  validSubmit() {
    this.submit = true;
  }

  formShopMessage(isNew: boolean, key?: number) {
    const control = <FormArray>this.itemShopForm.controls["items"];
    if (control.controls.length < 20) {
      control.push(this.createItem());
      this.item_collapsed.push(true);
    }
  }

  createItem(item: any = {}) {
    return this.formBuilder.group({
      id: ["", [Validators.required]],
      uid: ["", [Validators.required]],
      boothCode: ["", [Validators.required]],
      contractNo: ["", [Validators.required]],
      custName: ["", [Validators.required]],
      boothName: ["", [Validators.required]],
      boothZone: ["", [Validators.required]],
      boothCate: ["", [Validators.required]],
      contractDate: ["", [Validators.required]],
      contractEndDate: ["", [Validators.required]],
      boothIds: ["", [Validators.required]],
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

  addShopCardItem() {
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
}
