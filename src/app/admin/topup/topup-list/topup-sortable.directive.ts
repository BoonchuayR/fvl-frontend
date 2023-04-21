import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Topup } from 'src/app/core/models/topup.model';

export type SortColumn = keyof Topup | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEventTopup {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'th[sortableTopup]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class TopupSortableDirective {

  constructor() { }

  @Input() sortableTopup: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEventTopup>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortableTopup, direction: this.direction });
  }
}
