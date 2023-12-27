import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IotService } from "src/app/service/iot.service";
import { MeterService } from "src/app/service/meter.service";
import { ChartType } from "./dashboard.model";
import { linewithDataChart } from "./data";
import { pipe } from "rxjs";

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meterService: MeterService,
    private iotService: IotService
  ) {}

  ngOnInit(): void {
      this.fetchDay();
    this.meterId = this.route.snapshot.params["id"];
    this.meterService.get(this.meterId).subscribe((meter) => {
      this.meter = meter;
      // this.fetchData();
    });

    this.linewithDataChart = linewithDataChart;
  }

  onBtnBackClicked(): void {
    this.router.navigate([`/meter-dashboard`]);
  }

  graphOfDay() {
    this.DayList = true;
    this.MonthList = false;
    this.YearList = false;
    this.fetchDay();
  }
  graphOfMonth() {
    this.DayList = false;
    this.MonthList = true;
    this.YearList = false;
    this.fetchMonth();
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

  fetchDay() {
    this.meterService.fetchDayGraph().subscribe((res) => {
      var data: any;
      console.log(res);
      data = res;
      this.dayList = data.DATA_RESPONSE[0].HOURLY_DATA;
      var days: any = [];
      var cateDays:any = [];
      for (let i = 0; i < 31; i++) {
        if(this.dayList[i]){
         days.push(this.dayList[i]); 
         cateDays.push(days.length)
        }
      }
      var maxRate:any=[];
      maxRate = days.sort((a:any,b:any)=>{
        if(+a.ACTIVE_ENERGY>+b.ACTIVE_ENERGY){
          return -1;
        }
        return 1;
        })
      console.log(maxRate);
      this.linewithDataChart.series = [
        {
          name: "Line Voltage",
          data:
            days.map((res:any)=>{
              return res.ACTIVE_ENERGY;
            })
        },
      ];
      console.log(this.linewithDataChart.series);
      this.linewithDataChart.xaxis = {
        categories: cateDays,
        title: {
          text: "Time",
        },
      };
      this.linewithDataChart.yaxis = {
        title: {
          text: "Volt",
        },
        min: 0,
        max: +maxRate[0].ACTIVE_ENERGY,
      };
      console.log(this.linewithDataChart.yaxis)
    });
  }


  fetchMonth() {
    this.meterService.fetchMonthGraph().subscribe((resp) => {
      var data: any;
      console.log(resp);
      data = resp;
      this.monthList = data.DATA_RESPONSE[0].DATA;
      var month: any = [];
      var cateMonth:any = [];
      for (let i = 0; i <= 12; i++) {
        if(this.monthList[i]){
          month.push(this.monthList[i]); 
          cateMonth.push(month.length)
        }
      }
      console.log(month);
      console.log(cateMonth);
      var maxRate:any=[];
      maxRate = month.sort((a:any,b:any)=>{
        if(+a.AVG_ACTIVE_ENERGY>+b.AVG_ACTIVE_ENERGY){
          return -1;
        }
        return 1;
        })
      console.log(maxRate);
      this.linewithDataChart.series = [
        {
          name: "Line Voltage",
          data:
          month.map((res:any)=>{
              return res.AVG_ACTIVE_ENERGY;
            })
        },
      ];
      console.log(this.linewithDataChart.series);
      this.linewithDataChart.xaxis = {
        categories: cateMonth,
        title: {
          text: "Time",
        },
      };
      console.log(this.linewithDataChart.xaxis)
      this.linewithDataChart.yaxis = {
        title: {
          text: "Volt",
        },
        min: 0,
        max: +maxRate[0].AVG_ACTIVE_ENERGY,
      };
      console.log(this.linewithDataChart.yaxis)
    });
  }
  fetchYear() {
    this.meterService.fetchYearGraph().subscribe((response) => {
      var data: any;
      console.log(response);
      data = response;
      this.yearList = data.DATA_RESPONSE[0].DATA;
      var year: any = [];
    var cateYear:any = [];
    for (let i = 2000; i < 2050; i++) {
      if(this.yearList[i]){
        year.push(this.yearList[i]); 
        cateYear.push(year.length)
      }
    }
    var maxRate:any=[];
    maxRate = year.sort((a:any,b:any)=>{
      if(+a.AVG_ACTIVE_ENERGY>+b.AVG_ACTIVE_ENERGY){
        return -1;
      }
      return 1;
      })
    console.log(maxRate);
    this.linewithDataChart.series = [
      {
        name: "Line Voltage",
        data:
        year.map((res:any)=>{
            return res.AVG_ACTIVE_ENERGY;
          })
      },
    ];
    console.log(this.linewithDataChart.series);
    this.linewithDataChart.xaxis = {
      categories: cateYear,
      title: {
        text: "Time",
      },
    };
    this.linewithDataChart.yaxis = {
      title: {
        text: "Volt",
      },
      min: 0,
      max: +maxRate[0].AVG_ACTIVE_ENERGY,
    };
    console.log(this.linewithDataChart.yaxis)
    });
  }
}
