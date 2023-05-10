import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { profileShopData } from './profile-view-models';

export type SortColumnshop = keyof profileShopData | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEventShop {
  column: SortColumnshop;
  direction: SortDirection;
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'th[sortableShop]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class ProfileViewShopSortableDirective {

  constructor() { }

  @Input() sortableShop: SortColumnshop = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEventShop>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortableShop, direction: this.direction });
  }
}
