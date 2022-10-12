import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { UserService } from 'src/app/service/user.service';
import Swal from "sweetalert2";
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  id!:string;
  submit!: boolean;

    editform = new FormGroup({
    displayName: new FormControl(""),
    email: new FormControl(""),
    phone: new FormControl(""),
    typeUser: new FormControl(""),
  });
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.params["id"];
    this.userService.get(this.id).subscribe((data) => {
      this.editform.setValue(data);
    });
  }

  updateuserData() {
    this.editform = this.formBuilder.group({
      name: [''],
      email: [''],
      password: [''],
      phone: [''],
      typeUser: [''],
    });
  }

  // formSubmit() {
  //   this.userService.update(this.editform.value)
  //     .then((user) => {
  //       console.log("user");
  //       Swal.fire({
  //         position: 'top-end',
  //         icon: 'success',
  //         title: 'แก้ไขข้อมูลผู้ใช้งานเรียบร้อย',
  //         showConfirmButton: false,
  //         timer: 3000
  //       });

  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  // /**
  //  * Bootsrap validation form submit method
  //  */
  // validSubmit() {
  //   this.submit = true;
  // }

}



