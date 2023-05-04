import { Component, OnInit } from '@angular/core';
import { FormArrayName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopupService } from 'src/app/service/topup.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-topup-add',
  templateUrl: './topup-add.component.html',
  styleUrls: ['./topup-add.component.scss']
})
export class TopupAddComponent implements OnInit {

  // Form submition
  submit!: boolean;
  validationform!: FormGroup;

  constructor(private formBuilder: FormBuilder, private topupService: TopupService) { }

  ngOnInit(): void {
    this.validationform = this.formBuilder.group({
      TopupUpdate: ['', [Validators.required]],
      TopupAdd: ['', [Validators.required]],
      TopupDate: ['', [Validators.required]],
      TopupStatus: ['', [Validators.required]],
    });
  }

  formSubmit(){
    this.topupService.create(this.validationform.value)
      .then((topup) => {})
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'เพิ่มข้อมูลเติมเงินเรียบร้อย',
        showConfirmButton: false,
        timer: 3000
      })
      .catch(error => { 
        console.log(error) 
      });
  }

    /**
   * Bootsrap validation form submit method
   */
  validSubmit() {
    this.submit = true;
  }

}
