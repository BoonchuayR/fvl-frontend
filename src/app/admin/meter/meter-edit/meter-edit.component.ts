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
    meterName: new FormControl(""),
    voltageNumber: new FormControl(""),
    voltampNumber: new FormControl(""),
    meterNumber: new FormControl(""),
    status: new FormControl(""),
    zoneNumber: new FormControl(""),
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
      meterName: [""],
      voltageNumber: [""],
      voltampNumber: [""],
      meterNumber: [""],
      status: [""],
      zoneNumber: [""],
    });
  }

  formSubmit() {
    this.meterService.update(this.editform.value)
      .then((meter) => {
        console.log("meter");
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