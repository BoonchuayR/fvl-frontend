import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from 'src/app/core/models/ticket.model';


export type SortColumn = keyof Ticket | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEventTicket {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'th[sortableTicket]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class TicketSortableDirective {

  constructor() { }

  @Input() sortableTicket: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEventTicket>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortableTicket, direction: this.direction });
  }
}
