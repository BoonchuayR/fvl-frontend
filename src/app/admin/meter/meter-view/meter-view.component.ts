import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IotService } from "src/app/service/iot.service";
import { MeterService } from "src/app/service/meter.service";
import { ChartType } from "./dashboard.model";
import { linewithDataChart } from "./data";
import { pipe } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from "moment";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
function getFirstDayOfMonth(year: any, month: any) {
  return new Date(year, month, 1);
}
function getLastDayOfMonth(year: any, month: any) {
  return  new Date(year, month+1, 0);
}
@Component({
  selector: "app-meter-view",
  templateUrl: "./meter-view.component.html",
  styleUrls: ["./meter-view.component.scss"],
})
export class MeterViewComponent implements OnInit {
  linewithDataChart!: ChartType;
  dashedLineChart!: ChartType;
  splineAreaChart!: ChartType;
  basicColumChart!: ChartType;
  columnlabelChart!: ChartType;
  barChart!: ChartType;
  lineColumAreaChart!: ChartType;
  candlestickChart!: ChartType;
  timelinechart!: ChartType;
  basictimelinechart!: ChartType;
  piechart!: ChartType;
  donutchart!: ChartType;
  radialchart!: ChartType;
  radialbarchart!: ChartType;
  radarchart!: ChartType;
  multipleradarchart!: ChartType;
  basicpolarchart!: ChartType;
  polarchart!: ChartType;
  simpleBubbleChart!: ChartType;
  basicScatterChart!: ChartType;
  basicHeatmapChart!: ChartType;
  basicTreemapChart!: ChartType;

