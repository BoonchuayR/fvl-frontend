import { Injectable, PipeTransform } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { debounceTime, delay, switchMap, tap } from "rxjs/operators";
import { SortDirection, SortColumn } from "./ticket-sortable.directive";
import { ticketData } from "./ticket-data";
import { Ticket } from "src/app/core/models/ticket.model";
import { TicketService } from "src/app/service/ticket.service";

interface SearchResult {
  tables: Ticket[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
}

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

/**
 * Sort the table data
 * @param Table field value
 * @param column Fetch the column
 * @param direction Sort direction Ascending or Descending
 */
function sort(
  tables: Ticket[],
  column: SortColumn,
  direction: string
): Ticket[] {
  if (direction === "" || column === "") {
    return tables;
  } else {
    return [...tables].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === "asc" ? res : -res;
    });
  }
}

/**
 * Table Data Match with Search input
 * @param  Table field value fetch
 * @param term Search the value
 */
function matches(table: Ticket, term: string, pipe: PipeTransform) {
  return (
    table.CATEGORY.toLowerCase().includes(term) ||
    table.STATUS.toLowerCase().includes(term) ||
    table.DUE_DATE.includes(term) ||
    table.CREATE_DATE.toLowerCase().includes(term) ||
    table.LOG.toLowerCase().includes(term) ||
    table.HEADLINE.toLowerCase().includes(term) ||
    table.CURRENT_HANDLER_USER_ID.toLowerCase().includes(term) ||
    table.TICKET_ID.includes(term) ||
    table.DETAIL.toLowerCase().includes(term) ||
    table.OPENER_USER_ID.toLowerCase().includes(term) ||
    table.CONTRACT_NO.includes(term) ||
    table.METER.includes(term)
  );
}

@Injectable({
  providedIn: "root",
})
export class TicketServiceticket {
  // tslint:disable-next-line: variable-name
  private _loading$ = new BehaviorSubject<boolean>(true);
  // tslint:disable-next-line: variable-name
  private _search$ = new Subject<void>();
  // tslint:disable-next-line: variable-name
  private _tables$ = new BehaviorSubject<Ticket[]>([]);
  // tslint:disable-next-line: variable-name
  private _total$ = new BehaviorSubject<number>(0);
  // tslint:disable-next-line: variable-name
  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: "",
    sortColumn: "",
    sortDirection: "",
    startIndex: 0,
    endIndex: 9,
    totalRecords: 0,
  };
  tickets: Ticket[] = [];
  constructor(private pipe: DecimalPipe, private ticketService: TicketService) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search(this.tickets)),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._tables$.next(result.tables);
        this._total$.next(result.total);
      });
    this._search$.next();
  }

  /**
   * Returns the value
   */
  get tables$() {
    return this._tables$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  get startIndex() {
    return this._state.startIndex;
  }
  get endIndex() {
    return this._state.endIndex;
  }
  get totalRecords() {
    return this._state.totalRecords;
  }

  /**
   * set the value
   */
  // tslint:disable-next-line: adjacent-overload-signatures
  set page(page: number) {
    this._set({ page });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  // tslint:disable-next-line: adjacent-overload-signatures
  set startIndex(startIndex: number) {
    this._set({ startIndex });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  set endIndex(endIndex: number) {
    this._set({ endIndex });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  set totalRecords(totalRecords: number) {
    this._set({ totalRecords });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }
  set setTables(tickets: Ticket[]) {
    this._set_tables(tickets);
  }

  private _set_tables(tickets: Ticket[]) {
    this.tickets = tickets;
  }
  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  /**
   * Search Method
   */
  private _search(tickets: Ticket[]): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    // 1. sort
    let tables = sort(tickets, sortColumn, sortDirection);

    // 2. filter
    tables = tables.filter((table) => matches(table, searchTerm, this.pipe));
    const total = tables.length;

    // 3. paginate
    this.totalRecords = tables.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    tables = tables.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({ tables, total });
  }
}
