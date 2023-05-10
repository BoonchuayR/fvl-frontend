import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { profileMeterData } from './profile-view-models';

export type SortColumnMeter = keyof profileMeterData | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEventShop {
  column: SortColumnMeter;
  direction: SortDirection;
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'th[sortablemeter]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class ProfileViewMeterSortableDirective {

  constructor() { }

  @Input() sortablemeter: SortColumnMeter = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEventShop>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortablemeter, direction: this.direction });
  }
}
