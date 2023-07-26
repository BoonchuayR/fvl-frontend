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
import { Select2Data } from "ng-select2-component";
import { AuthService } from "src/app/service/auth.service";
import { switchMap } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { MeterService } from "src/app/service/meter.service";

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
  oldBoothId:any="";
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
  datalist1: any = [];
  datalist2: any = [];
  codedata: any = [];
  meters: any = [];
  boothOptions: any = [];
  meterOptions: Select2Data = [];
  shopOptions: Select2Data = [];
  // select multi options start
  data: Select2Data = [];

  // select multi options End

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private customerService: CustomerService,
    private shopService: ShopService,
    private meterService: MeterService,
    private route: ActivatedRoute
  ) {
    this.itemShopForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.customerService.getCode().subscribe((code) => {
      this.codedata = code;

      // console.log("Code >>> ", this.codedata);
      this.codedata = this.codedata.sort(
        (a: { code: number }, b: { code: number }) => {
          if (a.code < b.code) {
            return -1;
          }
          return 1;
        }
      );
    });
    this.shopService.getAll().subscribe((shop) => {
      this.datalist1 = shop;
      // console.log("dataShop",this.datalist1);
      this.datalist1.forEach((data: any) => {
        this.codedata.forEach((code: any) => {
          if (data.boothIds[0] == code.code) {
            this.datalist2 = [];
            this.datalist2.push(code);
            // console.log("datalist2",this.datalist2);
            this.createShopOptions();
          }
        });
      });
    });
    this.uId = this.route.snapshot.paramMap.get("id");

    // Get meters
    this.meterService.getAll().subscribe((meters) => {
      this.meters = meters;

      meters.forEach((meter) => this.boothOptions.push(meter.boothId));

      const boothIds: string[] = [];

      this.shopService.getAll().subscribe((shops) => {
        shops.forEach((shop) => {
          boothIds.push(...shop.boothIds);
        });

        this.boothOptions = this.boothOptions.filter((option: string) => {
          return !boothIds.includes(option);
        });
        // console.log(this.boothOptions);
        // this.createBoothOptions();
        const control = <FormArray>this.itemShopForm.controls["items"];
        control.removeAt(0);

        this.shops = shops.filter((shop) => {
          return shop.uid === this.uId;
        });
        this.shops.forEach((bId:any)=>{
          this.oldBoothId = bId.boothIds;
          this.boothOptions.push(this.oldBoothId.toString());
        })
        
        // console.log(this.boothOptions);
        this.createBoothOptions();
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
            control.push(shopForm);
            this.item_collapsed.push(true);
            // this.buildFormContents();
          }
        });
      });
    });

    this.customerService.get(this.uId).subscribe((cust) => {
      this.customer = cust;
      this.setCustomerForm();
      this.setShopForms();
    });

    this.addItem();
  }
  createBoothOptions() {
    const sortedShop = this.boothOptions.sort((a: string, b: string) => {
      if (a > b) {
        return 1;
      }
      return -1;
    });

    const data = {
      label: "",
      data: { name: "" },
      options: sortedShop.map((m: any) => {
        return {
          value: m,
          label: m,
          data: { name: m },
          templateId: "template1",
          id: m,
        };
      }),
    };

    this.shopOptions.push(data);
  }
  createBoothId() {
    const sortedShop = this.boothOptions.sort((a: string, b: string) => {
      if (a > b) {
        return 1;
      }
      return -1;
    });

    const data = {
      label: "",
      data: { name: "" },
      options: sortedShop.map((m: any) => {
        return {
          value: m,
          label: m,
          data: { name: m },
          templateId: "template1",
          id: m,
        };
      }),
    };

    this.shopOptions.push(data);
  }
  createShopOptions() {
    const sortedShop = this.datalist2
      .sort((a: any, b: any) => {
        console.log(this.datalist2);
        if (a.code < b.code) {
          return -1;
        } else {
          return 1;
        }
      })
      .filter((m: any) => {
        if (m.code) {
          return true;
        }
        return false;
      });
    for (let i = 0; i < sortedShop.length; i++) {
      if (sortedShop[i + 1] && sortedShop[i].code === sortedShop[i + 1].code) {
        continue;
      }
      const data = {
        label: "",
        data: { name: sortedShop[i].code },
        options: sortedShop
          .filter((m: any) => {
            return m.code === sortedShop[i].code;
          })
          .map((m: any) => {
            return {
              value: m.code,
              label: m.code,
              data: { name: m.code },
              templateId: "template1",
              id: m.code,
              // hide: true
              // disabled:true
            };
          }),
      };
      this.shopOptions.push(data);
      // console.log("shopOptions" , data)
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
    // this.shopService.getAll().subscribe((shops) => {
    //   const control = <FormArray>this.itemShopForm.controls["items"];
    //   control.removeAt(0);
    //   this.shops = shops
    //     .filter((shop) => {
    //       return shop.uid === this.uId;
    //     });
    //   this.shops.forEach((shop:any) => {
    //     if (control.controls.length < 20) {
    //       const shopForm = this.createItem();
    //       shopForm.get("id")?.setValue(shop.id);
    //       shopForm.get("uid")?.setValue(shop.uid);
    //       shopForm.get("boothCode")?.setValue(shop.boothCode);
    //       shopForm.get("boothCate")?.setValue(shop.boothCate);
    //       shopForm.get("boothName")?.setValue(shop.boothName);
    //       shopForm.get("boothZone")?.setValue(shop.boothZone);
    //       shopForm.get("contractDate")?.setValue(shop.contractDate);
    //       shopForm.get("contractEndDate")?.setValue(shop.contractEndDate);
    //       shopForm.get("contractNo")?.setValue(shop.contractNo);
    //       shopForm.get("custName")?.setValue(shop.custName);
    //       shopForm.get("boothIds")?.setValue(shop.boothIds);
    //       control.push(shopForm);
    //       this.item_collapsed.push(true);
    //       // this.buildFormContents();
    //     }
    //   });
    // });
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
            .then((res) => {})
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
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  }

  addShops() {
    throw new Error("Method not implemented.");
  }

  addCustomer(customer: any) {
    return this.customerService.addCustomer(customer);
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
}
