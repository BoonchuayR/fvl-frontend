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
import { Select2Data } from "ng-select2-component";
import { AuthService } from "src/app/service/auth.service";
import { switchMap } from "rxjs/operators";
import { Router } from "@angular/router";

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
    private router: Router
  ) {
    this.itemShopForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.addItem();
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
  get currentMoney() {
    return this.validationform.get("currentMoney");
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
      currentMoney,
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
          currentMoney: currentMoney,
          
        };

        // Add customer
        this.addCustomer(customer).subscribe((cust) => {
          // Add shops
          const shopItems: FormArray = this.itemShopForm.get(
            "items"
          ) as FormArray;
          shopItems.value.forEach((shop: any) => {
            this.shopService.create({...shop, uid: customer.uid});
          });
        });
      },
      (error) => {
        console.log("error: ", error);
        this.router.navigate(["/customer-list"]);
      }
    );
    // console.log("registeredUser: ", registeredUser);
    // this.authService
    //   .register(email, password)
    //   .pipe(
    //     switchMap(({ user: { uid } }) =>
    //       this.customerService.addCustomer({
    //         uid,
    //         email,
    //         custCode: custCode,
    //         custName: custName,
    //         custPhone: custPhone,
    //         custStartDate: custStartDate,
    //         minimumMoney: minimumMoney,
    //         currentMoney: currentMoney,
    //       })
    //     )
    //   )
    //   .subscribe((user) => {
    //     console.log("user: ", user);
    //     this.router.navigate(["/customer-list"]);
    //   });

    // this.customerService
    // .create(this.validationform.value)
    // .then((customer) => {
    //   // console.log(`customers: ${customers}`);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "เพิ่มข้อมูลลูกค้าเรียบร้อย",
      showConfirmButton: false,
      timer: 3000,
    });
    //   return customer.id;
    // })
    // .catch((err) => {
    //   console.log("error: ", err);
    // });

    // Add shop(s)
    // console.log("customerId: ", customerId);
    // this.shopService.create(this.itemShopForm.value).then((shop) => {
    //   console.log("shop");
    // });
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
