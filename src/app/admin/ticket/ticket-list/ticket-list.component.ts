import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/service/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  ticket!:any

  constructor(private ticketService:TicketService) { }

  ngOnInit(): void {
    this.ticketService.getAll().subscribe(tickets => {
      this.ticket = tickets;
    })
  }

   /**
   * Confirm sweet alert
   * @param confirm modal content
   */
    confirm(id:string) {
      Swal.fire({
        title: 'ลบข้อมูลแจ้งซ่อม',
        text: "คุณต้องการลบข้อมูลแจ้งซ่อมนี้ใช่หรือไม่?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'ใช่, ต้องการ!',
        cancelButtonText:'ไม่, ยกเลิก!',
      }).then((result) => {
        console.log(id)
        if (result.value) {
          this.ticketService.delete(id).then(deletedticket => {console.log(deletedticket);
          })
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'ลบข้อมูลแจ้งซ่อมเรียบร้อย',
            showConfirmButton: false,
            timer: 3000
          })
        }
      });
    }

}
