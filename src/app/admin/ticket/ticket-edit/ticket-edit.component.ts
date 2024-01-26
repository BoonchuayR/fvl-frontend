import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { TicketService } from 'src/app/service/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ticket-edit',
  templateUrl: './ticket-edit.component.html',
  styleUrls: ['./ticket-edit.component.scss']
})
export class TicketEditComponent implements OnInit {
  submit!: boolean;
  validationform!: FormGroup;
  model:any;
  status:Select2Data=[
    {
      value: 'กำลังดำเนินการ',
      label: 'กำลังดำเนินการ',
      data: 'กำลังดำเนินการ',
      id: 'กำลังดำเนินการ',
    },
    {
      value: 'แก้ไขเสร็จเรียบร้อย',
      label: 'แก้ไขเสร็จเรียบร้อย',
      data: 'แก้ไขเสร็จเรียบร้อย',
      id: 'แก้ไขเสร็จเรียบร้อย',
    }
  ]
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
      CONTRACT_NO: ['',[Validators.required]],
      METER: ['',[Validators.required]],
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
