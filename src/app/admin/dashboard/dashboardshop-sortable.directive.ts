import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { DashboardShop } from './dashboard.model';

export type SortColumnshop = keyof DashboardShop | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEventDashboard {
  column: SortColumnshop;
  direction: SortDirection;
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'th[sortableDashboardshop]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class DashboardSortableDirective {

  constructor() { }

  @Input() sortableDashboardshop: SortColumnshop = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEventDashboard>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortableDashboardshop, direction: this.direction });
  }
}
