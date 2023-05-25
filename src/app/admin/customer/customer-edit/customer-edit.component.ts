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
  uId: any;
  customer: any;
  shops: any;
  submit!: boolean;
  validationform = this.formBuilder.group({
    email: ["", [Validators.required]],
    // password: ["", Validators.required],
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
  datalist1:any=[];
  datalist2:any=[];
  codedata:any=[];
  meters: any = [];
  meterOptions: Select2Data = [];
  shopOptions: Select2Data = [];
  // select multi options start
  data: Select2Data = [
    {
      label: "Meter Zone A",
      data: { name: "Meter Zone A" },
      options: [
        {
          value: "A001",
          label: "A001",
          data: { name: "A001" },
          templateId: "template1",
          id: "option-A001",
        },
        {
          value: "A002",
          label: "A002",
          data: { name: "A002" },
          templateId: "template2",
          id: "option-A002",
        },
      ],
    },
    {
      label: "Meter Zone B",
      data: { name: "Meter Zone B" },
      options: [
        {
          value: "B001",
          label: "B001",
          data: { name: "B001" },
          templateId: "template1",
          id: "option-B001",
        },
        {
          value: "B002",
          label: "B002",
          data: { name: "B002" },
          templateId: "template2",
          id: "option-B002",
        },
        {
          value: "B003",
          label: "B003",
          data: { name: "B003" },
          templateId: "template3",
          id: "option-B003",
        },
        {
          value: "B004",
          label: "B004",
          data: { name: "B004" },
          templateId: "template4",
          id: "option-B004",
        },
      ],
    },
  ];

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

    this.customerService.getCode().subscribe((code)=>{
      this.codedata = code;
      
      // console.log("Code >>> ", this.codedata);
      this.codedata = this.codedata.sort((a: { code: number; },b: { code: number; })=>{
        if(a.code < b.code){
          return -1
        }
        return 1
      });
    })
    this.shopService.getAll().subscribe((shop)=>{
      this.datalist1 = shop
      // console.log("dataShop",this.datalist1);
      this.datalist1.forEach((data:any) => {
        this.codedata.forEach((code:any)=>{
          if(data.storeId[0]==code.code){
            this.datalist2 = [];
            this.datalist2.push(code);
            console.log("datalist2",this.datalist2);
            this.createShopOptions();
         }
        
        })
      });
    
    });
    this.uId = this.route.snapshot.paramMap.get("id");

    // Get meters
    this.meterService.getAll().subscribe((meters) => {
      this.meters = meters;
      this.createMeterOptions();
    });
    
    this.customerService.get(this.uId).subscribe((cust) => {
      this.customer = cust;
      this.setCustomerForm();
      this.setShopForms();
    });

    this.addItem();
  }

  createMeterOptions() {
    const sortedMeters = this.meters.sort((a: any, b: any) => {
      if (a.deviceZone < b.deviceZone) {
        return -1;
      } else {
        return 1;
      }
    }).filter((m:any) => {
      if (m.deviceId) {
        return true;
      }
      return false
    });

    for (let i = 0; i < sortedMeters.length; i++) {
      if (
        sortedMeters[i + 1] &&
        sortedMeters[i].deviceZone === sortedMeters[i + 1].deviceZone
      ) {
        continue;
      }
      const data = {
        label: "โซน " + sortedMeters[i].deviceZone,
        data: { name: sortedMeters[i].deviceZone },
        options: sortedMeters
          .filter((m: any) => {
            return m.deviceZone === sortedMeters[i].deviceZone;
          })
          .map((m: any) => {
            return {
              value: m.deviceId,
              label: m.deviceId,
              data: { name: m.deviceId },
              templateId: "template1",
              id: m.deviceId,
            };
          }),
      };
      this.meterOptions.push(data);
      // console.log("meterOptions" , data)
    }
  }
  createShopOptions() {
    const sortedShop = this.datalist2.sort((a: any, b: any) => {
      console.log(this.datalist2);
      if (a.code < b.code) {
        return -1;
      } else {
        return 1;
      }
    }).filter((m:any) => {
      if (m.code) {
        return true;
      }
      return false
    });
    for (let i = 0; i < sortedShop.length; i++) {
      if (
        sortedShop[i + 1] &&
        sortedShop[i].code === sortedShop[i + 1].code
      ) {
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
    this.shopService.getAll().subscribe((shops) => {
      const control = <FormArray>this.itemShopForm.controls["items"];
      control.removeAt(0);
      
      this.shops = shops
        .filter((shop) => {
          return shop.uid === this.uId;
        });
      
      this.shops.forEach((shop:any) => {
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
          shopForm.get("storeId")?.setValue(shop.storeId);
          control.push(shopForm);
          this.item_collapsed.push(true);
          // this.buildFormContents();
        }
      });
    });
  }

  get email() {
    return this.validationform.get("email");
  }
  // get password() {
  //   return this.validationform.get("password");
  // }
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
    const customer = {uid: this.customer.uid, ...this.validationform.value};

    this.customerService.update(customer).then(res => {
      const shopItems: FormArray = this.itemShopForm.get(
        "items"
      ) as FormArray;
      shopItems.value.forEach((shop: any) => {
        this.shopService.update(shop).then(res => {
          
        }).catch(err => {
          console.log("err: ", err)
        });
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "แก้ไขข้อมูลลูกค้าเรียบร้อย",
        showConfirmButton: false,
        timer: 3000,
      });

    }).catch(err => {
      console.log("err: ", err)
    })
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
      // this.buildFormContents();
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
      storeId: ["", [Validators.required]],
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
