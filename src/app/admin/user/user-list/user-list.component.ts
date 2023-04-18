import { DecimalPipe } from "@angular/common";
import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { getAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";
import { UserService } from "src/app/service/user.service";
import Swal from "sweetalert2";
import { UserAdvancedService } from "./user-datatable.service";
import { UserSortableDirective, SortEvent } from "./user-sortable.directive";
import { User } from "src/app/core/models/user.models";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
  providers: [UserAdvancedService, DecimalPipe]
})
export class UserListComponent implements OnInit {

  tableData!: User[];
  hideme: boolean[] = [];
  tables$: Observable<User[]>;
  total$: Observable<number>;
  @ViewChildren(UserSortableDirective)
  headers!: QueryList<UserSortableDirective>;
  
  user!: any;

  constructor(private userService: UserService, public service: UserAdvancedService) {
      this.tables$ = service.tables$;
      this.total$ = service.total$;
  }

  ngOnInit(): void {
    this.userService.getAll().subscribe((user) => {
      this.user = user;
      this.tableData = user;
      console.log("user: ", user);
    });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
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
