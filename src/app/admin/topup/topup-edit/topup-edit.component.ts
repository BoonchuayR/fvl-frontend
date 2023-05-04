import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { TopupService } from "src/app/service/topup.service";
// import { isThisTypeNode } from "typescript";
import Swal from "sweetalert2";

@Component({
  selector: 'app-topup-edit',
  templateUrl: './topup-edit.component.html',
  styleUrls: ['./topup-edit.component.scss']
})
export class TopupEditComponent implements OnInit {
  topupId!: string;
  submit!: boolean;
  editform = new FormGroup({
    id: new FormControl(""),
    TopupUpdate: new FormControl(""),
    TopupAdd: new FormControl(""),
    TopupDate: new FormControl(""),
    TopupStatus: new FormControl(""),
  });

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private topupService: TopupService
  ) { }

  ngOnInit(): void {
    // this.updateMeterData(),
    this.topupId = this.route.snapshot.params["id"];
    this.topupService.get(this.topupId).subscribe((data) => {

      this.editform.setValue(data);
    });
  }

  updatemeterData() {
    this.editform = this.formBuilder.group({
      id: [""],
      TopupUpdate: [""],
      TopupAdd: [""],
      TopupDate: [""],
      TopupStatus: [""],
    });
  }

  formSubmit() {
    this.topupService.update(this.editform.value)
      .then((topup) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'แก้ไขข้อมูลการเติมเงินเรียบร้อย',
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
