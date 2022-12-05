import { Component, OnInit } from '@angular/core';
import { FormArrayName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service';
import { user } from '@angular/fire/auth';
import Swal from 'sweetalert2';
import { icons } from 'src/app/pages/icons/materialdesign/data';


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
    private authService: AuthService,
    private router: Router,
    ) {}

  ngOnInit(): void {}

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
    const { name,email,password,phone,typeUser} = this.validationform.value;

    // if (!this.validationform.valid ||!name ||!email ||!password ||!phone ||!typeUser){
    //   return;
    // }

    this.authService
      .register(email,password)
      .pipe(
        switchMap(({ user:{ uid }})=>
          this.userService.addUser({ uid,email,displayName:name,phone:phone,typeUser:typeUser})
          ))
      .subscribe(()=> {
        this.router.navigate(['/user-list']);
      });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "เพิ่มข้อมูลผู้ใช้งานเรียบร้อย",
        showConfirmButton: false,
        timer: 3500,
      });

  }
  
  validSubmit() {
    this.submit = true;
    }
}
