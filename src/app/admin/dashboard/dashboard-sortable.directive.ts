import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { DashboardUser } from './dashboard.model';

export type SortColumn = keyof DashboardUser | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEventDashboard {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'th[sortableDashboard]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class DashboardSortableDirective {

  constructor() { }

  @Input() sortableDashboard: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEventDashboard>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortableDashboard, direction: this.direction });
  }
}
