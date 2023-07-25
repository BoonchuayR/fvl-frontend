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
import { Select2Data, Select2Value } from "ng-select2-component";
import { AuthService } from "src/app/service/auth.service";
import { switchMap } from "rxjs/operators";
import { Router } from "@angular/router";
import { MeterService } from "src/app/service/meter.service";

@Component({
  selector: "app-customer-add",
  templateUrl: "./customer-add.component.html",
  styleUrls: ["./customer-add.component.scss"],
})
export class CustomerAddComponent implements OnInit {
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
  shops: any = [];
  codedata: any = [];
  shop: any = [];
  cust: any = [];
  datalist1: any = [];
  datalist2: any = [];
  state: any;
  meters: any = [];
  boothOptions: any = [];
  meterOptions: Select2Data = [];
  shopOptions: Select2Data = [];
  Values:Select2Value = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private customerService: CustomerService,
    private shopService: ShopService,
    private meterService: MeterService,
    private router: Router
  ) {
    this.itemShopForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
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

        this.createBoothOptions();
      });
      
    });

    this.validationform.get("email")?.setValue("");

    this.addItem();
  }

  checkboothcode(even: any) {
    this.shopService.findByBoothCode("fvl023").subscribe((a) => {});
  }

  update(even:any){
   
    console.log(even.value);
    // this.shopService.create(even.value);
    // this.shopService.add();
  }

  createMeterOptions() {
    const sortedMeters = this.meters
      .sort((a: any, b: any) => {
        if (a.boothId < b.boothId) {
          return -1;
        } else {
          return 1;
        }
      })
      .filter((m: any) => {
        if (m.boothId) {
          return true;
        }
        return false;
      });

    for (let i = 0; i < sortedMeters.length; i++) {
      if (
        sortedMeters[i + 1] &&
        sortedMeters[i].deviceZone === sortedMeters[i + 1].deviceZone
      ) {
        continue;
      }

      const data = {
        label: "",
        data: { name: sortedMeters[i].deviceZone },
        options: sortedMeters
          .filter((m: any) => {
            return m.deviceZone === sortedMeters[i].deviceZone;
          })
          .map((m: any) => {
            return {
              value: m.boothId,
              label: m.boothId,
              data: { name: m.deviceZone },
              templateId: "template1",
              id: m.boothId,
            };
          }),
      };
      this.meterOptions.push(data);
    }
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
    console.log(this.Values)
    this.shopOptions.push(data);
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

  get boothName() {
    return this.validationform.get("boothName");
  }
  get contractNo() {
    return this.validationform.get("contractNo");
  }
  get boothZone() {
    return this.validationform.get("boothZone");
  }
  get boothCate() {
    return this.validationform.get("boothCate");
  }
  get contractDate() {
    return this.validationform.get("contractDate");
  }
  get contractEndDate() {
    return this.validationform.get("contractEndDate");
  }
  get boothIds() {
    return this.validationform.get(["boothIds"]);
  }
  formSubmit() {
    // Add customer
    const {
      email,
      password,
      custCode,
      custName,
      custPhone,
      custStartDate,
      minimumMoney,
      boothName,
      contractNo,
      boothZone,
      boothCate,
      contractDate,
      contractEndDate,
      boothIds,
    } = this.validationform.value;

    this.authService.register(email, password).subscribe(
      (creden) => {
        
        const customer = {
          uid: creden.user.uid,
          email: creden.user.email,
          custCode: custCode,
          custName: custName,
          custPhone: custPhone,
          custStartDate: custStartDate,
          minimumMoney: minimumMoney,
          currentMoney: 0,
        };
        console.log(creden);
        // Add customer
        this.addCustomer(customer).subscribe((cust) => {
          // Add shops
          const shopItems: FormArray = this.itemShopForm.get(
            "items"
          ) as FormArray;
          shopItems.value.forEach((shop: any) => {
            this.shopService
              .create({
                ...shop,
                uid: customer.uid
              })
              .then((res) => {
                this.router.navigate(["/customer-list"]);
              });
          });
        });
      },
      (error) => {
        console.log("error: ", error);
      }
    );
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "เพิ่มข้อมูลลูกค้าเรียบร้อย",
      showConfirmButton: false,
      timer: 3000,
    });
  }
  /**
   * Confirm sweet alert
   * @param confirm modal content
   */
  confirm() {
    Swal.fire({
      title: "ลบข้อมูลลูกค้า",
      text: "คุณต้องการลบลูกค้านี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "ใช่, ต้องการ!",
      cancelButtonText: "ไม่, ยกเลิก!",
    }).then((result) => {
      if (result.isConfirmed) {
        // this.customerService.delete(id).then(deletedcustomer => {

        // })
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "ลบข้อมูลลูกค้าเรียบร้อย",
          showConfirmButton: false,
          timer: 3000,
        });
      }
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
    Swal.fire({
      title: "ลบข้อมูลร้านค้า",
      text: "คุณต้องการลบร้านค้านี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "ใช่, ต้องการ!",
      cancelButtonText: "ไม่, ยกเลิก!",
    }).then((result) => {
      if (result.isConfirmed) {
        // this.customerService.delete(id).then(deletedcustomer => {

        // })
        const itemProduct: FormArray = this.itemShopForm.get(
          "items"
        ) as FormArray;
        index = itemProduct.length - 1;
        if (itemProduct.length === 1) return;
        if (itemProduct.length == this.keyActionItemCard + 1) {
          this.keyActionItemCard = 0;
        }
        this.item_collapsed.splice(index, 1);
        itemProduct.removeAt(index);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "ลบข้อมูลร้านค้าเรียบร้อย",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    });
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
