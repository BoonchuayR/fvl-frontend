import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Meter } from 'src/app/core/models/meter.model';



export type SortColumn = keyof  Meter| '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEventMeter {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'th[sortableMeter]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class MeterSortableDirective {

  constructor() { }

  @Input() sortableMeter: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEventMeter>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortableMeter, direction: this.direction });
  }
}
