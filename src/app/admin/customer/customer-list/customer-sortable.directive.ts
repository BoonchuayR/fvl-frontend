import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Customer } from 'src/app/core/models/customer.models';


export type SortColumn = keyof Customer | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEventCustomer {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'th[sortable]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class CustomerSortableDirective {

  constructor() { }

  @Input() sortableUser: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEventCustomer>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortableUser, direction: this.direction });
  }
}
