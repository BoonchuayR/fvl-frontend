import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Topup } from 'src/app/core/models/topup.model';
import { TopupService } from 'src/app/service/topup.service';
import Swal from 'sweetalert2';
import { AdvancedServicetopup } from './topup-datatable.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { AdvancedSortableDirective } from './topup-sortable.directive';

@Component({
  selector: 'app-topup-list',
  templateUrl: './topup-list.component.html',
  styleUrls: ['./topup-list.component.scss'],
  providers: [AdvancedServicetopup, DecimalPipe]
})
export class TopupListComponent implements OnInit {
  tableData!: Topup[];
  hideme: boolean[] = [];
  tables$: Observable<Topup[]>;
  total$: Observable<number>;
  @ViewChildren(AdvancedSortableDirective)
  headers!: QueryList<AdvancedSortableDirective>;
  
  topups!: any
  reportDate!: string

  constructor(
    private modalService: NgbModal,
    private topupService: TopupService,public service:AdvancedServicetopup) {
      this.tables$ = service.tables$;
      this.total$ = service.total$;
     }

  ngOnInit(): void {
    this.topupService.getAll().subscribe(topups => {
      this.topups = topups;
      console.log("topups: ", this.topups)
    })
  }

  /**
   * Confirm sweet alert
   * @param confirm modal content
   */
   confirm(id: string) {
    Swal.fire({
      title: 'ลบข้อมูลเติมเงิน',
      text: "คุณต้องการลบข้อมูลการเติมเงินใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'ใช่, ต้องการ!',
      cancelButtonText: 'ไม่, ยกเลิก!',
    }).then((result) => {
      console.log(id)
      if (result.value) {
        this.topupService.delete(id).then(deletedTopup => {
          console.log(deletedTopup);
        })
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'ลบข้อมูลเติมเงินเรียบร้อย',
          showConfirmButton: false,
          timer: 3000
        })
      }
    });
  }

  /**
* Open scroll modal
* @param staticDataModal scroll modal data
*/
  topupModal(topup: any) {
    this.modalService.open(topup, { backdrop: 'static', keyboard: false, centered: true, windowClass: 'modal-holder' });
  }

    /**
* Open scroll modal
* @param staticDataModal scroll modal data
*/
  printModal(print: any) {
    this.modalService.open(print, { backdrop: 'static', keyboard: false, centered: true, windowClass: 'modal-holder' });
  }

  dowloadCsv() {
    let startDate: string = "";
    let endDate: string = "";
    
    if (this.reportDate) {
      startDate = this.reportDate.substring(0,10);
      endDate = this.reportDate.substring(this.reportDate.length - 10)
    }
    
    let rows = this.topups.map((tu: Topup) => {
      if (tu.createdAt! >= startDate && tu.createdAt! <= endDate) {
        return [tu.createdAt, tu.custName || " ", tu.topupMoney, tu.statusName]
      }
      return;
    });

    rows = rows.filter((r:any) => {
      if (r) {
        return true;
      }
      return false;
    });

    let csvContent = "data:text/csv;charset=utf-8,";
    
    rows.forEach(function(rowArray: any) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  }
}
