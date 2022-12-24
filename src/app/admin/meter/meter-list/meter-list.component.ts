import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IotService } from 'src/app/service/iot.service';
import { MeterService } from 'src/app/service/meter.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meter-list',
  templateUrl: './meter-list.component.html',
  styleUrls: ['./meter-list.component.scss']
})
export class MeterListComponent implements OnInit {
  meters!: any

  constructor(
    private meterService: MeterService,
    private iotService: IotService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    // this.meterService.getAll().subscribe(meters => {
    //   this.meters = meters;
    // })
    
    const zone = this.route.snapshot.params["zone"];

    this.meterService.findMeterByZone(zone).subscribe(meters => {
      this.meters = meters;
    })
  }

  /**
   * Confirm sweet alert
   * @param confirm modal content
   */
  confirm(id: string) {
    Swal.fire({
      title: 'ลบข้อมูลมิเตอร์',
      text: "คุณต้องการลบข้อมูลมิเตอร์นี้ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'ใช่, ต้องการ!',
      cancelButtonText: 'ไม่, ยกเลิก!',
    }).then((result) => {
      console.log(id)
      if (result.value) {
        this.meterService.delete(id).then(deletedMeter => {
          console.log(deletedMeter);
        })
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'ลบข้อมูลมิเตอร์เรียบร้อย',
          showConfirmButton: false,
          timer: 3000
        })
      }
    });
  }

  changMeterState(event: any, storeId: any, id: any, meter: any) {
    const isChecked = event.target.checked;
    Swal.fire({
      title: `${isChecked ? "ยืนยันการเปิดมิเตอร์":"ยืนยันการปิดมิเตอร์"}`,
      text: "คุณต้องการลบข้อมูลมิเตอร์นี้ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'ใช่, ต้องการ!',
      cancelButtonText: 'ไม่, ยกเลิก!',
    }).then((result) => {
      console.log(id)
      if (result.value) {
        this.iotService.meterUpdateState(storeId, isChecked ? "1" : "2").subscribe(res => {
          console.log("meterUpdateState: ", res)
          meter.meterState = isChecked ? "1" : "2"
          this.meterService.update(meter).then(res => {

          }).catch(err => {
            console.log("error: ", id)
          });
        })
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${isChecked ? "เปิดมิเตอร์สำเร็จ":"ปิดมิเตอร์สำเร็จ"}`,
          showConfirmButton: false,
          timer: 3000
        })
      }
    });
  }
  
}