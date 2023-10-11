import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { CustomerService } from "src/app/service/customer.service";
import { ShopService } from "src/app/service/shop.service";
import {
  Select2,
  Select2Data,
  Select2UpdateEvent,
  Select2UpdateValue,
  Select2Value,
} from "ng-select2-component";
import { ActivatedRoute, Router } from "@angular/router";
import { MeterService } from "src/app/service/meter.service";
import { Meter } from "src/app/core/models/meter.model";
import { Shop } from "src/app/core/models/shop.models";
import { Customer } from "src/app/core/models/customer.models";
import { take } from "rxjs/operators";
import { pipe } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-customer-edit",
  templateUrl: "./customer-edit.component.html",
  styleUrls: ["./customer-edit.component.scss"],
})
export class CustomerEditComponent implements OnInit {
  [x: string]: any;
  uId: any;
  customer: any;
  displayBoothId: any = [];
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
  public loading = false;
  public itemShopForm: FormGroup;
  public item_collapsed: Array<any> = [];
  public keyActionItemCard: number = 0;

  bootIdError: boolean = true;
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
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.itemShopForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.uId = this.route.snapshot.paramMap.get("id");

    // Set customer
    this.customerService
      .get(this.uId)
      .pipe(take(1))
      .subscribe((cust) => {
        this.customer = cust;
        this.setCustomerForm();

        // Set boothOptions
        this.meterService.getAllMeters().then((meters: Meter[]) => {
          this.meters = meters.filter((meter: Meter) => {
            if (meter.custName && meter.custName !== cust.custName) {
              return false;
            } else {
              if (meter.custName && meter.custName === cust.custName) {
                // this.displayBoothId = meter.boothId;
                this.displayBoothId.push(meter.boothId);
                console.log(this.displayBoothId);
              }
              return true;
            }
          });
          this.createBoothOptions();

          // Set shops
          this.shopService
            .findByUID(this.uId)
            .pipe(take(1))
            .subscribe((shops) => {
              this.shops = shops;
              this.setShopForms();
            });
        });
      });
  }

  formSubmit() {
    // this.spinner.show();

    const customer = { uid: this.customer.uid, ...this.validationform.value };
    this.checkDistinctBootId();
    if (this.bootIdError) {
      return;
    } else if (this.bootIdError === false) {
      this.customerService
        .update(customer)
        .then((res) => {
          const shopItems: FormArray = this.itemShopForm.get(
            "items"
          ) as FormArray;
          var data = [];
          for (let i = 0; i < shopItems.value.length; i++) {
            if (shopItems.value[i].boothIds.length == 0) {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "กรุณาระบุรหัสแผงค้า",
                showConfirmButton: true,
              });
              this.loading = false;
              break;
            }
            if (shopItems.value[i].boothIds != 0) {
              data.push(shopItems.value[i].boothIds);
            }
          }
          if (data.length == shopItems.value.length) {
            shopItems.value.forEach((shop: any) => {
              // console.log("shop => ", shop);
              this.shopService
                .findByUID(shop.uid)
                .pipe(take(1))
                .subscribe((respo) => {
                  const data = respo;
                  // console.log("data --->> : ",data)
                  if (data.length > 0) {
                    this.shopService
                      .update(shop)
                      .then((res) => {
                        // Update meter
                        // Set custname and shopname to meter
                        shop.boothIds.forEach((bootId: string) => {
                          this.meterService
                            .findMeterByBooothId(bootId)
                            .subscribe((meters: Meter[]) => {
                              meters.forEach((meter: Meter) => {
                                meter.custName = customer.custName;
                                meter.shopName = shop.boothName;
                                this.meterService.update(meter).then(() => {});
                              });
                            });
                        });
                      })
                      .catch((err) => {
                        console.log("err: ", err);
                      });
                  }
                  if (data.length == 0) {
                    this.shopService
                      .create({
                        ...shop,
                        uid: customer.uid,
                        custName: customer.custName,
                        custPhone: customer.custPhone,
                      })
                      .then(() => {
                        // Set custname and shopname to meter
                        shop.boothIds.forEach((bootId: string) => {
                          this.meterService
                            .findMeterByBooothId(bootId)
                            .pipe(take(1))
                            .subscribe((meters: Meter[]) => {
                              meters.forEach((meter: Meter) => {
                                meter.custName = customer.custName;
                                meter.shopName = shop.boothName;
                                meter.uid = customer.uid;
                                this.meterService.update(meter).then(() => {});
                              });
                            });
                        });
                      });
                  }
                });
            });

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "แก้ไขข้อมูลลูกค้าเรียบร้อย",
              showConfirmButton: false,
              timer: 3000,
            });
            // this.spinner.hide();
            this.loading = false;
            this.router.navigate(["/customer-list"]);
          }
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    }
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
        // for (let i = 0; i < this.displayBoothId.length; i++) {
        //   if (meter.boothId === this.displayBoothId[i]) {
        //     return {
        //       value: meter.boothId,
        //       label: meter.boothId,
        //       data: { name: meter.boothId },
        //       templateId: "template1",
        //       id: meter.boothId,
        //       disabled: true,
        //     };
        //   }
        // }
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

  update(event: any) {
    console.log("get event >> ", event.value);
    // for(let i = 0; i < this.displayBoothId.length;i++){
    //   for(let j = 0; j < event.value.length;i++){
    //     if(this.displayBoothId[i] === event.value[j]){
    //       console.log("check",this.displayBoothId[i])
    //     }
    //   }
    // }
  }

  togetorBootId() {
    const shopItems: FormArray = this.itemShopForm.get("items") as FormArray;
    var flags2 = [],
      output1 = [],
      l = shopItems.value.length,
      i,
      j: number;
    for (i = 0; i < l; i++) {
      for (j = 0; j < shopItems.value[i].boothIds.length; j++) {
        output1.push([shopItems.value[i].boothIds[j]]);
      }
    }
    return output1;
  }

  checkDistinctBootId() {
    var flags: any[] = [],
      output2 = [],
      i;
    var arrayOfBootId: any = this.togetorBootId();
    for (i = 0; i < arrayOfBootId.length; i++) {
      if (flags[arrayOfBootId[i]]) continue;
      flags[arrayOfBootId[i]] = true;
      output2.push(arrayOfBootId[i]);
      // console.log("flags", flags);
      // console.log("output2", output2);
    }
    // console.log("arrayOfBootId", arrayOfBootId);
    if (arrayOfBootId.length > output2.length) {
      Swal.fire("แจ้งเตือน!", "คุณกรอกรหัสแผงร้านค้าซ้ำกัน!", "warning").then(
        (result) => {
          // this.loading = false;
          if (result.isConfirmed) {
            // window.location.reload();
          }
        }
      );
      this.bootIdError = true;
    }
    if (arrayOfBootId.length == output2.length) {
      this.bootIdError = false;
      this.loading = true;
    }
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
