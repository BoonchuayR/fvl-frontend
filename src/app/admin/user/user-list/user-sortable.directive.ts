import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/core/models/user.models';

export type SortColumn = keyof User | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEventUser {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'th[sortableUser]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class UserSortableDirective {

  constructor() { }

  @Input() sortableUser: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEventUser>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortableUser, direction: this.direction });
  }
}
