import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Topup } from 'src/app/core/models/topup.model';
import { TopupService } from 'src/app/service/topup.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-topup-list',
  templateUrl: './topup-list.component.html',
  styleUrls: ['./topup-list.component.scss']
})
export class TopupListComponent implements OnInit {
  topups!: any

  constructor(
    private modalService: NgbModal,
    private topupService: TopupService) { }

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
    console.log("download csv...")
    // const rows = [
    //   ["name1", "city1", "some other info"],
    //   ["name2", "city2", "more info"]
    // ];

    const rows = this.topups.map((tu: Topup) => {
      return [tu.createdAt, tu.custName || " ", tu.topupMoney, tu.statusName]
    })
  
    let csvContent = "data:text/csv;charset=utf-8,";
    
    rows.forEach(function(rowArray: any) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  }
}
