import { Component, OnInit } from '@angular/core';
import { FormArrayName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  submit!: boolean;
  validationform!: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.validationform = this.formBuilder.group({
      UserType: ['',[Validators.required]],
      UserName: ['',[Validators.required]],
      UserPwd: ['',[Validators.required]],
      UserEmail: ['',[Validators.required]],
      UserPhone: ['',[Validators.required]],
    });
  }
  formSubmit(){
    console.log(this.validationform.value);
    this.userService.create(this.validationform.value)
      .then((users) => { console.log("users") })
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'เพิ่มข้อมูลผู้ใช้งานเรียบร้อย',
        showConfirmButton: false,
        timer: 3000
      })
      .catch(error => { console.log(error) });
  }
  validSubmit() {
    this.submit = true;
  }

}