  meterId: any;
  meter: any;
  DayList: boolean = true;
  MonthList: boolean = false;
  YearList: boolean = false;
  dayList: any;
  monthList: any;
  yearList: any;
  getInputDay: any;
  getInputMonth: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meterService: MeterService,
    private iotService: IotService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    // let now = moment().format("DD.MM.YYYY");
    this.meterId = this.route.snapshot.params["id"];
    this.meterService.get(this.meterId).subscribe((meter) => {
      this.meter = meter;
      // console.log("res meter >>>>", this.meter);
      // this.fetchData();
    });
    this.graphOfDay();
    this.linewithDataChart = linewithDataChart;
  }

  onBtnBackClicked(): void {
    this.router.navigate([`/meter-dashboard`]);
  }

  searchDay() {
    var a: any, b: any;
    a = this.getInputDay.slice(0, 10);
    b = this.getInputDay.slice(14, 24);
    this.fetchDay(a, b);
  }
  searchMonth() {
    var a: any, b: any, c: any,d:any,start:any,end:any;
    c = this.getInputMonth.slice(6, 7);
    d = this.getInputMonth.slice(0,4);
    const firstDay = getFirstDayOfMonth(d, c)+"";
    const lastDayCurrentMonth = getLastDayOfMonth(
      d,c
    )+"";
    start = firstDay.slice(9,10);
    end = lastDayCurrentMonth.slice(8,10);
    a = d+"."+c+"."+start;
    b = d+"."+c+"."+end
    this.fetchMonth(a, b);
    if(+c>=10){
      this.getInputMonth = d+"-"+c;
    }else{
      this.getInputMonth = d+"-0"+c;
    }
  }

  graphOfDay() {
    var now: any, date: any;
    now = moment().format("YYYY.MM.DD");
    date = new NgbDate(moment().year(), moment().month() + 1, moment().date());
    var current =
      date.year +
      "-" +
      date.month +
      "-" +
      date.day +
      " to " +
      date.year +
      "-" +
      date.month +
      "-" +
      Number(date.day + 1);
    this.getInputDay = current;
    // console.log(this.getInputDay);
    this.DayList = true;
    this.MonthList = false;
    this.YearList = false;
    this.searchDay();
  }

  graphOfMonth() {
    var now = moment().format("YYYY.MM.DD");
    this.getInputMonth = now;
    this.DayList = false;
    this.MonthList = true;
    this.YearList = false;
    this.searchMonth();
  }

  graphOfYear() {
    this.DayList = false;
    this.MonthList = false;
    this.YearList = true;
    this.fetchYear();
  }

  private fetchData() {
    this.iotService.meterReport(this.meter.storeId).subscribe((res: any) => {
      const meterData = res.DATA;
      this.linewithDataChart.series = [
        {
          name: "Line Voltage",
          data: meterData.map((m: any) => {
            return m.LINE_VOLTAGE;
          }),
        },
      ];

      this.linewithDataChart.xaxis = {
        categories: meterData.map((m: any) => {
          return m.TIMESTAMP;
        }),
        title: {
          text: "Time",
        },
      };
    });

    this.linewithDataChart.yaxis = {
      title: {
        text: "Volt",
      },
      min: 190,
      max: 240,
    };
  }

  fetchDay(start: any, end: any) {
    this.spinner.show();
    this.meterService.get(this.meterId).subscribe((meter) => {
      this.meter = meter;
      this.meterService
        .fetchDayGraph(this.meter.deviceId, start, end)
        .subscribe((res) => {
          if (res) {
            this.spinner.hide();
          }
          var data: any;
          // console.log(res);
          data = res;
          this.dayList = data.DATA_RESPONSE[0].HOURLY_DATA;
          var days: any = [];

          var cateDays: any = [];
          for (let i = 0; i < 31; i++) {
            if (this.dayList[i]) {
              days.push(this.dayList[i]);
              cateDays.push(days.length);
            }
          }

          this.linewithDataChart.series = [
            {
              name: "Active Energy",
              data: days.map((res: any) => {
                // console.log("res.ACTIVE_ENERGY >>> ", res.ACTIVE_ENERGY);
                let num1 = +res.ACTIVE_ENERGY;
                return num1.toFixed(2);
              }),
            },
          ];
          // console.log(this.linewithDataChart.series);
          this.linewithDataChart.xaxis = {
            categories: cateDays,
            title: {
              text: "วันที่",
            },
          };
          this.linewithDataChart.yaxis = {
            title: {
              text: "Active Energy",
            },
          };
          // console.log(this.linewithDataChart.yaxis);
        });
    });
  }

  fetchMonth(start: any, end: any) {
    this.spinner.show();
    this.meterService.get(this.meterId).subscribe((meter) => {
      this.meter = meter;
      this.meterService
        .fetchMonthGraph(this.meter.deviceId, start, end)
        .subscribe((resp) => {
          if (resp) {
            this.spinner.hide();
          }
          var data: any;
          // console.log(resp);
          data = resp;
          this.monthList = data.DATA_RESPONSE[0].DATA;
          var month: any = [];
          var cateMonth: any = [];
          for (let i = 0; i <= 12; i++) {
            if (this.monthList[i]) {
              month.push(this.monthList[i]);
              cateMonth.push(month.length);
            }
          }
          // console.log(month);
          // console.log(cateMonth);
          this.linewithDataChart.series = [
            {
              name: "Active Energy",
              data: month.map((res: any) => {
                let num1 = +res.AVG_ACTIVE_ENERGY;
                num1.toFixed(0);
                return num1.toFixed(2);
              }),
            },
          ];
          // console.log(this.linewithDataChart.series);
          this.linewithDataChart.xaxis = {
            categories: cateMonth,
            title: {
              text: "เดือน",
            },
          };
          // console.log(this.linewithDataChart.xaxis);
          this.linewithDataChart.yaxis = {
            title: {
              text: "Active Energy",
            },
          };
          // console.log(this.linewithDataChart.yaxis);
        });
    });
  }

  fetchYear() {
    this.spinner.show();
    this.meterService.get(this.meterId).subscribe((meter) => {
      this.meter = meter;
      this.meterService
        .fetchYearGraph(this.meter.deviceId)
        .subscribe((response) => {
          if (response) {
            this.spinner.hide();
          }
          var data: any;
          // console.log(response);
          data = response;
          this.yearList = data.DATA_RESPONSE[0].DATA;
          var year: any = [];
          var cateYear: any = [];
          for (let i = 2000; i < 2050; i++) {
            if (this.yearList[i]) {
              year.push(this.yearList[i]);
              cateYear.push(year.length);
            }
          }
          this.linewithDataChart.series = [
            {
              name: "Active Energy",
              data: year.map((res: any) => {
                let num1 = +res.AVG_ACTIVE_ENERGY;
                return num1.toFixed(2);
              }),
            },
          ];
          // console.log(this.linewithDataChart.series);
          this.linewithDataChart.xaxis = {
            categories: cateYear,
            title: {
              text: "ปี",
            },
          };
          this.linewithDataChart.yaxis = {
            title: {
              text: "Active Energy",
            },
          };
          // console.log(this.linewithDataChart.yaxis);
        });
    });
  }
}
