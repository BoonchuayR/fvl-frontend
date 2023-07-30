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
  formsubmit!: boolean;
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

    // Initial form
    this.validationform = this.formBuilder.group({
      contractId: ["", [Validators.required]],
      boothId: ["", [Validators.required]],
      deviceZone: ["", [Validators.required]],
      deviceId: ["", [Validators.required]],
      serialNo: ["", [Validators.required]],
      slaveId: ["", [Validators.required]],
      modelSpec: ["", [Validators.required]],
      lineVoltage: ["", [Validators.required]],
      lineFrequency: ["", [Validators.required]],
      lineCurrent: ["", [Validators.required]],
      activePower: ["", [Validators.required]],
      activeEnergy: ["", [Validators.required]],
      updateDateTime: ["", [Validators.required]],
      meterState: ["", [Validators.required]],
      updateStateDateTime: ["", [Validators.required]],
      meterStateAdmin: ["", [Validators.required]],
      updateStateAdminDateTime: ["", [Validators.required]],
      meterStatePreviousUnit: ["", [Validators.required]],
      meterStateCalculateUnit: ["", [Validators.required]],
    });

    // Set meter info when booth id change
    this.validationform.get("boothId")?.valueChanges.subscribe((value) => {
      this.iotService.meterSelectByBoothId(value).subscribe((res: any) => {
        console.log("res >>> ", res);
        const meter = res.DATA_RESPONSE[0];
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
            .get("updateDateTime")
            ?.setValue(meter.UPDATE_DATETIME);
          this.validationform.get("meterState")?.setValue(meter.METER_STATE);
          this.validationform
            .get("updateStateDateTime")
            ?.setValue(meter.UPDATE_STATE_DATETIME);
          this.validationform
            .get("meterStateAdmin")
            ?.setValue(meter.METER_STATE_ADMIN);
          this.validationform
            .get("updateStateAdminDateTime")
            ?.setValue(meter.UPDATE_STATE_ADMIN_DATETIME);
          this.validationform
            .get("slaveId")
            ?.setValue(meter.SLAVE_ID);
          this.validationform
            .get("meterStatePreviousUnit")
            ?.setValue(meter.METER_STATE_PREVIOUS_UNIT);
          this.validationform
            .get("meterStateCalculateUnit")
            ?.setValue(meter.METER_STATE_CALCULATE_UNIT);
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
          this.validationform.get("updateDateTime")?.setValue("");
          this.validationform.get("meterState")?.setValue("");
          this.validationform.get("updateStateDateTime")?.setValue("");
          this.validationform.get("meterStateAdmin")?.setValue("");
          this.validationform.get("updateStateAdminDateTime")?.setValue("");
          this.validationform.get("slaveId")?.setValue("");
          this.validationform.get("meterStatePreviousUnit")?.setValue("");
          this.validationform.get("meterStateCalculateUnit")?.setValue("");
        }
      });
    });
  }

  /**
   * Bootsrap validation form submit method
   */
  async addMeter() {
    this.submit = true;
    const boothId = this.validationform.get("boothId")?.value;
    
    const meter = {
      ...this.validationform.value,
      lastActiveEnergy: this.validationform.get("activeEnergy")?.value
    }

    // Check Duplicate Meter
    // const isDupMeter = await this.meterService.checkDupMeter(boothId)
    // .then(res => res.json())
    // .then(function(res) {
    //   return res.isDup;
    // });
    const isDupMeter = false;
    if (isDupMeter) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: `Booth ID [${this.validationform.get("boothId")?.value}] ซ้ำ ไม่สามารถบันทึกได้`,
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    } else {
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
  }

    /**
   * Basic sweet alert
   * @param basicMessage modal content
   */
    dulicateMeterMessage() {
      Swal.fire('ข้อมูลมิเตอร์ซ้ำ ไม่สามารถบันทึกได้');
    }

      /**
   * returns tooltip validation form
   */
  get formData() {
    return this.validationform.controls;
  }

   /**
   * Bootsrap validation form submit method
   */
   validSubmit() {
    this.submit = true;
  }

    /**
   * Bootstrap tooltip form validation submit method
   */
    formSubmit() {
      this.formsubmit = true;
    }

}
