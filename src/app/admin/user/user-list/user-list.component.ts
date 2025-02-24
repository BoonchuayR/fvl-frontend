import { DecimalPipe } from "@angular/common";
import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { Observable } from "rxjs";
import { UserService } from "src/app/service/user.service";
import Swal from "sweetalert2";
import { UserDataTableService } from "./user-datatable.service";
import {
  UserSortableDirective,
  SortEventUser,
} from "./user-sortable.directive";
import { User } from "src/app/core/models/user.models";
import { userData } from "./user-data";
import { UserProfileService } from "src/app/core/services/user.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
  providers: [UserDataTableService, DecimalPipe],
})
export class UserListComponent implements OnInit {
  tableData!: User[];
  hideme: boolean[] = [];
  tables$: Observable<User[]>;
  total$: Observable<number>;
  @ViewChildren(UserSortableDirective)
  headers!: QueryList<UserSortableDirective>;

  user!: any;
  listname!: string;

  constructor(
    private userService: UserService,
    private userProfileService: UserProfileService,
    public userDataTableService: UserDataTableService
  ) {
    this.tables$ = userDataTableService.tables$;
    this.total$ = userDataTableService.total$;
  }

  async ngOnInit(): Promise<void> {
    this.userService.getAll().subscribe((users) => {
      // console.log("users >>> ", users);
      this.userDataTableService.users = users;
      // console.log("after set users >>> ");
    });
  }

  // async logJSONData() {
  //   const response = await fetch("https://us-central1-foodvilla-1fe60.cloudfunctions.net/api/users");
  //   const jsonData = await response.json();
  // }

  onSort({ column, direction }: SortEventUser) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortableUser !== column) {
        header.direction = "";
      }
    });
    this.userDataTableService.sortColumn = column;
    this.userDataTableService.sortDirection = direction;
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
      if (result.value) {
        // Remove user
        this.userProfileService.remove(id).subscribe((result) => {});

        this.userService.delete(id).then((deleteduser) => {});
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
