import { Component, OnInit, ViewChild } from '@angular/core';
import { emailSentBarChart, monthlyEarningChart } from '../data';
import { ChartType } from '../profile.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  emailSentBarChart!: ChartType;
  monthlyEarningChart!: ChartType;

  @ViewChild('content') content: any;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Profile', active: true }
    ];

    /**
 * Fetches the data
 */
    this.fetchData();
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.openModal();
  //   }, 2000);
  // }


  /**
   * Fetches the data
   */
  private fetchData() {
    this.emailSentBarChart = emailSentBarChart;
    this.monthlyEarningChart = monthlyEarningChart;

  }

  /***
   * Subscribe Model open
   */
  openModal() {
    this.modalService.open(this.content, { centered: true });
  }

  /**
 * Open scroll modal
 * @param staticDataModal scroll modal data
 */
  repairModal(repair: any) {
    this.modalService.open(repair, { backdrop: 'static', keyboard: false, centered: true, windowClass: 'modal-holder' });
  }

  /**
* Open scroll modal
* @param staticDataModal scroll modal data
*/
  topupModal(topup: any) {
    this.modalService.open(topup, { backdrop: 'static', keyboard: false, centered: true, windowClass: 'modal-holder' });
  }

  /**
   * cancel sweet alert
   * @param cancel modal content
   */
  cancel() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'กดสวิตช์มิเตอร์',
        text: "คุณต้องการที่กดสวิตช์มิเตอร์?",
        icon: 'warning',
        confirmButtonText: 'ต้องการ',
        cancelButtonText: 'ไม่ต้องการ',
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            'สำเร็จ!',
            'ได้ทำการกดสวิตช์มิเตอร์เรียบร้อยแล้ว.',
            'success'
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'ยกเลิก',
            'ยกเลิกการกดสวิตช์มิเตอร์ :)',
            'error'
          );
        }
      });
  }

}
