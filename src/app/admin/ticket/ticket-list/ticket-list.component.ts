import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TicketService } from 'src/app/service/ticket.service';
import Swal from 'sweetalert2';
import { AdvancedServiceticket } from './ticket-datatable.service';
import { Ticket } from 'src/app/core/models/ticket.model';
import { Observable } from 'rxjs';
import { AdvancedSortableDirective } from './ticket-sortable.directive';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
  providers: [AdvancedServiceticket, DecimalPipe]
})
export class TicketListComponent implements OnInit {
  tableData!: Ticket[];
  hideme: boolean[] = [];
  tables$: Observable<Ticket[]>;
  total$: Observable<number>;
  @ViewChildren(AdvancedSortableDirective)
  headers!: QueryList<AdvancedSortableDirective>;
  ticket!:any

  constructor(private ticketService:TicketService,public service:AdvancedServiceticket) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
   }

  ngOnInit(): void {
    this.ticketService.getAll().subscribe(tickets => {
      this.ticket = tickets;
      console.log("Ticket >>>>>>>>>>>>>>>.............[]",this.ticket)
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
