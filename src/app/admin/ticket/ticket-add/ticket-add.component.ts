import { Component, OnInit } from '@angular/core';
import { FormArrayName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TicketService } from 'src/app/service/ticket.service';

@Component({
  selector: 'app-ticket-add',
  templateUrl: './ticket-add.component.html',
  styleUrls: ['./ticket-add.component.scss']
})
export class TicketAddComponent implements OnInit {
  submit!: boolean;
  validationform!: FormGroup;
  model:any;
  constructor(private formBuilder: FormBuilder, private ticketService: TicketService) { }

  ngOnInit(): void {
    this.validationform = this.formBuilder.group({
      TICKET_ID: ['',[Validators.required]],
      CREATE_DATE: ['',[Validators.required]],
      HEADLINE: ['',[Validators.required]],
      DETAIL: ['',[Validators.required]],
      CATEGORY: ['',[Validators.required]],
      OPENER_USER_ID: ['',[Validators.required]],
      CURRENT_HANDLER_USER_ID: ['',[Validators.required]],
      STATUS: ['',[Validators.required]],
      DUE_DATE: ['',[Validators.required]],
      LOG: ['',[Validators.required]],
    });
  }

  formSubmit(){
    this.ticketService.create(this.validationform.value)
      .then((tickets) => {})
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'เพิ่มข้อมูลผู้ใช้งานเรียบร้อย',
        showConfirmButton: false,
        timer: 3000
      })
      .catch(error => { 
        console.log(error) 
      });
  }
  validSubmit() {
    this.submit = true;
  }

}
