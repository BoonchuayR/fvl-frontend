import { Component, OnInit } from "@angular/core";
import {
  FormArrayName,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { IotService } from "src/app/service/iot.service";
import { MeterService } from "src/app/service/meter.service";
import Swal from "sweetalert2";
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface City {
  country: string,
  name: string
};

@Component({
  selector: "app-meter-add",
  templateUrl: "./meter-add.component.html",
  styleUrls: ["./meter-add.component.scss"],
})
export class MeterAddComponent implements OnInit {

  cities$: Observable<City[] | any>;

  // Form submition
  submit!: boolean;
  validationform!: FormGroup;
  meter!: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private meterService: MeterService,
    private iotService: IotService,
    firestore: Firestore
  ) {
    const cities = collection(firestore, 'cities');
    
    this.cities$ = collectionData(cities);
    
  }

  ngOnInit(): void {
    this.validationform = this.formBuilder.group({
      zone: ["A", [Validators.required]],
      storeId: ["", [Validators.required]],
      slaveId: ["", [Validators.required]],
      deviceId: ["", [Validators.required]],
      contractId: ["", [Validators.required]],
      deviceZone: ["", [Validators.required]],
      serialNo: ["", [Validators.required]],
      lineVoltage: ["", [Validators.required]],
      lineFrequency: ["", [Validators.required]],
      lineCurrent: ["", [Validators.required]],
      activePower: ["", [Validators.required]],
      activeEnergy: ["", [Validators.required]],
      modelSpec: ["", [Validators.required]],
      updateDatetime: ["", [Validators.required]],
      meterState: ["", [Validators.required]],
      updateStateDatetime: ["", [Validators.required]],
      meterStateAdmin: ["", [Validators.required]],
      updateStateAdminDatetime: ["", [Validators.required]],
    });

    this.validationform.get("storeId")?.valueChanges.subscribe((value) => {
      this.iotService.meterSelectByStoreId(value).subscribe((res: any) => {
        const meter = res.DATA[0];
        if (meter) {
          this.validationform.get("deviceId")?.setValue(meter.DEVICE_ID);
          this.validationform.get("contractId")?.setValue(meter.CONTRACT_ID);
          this.validationform.get("deviceZone")?.setValue(meter.DEVICE_ZONE);
          this.validationform.get("serialNo")?.setValue(meter.SERIAL_NO);
          this.validationform.get("lineVoltage")?.setValue(meter.LINE_VOLTAGE);
          this.validationform
            .get("lineFrequency")
            ?.setValue(meter.LINE_FREQUENCY);
          this.validationform.get("lineCurrent")?.setValue(meter.LINE_CURRENT);
          this.validationform.get("activePower")?.setValue(meter.ACTIVE_POWER);
          this.validationform
            .get("activeEnergy")
            ?.setValue(meter.ACTIVE_ENERGY);
          this.validationform.get("modelSpec")?.setValue(meter.MODEL_SPEC);
          this.validationform
            .get("updateDatetime")
            ?.setValue(meter.UPDATE_DATETIME);
          this.validationform.get("meterState")?.setValue(meter.METER_STATE);
          this.validationform
            .get("updateStateDatetime")
            ?.setValue(meter.UPDATE_STATE_DATETIME);
          this.validationform
            .get("meterStateAdmin")
            ?.setValue(meter.METER_STATE_ADMIN);
          this.validationform
            .get("updateStateAdminDatetime")
            ?.setValue(meter.UPDATE_STATE_ADMIN_DATETIME);
          this.validationform
            .get("slaveId")
            ?.setValue(meter.SLAVE_ID);
        } else {
          this.validationform.get("deviceId")?.setValue("");
          this.validationform.get("contractId")?.setValue("");
          this.validationform.get("deviceZone")?.setValue("");
          this.validationform.get("serialNo")?.setValue("");
          this.validationform.get("lineVoltage")?.setValue("");
          this.validationform.get("lineFrequency")?.setValue("");
          this.validationform.get("lineCurrent")?.setValue("");
          this.validationform.get("activePower")?.setValue("");
          this.validationform.get("activeEnergy")?.setValue("");
          this.validationform.get("modelSpec")?.setValue("");
          this.validationform.get("updateDatetime")?.setValue("");
          this.validationform.get("meterState")?.setValue("");
          this.validationform.get("updateStateDatetime")?.setValue("");
          this.validationform.get("meterStateAdmin")?.setValue("");
          this.validationform.get("updateStateAdminDatetime")?.setValue("");
          this.validationform.get("slaveId")?.setValue("");
        }
      });
    });
  }

  // formSubmit() {
  //   const meter = {
  //     ...this.validationform.value,
  //     lastActiveEnergy: this.validationform.get("activeEnergy")
  //   }
  //   console.log("meter: ", meter)
  //   this.meterService.create(meter).then((res) => {
  //     console.log("savedMeter: ", res);
  //   });
  //   Swal.fire({
  //     position: "top-end",
  //     icon: "success",
  //     title: "เพิ่มข้อมูลมิเตอร์เรียบร้อย",
  //     showConfirmButton: false,
  //     timer: 3000,
  //   });
  // }

  /**
   * Bootsrap validation form submit method
   */
  addMeter() {
    this.submit = true;
    const meter = {
      id: this.validationform.get("storeId")?.value,
      ...this.validationform.value,
      lastActiveEnergy: this.validationform.get("activeEnergy")?.value
    }

    console.log("addMeter >>> ", meter)

    // Check Duplicate Meter
    
    this.meterService.create(meter).then((meter) => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "เพิ่มข้อมูลมิเตอร์เรียบร้อย",
        showConfirmButton: false,
        timer: 3000,
      });
      this.router.navigate(["/meter-dashboard"]);
    });
  
  }

    /**
   * Basic sweet alert
   * @param basicMessage modal content
   */
    dulicateMeterMessage() {
      Swal.fire('ข้อมูลมิเตอร์ซ้ำ ไม่สามารถบันทึกได้');
    }
}
