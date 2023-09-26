import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { CustomerService } from "src/app/service/customer.service";
import { ShopService } from "src/app/service/shop.service";
import { Select2Data, Select2Value } from "ng-select2-component";
import { Router } from "@angular/router";
import { MeterService } from "src/app/service/meter.service";
import { UserProfileService } from "src/app/core/services/user.service";
import { User } from "src/app/core/models/user.models";
import { Meter } from "src/app/core/models/meter.model";
import { Shop } from "src/app/core/models/shop.models";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UnsubscriptionError } from "rxjs";

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
  state: any;
  meters: Meter[] = [];
  boothOptions: Select2Data = [];
  boothValues: Select2Value = "";
  bootIdError: boolean = true;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private shopService: ShopService,
    private meterService: MeterService,
    private userProfileService: UserProfileService,
    private router: Router
  ) {
    this.itemShopForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.meterService.getAllMeters().then((allMeters: Meter[]) => {
      this.meters = allMeters.filter((m) => {
        if (m.custName) {
          return false;
        } else {
          return true;
        }
      });

      this.createBoothOptions();

      this.addShopCardItem();
    });
  }

  checkboothcode(even: any) {
    this.shopService.findByBoothCode("fvl023").subscribe((a) => {});
  }

  update(even: any) {
    console.log(even.value);
  }

  createBoothOptions() {
    const sortedShop = this.meters.sort((a: Meter, b: Meter) => {
      if (a.boothId > b.boothId) {
        return 1;
      }
      return -1;
    });

    const data = {
      label: "",
      data: { name: "" },
      options: sortedShop.map((m: Meter) => {
        return {
          value: m.boothId,
          label: m.boothId,
          data: { name: m.boothId },
          templateId: "template1",
          id: m.boothId,
        };
      }),
    };
    console.log("data >>", this.meters);
    this.boothOptions.push(data);
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
      console.log("flags", flags);
      console.log("output2", output2);
    }
    console.log("arrayOfBootId", arrayOfBootId);
    if (arrayOfBootId.length > output2.length) {
      Swal.fire("แจ้งเตือน!", "คุณกรอกรหัสแผงร้านค้าซ้ำกัน!", "warning").then(
        (result) => {
          if (result.isConfirmed) {
            // window.location.reload();
          }
        }
      );
      this.bootIdError = true;
    }
    if (arrayOfBootId.length == output2.length) {
      this.bootIdError = false;
    }
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

    const user: User = {
      id: "",
      displayName: email,
      email: email,
      password: password,
      phone: "",
      typeUser: "",
      uid: "",
      role: "customer",
    };
    const shopItems: FormArray = this.itemShopForm.get("items") as FormArray;
    this.checkDistinctBootId();
    if (this.bootIdError) {
      return;
    } else if(this.bootIdError === false){
      this.userProfileService.register(user).subscribe(
        (creden: any) => {
          const customer = {
            uid: creden.uid,
            email: email,
            custCode: custCode,
            custName: custName,
            custPhone: custPhone,
            custStartDate: custStartDate,
            minimumMoney: minimumMoney,
            currentMoney: 0,
          };

          // Add customer
          this.addCustomer(customer).subscribe((cust) => {
            // Add shops
            shopItems.value.forEach((shop: any) => {
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
                      .subscribe((meters: Meter[]) => {
                        meters.forEach((meter: Meter) => {
                          meter.custName = customer.custName;
                          meter.shopName = shop.boothName;
                          meter.uid = customer.uid;
                          this.meterService.update(meter).then(() => {});
                        });
                      });
                  });
                  Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "เพิ่มข้อมูลลูกค้าเรียบร้อย",
                    showConfirmButton: false,
                    timer: 3000,
                  });
                  this.router.navigate(["/customer-list"]);
                });
            });
          });
        },
        (error) => {
          console.log("error: ", error);
        }
      );
    }
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
