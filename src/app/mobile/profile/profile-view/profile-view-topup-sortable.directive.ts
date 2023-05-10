import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { profileTopupData } from './profile-view-models';

export type SortColumnTopup = keyof profileTopupData | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEventShop {
  column: SortColumnTopup;
  direction: SortDirection;
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'th[sortabletopup]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class ProfileViewTopupSortableDirective {

  constructor() { }

  @Input() sortabletopup: SortColumnTopup = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEventShop>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortabletopup, direction: this.direction });
  }
}
