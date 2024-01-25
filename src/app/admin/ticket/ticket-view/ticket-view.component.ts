import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select2Data } from 'ng-select2-component';
import { TicketService } from 'src/app/service/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.scss']
})
export class TicketViewComponent implements OnInit {
  submit!: boolean;
  validationform!: FormGroup;
  model:any;
  idFormRoute: any;
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
  ticketsRes:any;
  constructor(private formBuilder: FormBuilder, private ticketService: TicketService,private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.idFormRoute = this.activeRoute.snapshot.params['id'];
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
      id:['',[Validators.required]]
    });
    this.ticketService.get(this.idFormRoute).subscribe(res=>{
      console.log(res)
      this.ticketsRes = res;
      this.validationform.setValue(res)
    })
  }

  formSubmit(){
    this.ticketService.update(this.validationform.value)
      .then((tickets) => {})
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'แก้ไขข้อมูลแจ้งซ่อมเรียบร้อย',
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
