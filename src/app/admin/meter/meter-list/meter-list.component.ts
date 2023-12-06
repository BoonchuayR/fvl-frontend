import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { Meter } from 'src/app/core/models/meter.model';
import { MeterSortableDirective, SortEventMeter } from './meter-list-sortable.directive';
import { MeterService } from 'src/app/service/meter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IotService } from 'src/app/service/iot.service';
import { MeterServicemeter } from './meter-list-datatable.service';
import Swal from 'sweetalert2';
import { DecimalPipe } from '@angular/common';
import { ShopService } from 'src/app/service/shop.service';
import { map } from 'rxjs/operators';
import { CustomerService } from 'src/app/service/customer.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-meter-dashboard',
  templateUrl: './meter-list.component.html',
  styleUrls: ['./meter-list.component.scss'],
  providers: [MeterServicemeter, DecimalPipe]
})
export class MeterListComponent implements OnInit {
  [x: string]: any;
  nameExcel:any;
  ExcelDATA:any=[];
  importdata:any=[];
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
    public service:MeterServicemeter    ) { 
      this.tables$ = service.tables$;
      this.total$ = service.total$;
    }

  ngOnInit(): void {
   this.changeValue(this.meterstate);
  }

  getData(){
    this.meterService.getInfo().subscribe((data: string)=>{
      const list = data.split('\n');
      list.forEach((e: any)=>{
        this.importdata.push(e);
        // console.log("importdata",this.importdata);
      })
    })
  }

  topupModal(topup: any) {
    this.modalService.open(topup, { backdrop: 'static', keyboard: false, centered: true, windowClass: 'modal-holder' });
  }

  async ReadExcel(event:any){
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = ()=>{
      var workBook = XLSX.read(fileReader.result,{type:'binary'});
      var sheetNames = workBook.SheetNames;
      this.ExcelDATA = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      // console.log("Excel DATA >>> ",this.ExcelDATA);
    }
  }

  changeValue(event:any){
    if(this.meterstate == 0){
      this.meterService.getAll()
      .subscribe(meters => {
        this.meters = meters;
        this.service.meters = this.meters;
        // this.meters = this.meters.map((meter: any) => {

        //   this.shopService.findByStoreId(meter.storeId).subscribe(shops => {
        //     if (shops && shops.length > 0) {
        //       meter.shopName = shops[0].boothName;
        //       meter.custName = shops[0].custName;
        //     }
        //     return meter
        //   });

        // });

      })
    } else if(this.meterstate == 1){
      this.meterService.findMeterByStatus("1").subscribe(meters => {
        this.meters = meters;
        this.service.meters = this.meters;
        this.meterstate = event.target.value;
        // this.meters = this.meters.map((meter: any) => {

        //   this.shopService.findByStoreId(meter.storeId).subscribe(shops => {
        //     if (shops && shops.length > 0) {
        //       meter.shopName = shops[0].boothName;
        //       meter.custName = shops[0].custName;
        //     }
        //     return meter
        //   });

        // });
        // console.log(" this.meters >>> ", this.meters);
        // console.log("meterstate >>> ", this.meterstate);
      })
    } else {
         this.meterService.findMeterByStatus("0").subscribe(meters => {
        this.meters = meters;
        this.service.meters = this.meters;
        this.meterstate = event.target.value;
        // this.meters = this.meters.map((meter: any) => {

        //   this.shopService.findByStoreId(meter.storeId).subscribe(shops => {
        //     if (shops && shops.length > 0) {
        //       meter.shopName = shops[0].boothName;
        //       meter.custName = shops[0].custName;
        //     }
        //     return meter
        //   });

        // });
        // console.log("meterstate >>> ", this.meterstate);
        // console.log(" this.meters >>> ", meters);
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

  changMeterState(event: any, boothId: any, id: any, meter: any) {
    const isChecked = event.target.checked;
    Swal.fire({
      title: `${isChecked ? "ยืนยันการเปิดมิเตอร์":"ยืนยันการปิดมิเตอร์"}`,
      text: `${isChecked ? "คุณต้องการ เปิด มิเตอร์นี้ใช่หรือไม่?":"คุณต้องการ เปิด / ปิด มิเตอร์นี้ใช่หรือไม่?"}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'ใช่, ต้องการ!',
      cancelButtonText: 'ไม่, ยกเลิก!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.iotService.meterUpdateState(boothId, isChecked ? "1" : "2").subscribe(() => {
          meter.meterState = isChecked ? "1" : "2"
          this.meterService.update(meter).then(() => {
            // console.log("ตกลง")
          }).catch(() => {
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
      }else if (!result.isConfirmed) {
      // console.log("ยกเลิก")
      window.location.reload();
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
      if (result.isConfirmed) {
        this.meterService.delete(id).then(() => {
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

  import() {
    // console.log("import >>>")
    
    const booth_list = [
      "A001",
      "A002",
      "A003",
      "A004",
      "A005",
      "A006",
      "A007",
      "A008",
      "A009",
      "A010",
      "A011",
      "A012",
      "A013",
      "A014",
      "A015",
      "A016",
      "A017",
      "A018",
      "A019",
      "A020",
      "A021",
      "A022",
      "A023",
      "A024",
      "A025",
      "A026",
      "A027",
      "A028",
      "A029",
      "A030",
      "A031",
      "A032",
      "A033",
      "A034",
      "A035",
      "A036",
      "A037",
      "A038",
      "A039",
      "A040",
      "A041",
      "A042",
      "A043",
      "A044",
      "A045",
      "A046",
      "A047",
      "A048",
      "A049",
      "A050",
      "A051",
      "A052",
      "A053",
      "A054",
      "A055",
      "A056",
      "A057",
      "A058",
      "A059",
      "A060",
      "A061",
      "A062",
      "A063",
      "A064",
      "A065",
      "A066",
      "A067",
      "A068",
      "A069",
      "A070",
      "A071",
      "A072",
      "A073",
      "A074",
      "A075",
      "A076",
      "A077",
      "A078",
      "A079",
      "A080",
      "A081",
      "A082",
      "A083",
      "A084",
      "A085",
      "A086",
      "A087",
      "A088",
      "A089",
      "A090",
      "A091",
      "A092",
      "A093",
      "A094",
      "A095",
      "A096",
      "A097",
      "A098",
      "A099",
      "A100",
      "A101",
      "A102",
      "A103",
      "A104",
      "A105",
      "A106",
      "A107",
      "A108",
      "A109",
      "A110",
      "A111",
      "A112",
      "A113",
      "A114",
      "A115",
      "A116",
      "A117",
      "A118",
      "A119",
      "A120",
      "B001",
      "B002",
      "B003",
      "B004",
      "B005",
      "B006",
      "B007",
      "B008",
      "B009",
      "B010",
      "B011",
      "B012",
      "B013",
      "B014",
      "B015",
      "B016",
      "B017",
      "B018",
      "B019",
      "B020",
      "B021",
      "B022",
      "B023",
      "B024",
      "C001",
      "C002",
      "C003",
      "C004",
      "C005",
      "C006",
      "C007",
      "C008",
      "C009",
      "C010",
      "C011",
      "C012",
      "C013",
      "C014",
      "C015",
      "C016",
      "C017",
      "C018",
      "C019",
      "C020",
      "C021",
      "C022",
      "C023",
      "C024",
      "C025",
      "C026",
      "C027",
      "C028",
      "D001",
      "D002",
      "D003",
      "D004",
      "D005",
      "D006",
      "D007",
      "D008",
      "D009",
      "D010",
      "D011",
      "D012",
      "D013",
      "D014",
      "D015",
      "D016",
      "D017",
      "D018",
      "D019",
      "D020",
      "D021",
      "D022",
      "D023",
      "D024",
      "D025",
      "D026",
      "D027",
      "D028",
      "D029",
      "D030",
      "D031",
      "D032",
      "D033",
      "D034",
      "D035",
      "D036",
      "D037",
      "D038",
      "D039",
      "D040",
      "D041",
      "D042",
      "D043",
      "D044",
      "D045",
      "D046",
      "D047",
      "D048",
      "D049",
      "D050",
      "D051",
      "D052",
      "D053",
      "D054",
      "D055",
      "D056",
      "D057",
      "D058",
      "D059",
      "D060",
      "D061",
      "D062",
      "D063",
      "D064",
      "D065",
      "D066",
      "D067",
      "D068",
      "D069",
      "D070",
      "D071",
      "D072",
      "D073",
      "D074",
      "D075",
      "D076",
      "D077",
      "D078",
      "D079",
      "D080",
      "D081",
      "D082",
      "D083",
      "D084",
      "D085",
      "D086",
      "D087",
      "D088",
      "D089",
      "D090",
      "D091",
      "D092",
      "D093",
      "D094",
      "D095",
      "D096",
      "D097",
      "D098",
      "D099",
      "D100",
      "D101",
      "D102",
      "D103",
      "D104",
      "D105",
      "D106",
      "D107",
      "D108",
      "D109",
      "D110",
      "D111",
      "D112",
      "D113",
      "D114",
      "D115",
      "D116",
      "D117",
      "D118",
      "D119",
      "D120",
      "E001",
      "E002",
      "E003",
      "E004",
      "E005",
      "E006",
      "E007",
      "E008",
      "E009",
      "E010",
      "E011",
      "E012",
      "E013",
      "E014",
      "E015",
      "E016",
      "E017",
      "E018",
      "E019",
      "E020",
      "E021",
      "E022",
      "E023",
      "E024",
      "E025",
      "E026",
      "E027",
      "E028",
      "E029",
      "E030",
      "E031",
      "E032",
      "E033",
      "E034",
      "E035",
      "E036",
      "E037",
      "E038",
      "E039",
      "E040",
      "E041",
      "E042",
      "E043",
      "E044",
      "E045",
      "E046",
      "E047",
      "E048",
      "E049",
      "E050",
      "E051",
      "E052",
      "E053",
      "E054",
      "E055",
      "E056",
      "E057",
      "E058",
      "E059",
      "E060",
      "E061",
      "E062",
      "E063",
      "E064",
      "E065",
      "E066",
      "E067",
      "E068",
      "E069",
      "E070",
      "E071",
      "E072",
      "E073",
      "E074",
      "E075",
      "E076",
      "E077",
      "E078",
      "E079",
      "E080",
      "E081",
      "E082",
      "E083",
      "E084",
      "E085",
      "E086",
      "E087",
      "E088",
      "E089",
      "E090",
      "E091",
      "E092",
      "E093",
      "E094",
      "E095",
      "E096",
      "E097",
      "E098",
      "E099",
      "E100",
      "E101",
      "E102",
      "E103",
      "E104",
      "E105",
      "E106",
      "E107",
      "E108",
      "E109",
      "E110",
      "E111",
      "E112",
      "E113",
      "E114",
      "E115",
      "E116",
      "E117",
      "E118",
      "E119",
      "E120",
      "PC338",
      "PC339",
      "PC340",
      "Z022",
    ];

    for( let i = 0; i < booth_list.length; i++) {
      // console.log("booth_id: ", booth_list[i])
      this.iotService.meterSelectByBoothId(booth_list[i]).subscribe((iotMeter: any) => {
        // console.log("iotMeter: ", iotMeter);
        const meter: Meter = {
          id: "",
          boothId: iotMeter.DATA_RESPONSE[0].BOOTH_ID,
          deviceZone: iotMeter.DATA_RESPONSE[0].DEVICE_ZONE,
          deviceId: iotMeter.DATA_RESPONSE[0].DEVICE_ID,
          serialNo: iotMeter.DATA_RESPONSE[0].SERIAL_NO,
          slaveId: iotMeter.DATA_RESPONSE[0].SLAVE_ID,
          modelSpec: iotMeter.DATA_RESPONSE[0].MODEL_SPEC,
          lineVoltage: iotMeter.DATA_RESPONSE[0].LINE_VOLTAGE,
          lineFrequency: iotMeter.DATA_RESPONSE[0].LINE_FREQUENCY,
          lineCurrent: iotMeter.DATA_RESPONSE[0].LINE_CURRENT,
          activePower: iotMeter.DATA_RESPONSE[0].ACTIVE_POWER,
          activeEnergy: iotMeter.DATA_RESPONSE[0].ACTIVE_ENERGY,
          contractId: "",
          meterState: iotMeter.DATA_RESPONSE[0].METER_STATE,
          updateDatetime: iotMeter.DATA_RESPONSE[0].UPDATE_DATETIME,
          updateStateDatetime: iotMeter.DATA_RESPONSE[0].UPDATE_STATE_DATETIME,
          meterStateAdmin: iotMeter.DATA_RESPONSE[0].METER_STATE_ADMIN,
          updateStateAdminDatetime: iotMeter.DATA_RESPONSE[0].UPDATE_STATE_ADMIN_DATETIME,
          shopName: "",
          custName: "",
          lineActiveEnergy: '',
          uid: ""
        }
        this.meterService.create(meter).then(res => {
          // console.log("create meter result: ", res);
        });
      });
    }
  }

}
