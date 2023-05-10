import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { profileElectricData} from './profile-view-models';

export type SortColumnElectric = keyof profileElectricData | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEventShop {
  column: SortColumnElectric;
  direction: SortDirection;
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'th[sortableelectric]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class ProfileViewElectricSortableDirective {

  constructor() { }

  @Input() sortableelectric: SortColumnElectric = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEventShop>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortableelectric, direction: this.direction });
  }
}
