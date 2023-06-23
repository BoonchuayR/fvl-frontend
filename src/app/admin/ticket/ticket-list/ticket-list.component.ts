import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TicketService } from 'src/app/service/ticket.service';
import Swal from 'sweetalert2';
import { TicketServiceticket as TicketServiceticket } from './ticket-datatable.service';
import { Ticket } from 'src/app/core/models/ticket.model';
import { Observable } from 'rxjs';
import { SortEventTicket, TicketSortableDirective } from './ticket-sortable.directive';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
  providers: [TicketServiceticket, DecimalPipe]
})
export class TicketListComponent implements OnInit {
  tableData!: Ticket[];
  hideme: boolean[] = [];
  tables$: Observable<Ticket[]>;
  total$: Observable<number>;
  @ViewChildren(TicketSortableDirective)
  headers!: QueryList<TicketSortableDirective>;
  ticket!:any

  constructor(private ticketService:TicketService,public service:TicketServiceticket) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
   }

  ngOnInit(): void {
    this.ticketService.getAll().subscribe(tickets => {
      this.ticket = tickets;
      this.service.tickets = this.ticket;
      console.log("ticket data == ",this.ticket)

    })
  }
  onSort({ column, direction }: SortEventTicket) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortableTicket !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
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
        if (result.value) {
          this.ticketService.delete(id).then(deletedticket => {
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
