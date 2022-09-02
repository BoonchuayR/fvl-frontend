import { Component, OnInit } from '@angular/core';
import { FormArrayName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeterService } from 'src/app/service/meter.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meter-add',
  templateUrl: './meter-add.component.html',
  styleUrls: ['./meter-add.component.scss']
})
export class MeterAddComponent implements OnInit {

  // Form submition
  submit!: boolean;
  validationform!: FormGroup;

  constructor(private formBuilder: FormBuilder, private meterService: MeterService) { }

  ngOnInit(): void {
    this.validationform = this.formBuilder.group({
      SLAVE_ID : ['',[Validators.required]],
      SERIAL_NO : ['',[Validators.required]],
      LINE_VOLTAGE : ['',[Validators.required]],
      LINE_FREQUENCE : ['',[Validators.required]],
      LINE_CURRENT : ['',[Validators.required]],
      ACTIVE_POWER : ['',[Validators.required]],
      ACTIVE_ENERGY : ['',[Validators.required]],
      CURRENT_RATING : ['',[Validators.required]],
      BASIC_CURRENT : ['',[Validators.required]],
      MAXIMUM_CURRENT : ['',[Validators.required]],
      METER_ZONE : ['',[Validators.required]],
    });
  }

  formSubmit(){
    console.log(this.validationform.value);
    this.meterService.create(this.validationform.value)
      .then((meter) => { console.log("meter") })
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'เพิ่มข้อมูลมิเตอร์เรียบร้อย',
        showConfirmButton: false,
        timer: 3000
      })
      .catch(error => { console.log(error) });
  }

    /**
   * Bootsrap validation form submit method
   */
  validSubmit() {
    this.submit = true;
  }

}
