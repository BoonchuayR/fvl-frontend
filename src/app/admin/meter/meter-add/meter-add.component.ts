import { Component, OnInit } from "@angular/core";
import {
  FormArrayName,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { IotService } from "src/app/service/iot.service";
import { MeterService } from "src/app/service/meter.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-meter-add",
  templateUrl: "./meter-add.component.html",
  styleUrls: ["./meter-add.component.scss"],
})
export class MeterAddComponent implements OnInit {
  // Form submition
  submit!: boolean;
  validationform!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private meterService: MeterService,
    private iotService: IotService
  ) {}

  ngOnInit(): void {
    this.validationform = this.formBuilder.group({
      zone: ["A", [Validators.required]],
      meterSlaveId: ["", [Validators.required]],
      deviceId: [{ value: "", disabled: true }, [Validators.required]],
      constractId: [{ value: "", disabled: true }, [Validators.required]],
      deviceZone: [{ value: "", disabled: true }, [Validators.required]],
      serialNo: [{ value: "", disabled: true }, [Validators.required]],
      lineVoltage: [{ value: "", disabled: true }, [Validators.required]],
      lineFrequency: [{ value: "", disabled: true }, [Validators.required]],
      lineCurrent: [{ value: "", disabled: true }, [Validators.required]],
      activePower: [{ value: "", disabled: true }, [Validators.required]],
      activeEnergy: [{ value: "", disabled: true }, [Validators.required]],
      modelSpec: [{ value: "", disabled: true }, [Validators.required]],
      updateDatetime: [{ value: "", disabled: true }, [Validators.required]],
      meterState: [{ value: "", disabled: true }, [Validators.required]],
      updateStateDatetime: [
        { value: "", disabled: true },
        [Validators.required],
      ],
      meterStateAdmin: [{ value: "", disabled: true }, [Validators.required]],
      updateStateAdminDatetime: [
        { value: "", disabled: true },
        [Validators.required],
      ],
    });

    this.validationform.get("meterSlaveId")?.valueChanges.subscribe((value) => {
      this.iotService.meterSelectAll().subscribe((meters: any) => {
        const filterMeters = meters.filter((m: any) => {
          return m.METER_SLAVE_ID === value;
        });

        if (filterMeters && filterMeters.length > 0) {
          const meter = filterMeters[0];
          this.validationform.get("deviceId")?.setValue(meter.DEVICE_ID);
          this.validationform.get("constractId")?.setValue(meter.CONTRACT_ID);
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
        } else {
          this.validationform.get("deviceId")?.setValue("");
          this.validationform.get("constractId")?.setValue("");
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
        }
      });
    });
  }

  formSubmit() {
    console.log(this.validationform.value);
    this.meterService.create(this.validationform.value).then((meter) => {
      console.log("meter");
    });
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "เพิ่มข้อมูลมิเตอร์เรียบร้อย",
      showConfirmButton: false,
      timer: 3000,
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Bootsrap validation form submit method
   */
  validSubmit() {
    this.submit = true;
  }
}
