import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import Swal from 'sweetalert2';
import { UserProfileService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user.models';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  submit!: boolean;

  validationform = this.formBuilder.group({ 
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      typeUser: ['ฝ่ายซ่อมบำรุง', Validators.required],
  });


  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService,
    private userProfileService: UserProfileService,
    private router: Router,
    ) {}

  ngOnInit(): void {
    
  }

  get name() {
    return this.validationform.get('name');
  }
  
  getemail() {
    return this.validationform.get('email');
  }

  get password() {
    return this.validationform.get('password');
  }

  get phone() {
    return this.validationform.get('phone');
  }

  get typeUser() {
    return this.validationform.get('typeUser');
  }
  
  formSubmit(){
    const { name, email, password, phone, typeUser} = this.validationform.value;

    let role = "service";
    if (typeUser === "ฝ่ายบัญชี") {
      role = "account";
    } else {
      role = "sale";
    }
    
    const user: User = {
      id: "",
      displayName: email,
      email: email,
      password: password,
      phone: "",
      typeUser: "",
      uid: "",
      role: role
    }

    this.userProfileService.register(user).subscribe((res: any) => {
      
      this.userService.addUser({ 
        uid: res.uid, 
        email: email,
        displayName: email,
        phone: phone,
        typeUser:typeUser
      }).subscribe(() => {

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "เพิ่มข้อมูลผู้ใช้งานเรียบร้อย",
          showConfirmButton: false,
          timer: 3500,
        });

        this.router.navigate(['/user-list']);
      });
    });
  }
  
  validSubmit() {
    this.submit = true;
  }
}
