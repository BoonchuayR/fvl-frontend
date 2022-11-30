import { Component, OnInit } from "@angular/core";
import { getAuth } from "@angular/fire/auth";
import { UserService } from "src/app/service/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit {
  user!: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe((user) => {
      this.user = user;
      console.log("user: ", user);
    });
  }

  /**
   * Confirm sweet alert
  //  * @param confirm modal content
  //  */
  confirm(id: string) {
    Swal.fire({
      title: "ลบข้อมูลผู้ใช้งาน",
      text: "คุณต้องการลบข้อมูลผู้ใช้งานนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "ใช่, ต้องการ!",
      cancelButtonText: "ไม่, ยกเลิก!",
    }).then((result) => {
      console.log(id);
      if (result.value) {
        this.userService.delete(id).then((deleteduser) => {
          console.log(deleteduser);
        });
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "ลบข้อมูลผู้ใช้งานเรียบร้อย",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    });
  }
}
