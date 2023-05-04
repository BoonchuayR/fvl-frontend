import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { MeterService } from "src/app/service/meter.service";
// import { isThisTypeNode } from "typescript";
import Swal from "sweetalert2";

@Component({
  selector: 'app-meter-edit',
  templateUrl: './meter-edit.component.html',
  styleUrls: ['./meter-edit.component.scss']
})
export class MeterEditComponent implements OnInit {
  meterId!: string;
  submit!: boolean;
  editform = new FormGroup({
    id: new FormControl(""),
    SLAVE_ID: new FormControl(""),
    SERIAL_NO: new FormControl(""),
    LINE_VOLTAGE: new FormControl(""),
    LINE_FREQUENCE: new FormControl(""),
    LINE_CURRENT: new FormControl(""),
    ACTIVE_POWER: new FormControl(""),
    ACTIVE_ENERGY: new FormControl(""),
    CURRENT_RATING: new FormControl(""),
    BASIC_CURRENT: new FormControl(""),
    MAXIMUM_CURRENT: new FormControl(""),
    METER_ZONE: new FormControl(""),
    METER_STATE: new FormControl(""),
    METER_SHOP: new FormControl(""),
  });

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private meterService: MeterService
  ) { }

  ngOnInit(): void {
    // this.updateMeterData(),
    this.meterId = this.route.snapshot.params["id"];
    this.meterService.get(this.meterId).subscribe((data) => {

      this.editform.setValue(data);
    });
  }


  updatemeterData() {
    this.editform = this.formBuilder.group({
      id: [""],
      SLAVE_ID: [""],
      SERIAL_NO: [""],
      LINE_VOLTAGE: [""],
      LINE_FREQUENCE: [""],
      LINE_CURRENT: [""],
      ACTIVE_POWER: [""],
      ACTIVE_ENERGY: [""],
      CURRENT_RATING: [""],
      BASIC_CURRENT: [""],
      MAXIMUM_CURRENT: [""],
      METER_ZONE: [""],
      METER_STATE: [""],
      METER_SHOP: [""],
    });
  }

  formSubmit() {
    this.meterService.update(this.editform.value)
      .then((meter) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'แก้ไขข้อมูลมิเตอร์เรียบร้อย',
          showConfirmButton: false,
          timer: 3000
        });

      })
      .catch((error) => {
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