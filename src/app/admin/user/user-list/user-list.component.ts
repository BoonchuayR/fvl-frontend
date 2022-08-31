import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  user:any

  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.userService.getAll().subscribe(users => {
      this.user = users;
    })
  }

}
