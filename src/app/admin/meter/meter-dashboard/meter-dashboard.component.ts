import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { Meter } from 'src/app/core/models/meter.model';
import { MeterSortableDirective, SortEventMeter } from './meter-dashboard-sortable.directive';
import { MeterService } from 'src/app/service/meter.service';
import { ActivatedRoute } from '@angular/router';
import { IotService } from 'src/app/service/iot.service';
import { MeterServicemeter } from './meter-dashboard-datatable.service';
import Swal from 'sweetalert2';
import { DecimalPipe } from '@angular/common';
import { ShopService } from 'src/app/service/shop.service';
import { map } from 'rxjs/operators';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-meter-dashboard',
  templateUrl: './meter-dashboard.component.html',
  styleUrls: ['./meter-dashboard.component.scss'],
  providers: [MeterServicemeter, DecimalPipe]
})
export class MeterDashboardComponent implements OnInit {
  tableData!: Meter[];
  hideme: boolean[] = [];
  tables$: Observable<Meter[]>;
  total$: Observable<number>;
  @ViewChildren(MeterSortableDirective)
  headers!: QueryList<MeterSortableDirective>;
  meters!: any
  meterstate:any = 0;
  state:any;
  constructor(
    private meterService: MeterService,
    private iotService: IotService,
    private route: ActivatedRoute,
    public service:MeterServicemeter,
    private shopService: ShopService,
    private customerService: CustomerService
    ) { 
      this.tables$ = service.tables$;
      this.total$ = service.total$;
    }

  ngOnInit(): void {
   this.changeValue(this.meterstate);
  }

  changeValue(event:any){
    if(this.meterstate == 0){
      this.meterService.getAll()
      .subscribe(meters => {
        this.meters = meters;
        this.service.meters = this.meters;
        this.meters = this.meters.map((meter: any) => {

          this.shopService.findByStoreId(meter.storeId).subscribe(shops => {
            if (shops && shops.length > 0) {
              meter.shopName = shops[0].boothName;
              meter.custName = shops[0].custName;
            }
            return meter
          });

        });

      })
    }

    if(this.meterstate == 1){
      this.meterService.findMeterByStatus("1").subscribe(meters => {
        this.meters = meters;
        this.service.meters = this.meters;
        this.meterstate = event.target.value;
        console.log(" this.meters >>> ", this.meters);
        console.log("meterstate >>> ", this.meterstate);
      })
    }

    if(this.meterstate == 2){
         this.meterService.findMeterByStatus("0").subscribe(meters => {
        this.meters = meters;
        this.service.meters = this.meters;
        this.meterstate = event.target.value;
        console.log("meterstate >>> ", this.meterstate);
        console.log(" this.meters >>> ", this.meters);
      })
    }

  }

  onSort({ column, direction }: SortEventMeter) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortableMeter !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
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
      if (result.value) {
        this.iotService.meterUpdateState(storeId, isChecked ? "1" : "2").subscribe(res => {
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
      if (result.value) {
        this.meterService.delete(id).then(deletedMeter => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'ลบข้อมูลมิเตอร์เรียบร้อย',
            showConfirmButton: false,
            timer: 3000
          })
        })
      }
    });
  }

}
