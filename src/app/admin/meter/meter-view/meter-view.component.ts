import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IotService } from 'src/app/service/iot.service';
import { MeterService } from 'src/app/service/meter.service';
import { ChartType } from './dashboard.model';
import { linewithDataChart } from './data';

@Component({
  selector: 'app-meter-view',
  templateUrl: './meter-view.component.html',
  styleUrls: ['./meter-view.component.scss']
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meterService: MeterService,
    private iotService: IotService
  ) { }

  ngOnInit(): void {
    
    this.meterId = this.route.snapshot.params["id"];
    this.meterService.get(this.meterId).subscribe(meter => {
      this.meter = meter;
      this.fetchData();
    })
    
    this.linewithDataChart = linewithDataChart; 
  }

  onBtnBackClicked(): void{
    this.router.navigate([`/meter-list/${this.meter.zone}`]);
  }

  private fetchData() {

    this.iotService.meterReport(this.meter.storeId).subscribe((res: any) => {
      const meterData = res.DATA;
      this.linewithDataChart.series = [
        {
          name: 'Line Voltage',
          data: meterData.map((m: any) => { return m.LINE_VOLTAGE}),
        }
      ]

      this.linewithDataChart.xaxis = {
        categories: meterData.map((m: any) => { return m.TIMESTAMP }),
        title: {
          text: 'Time',
        },
      }
    });

    this.linewithDataChart.yaxis = {
      title: {
        text: 'Volt',
      },
      min: 200,
      max: 250,
    }

    // this.dashedLineChart = dashedLineChart;
    // this.splineAreaChart = splineAreaChart;
    // this.basicColumChart = basicColumChart;
    // this.columnlabelChart = columnlabelChart;
    // this.barChart = barChart;
    // this.lineColumAreaChart = lineColumAreaChart;
    // this.candlestickChart = candlestickChart;
    // this.timelinechart = timelinechart;
    // this.basictimelinechart = basictimelinechart;
    // this.piechart = piechart;
    // this.donutchart = donutchart;
    // this.radialchart = radialchart;
    // this.radialbarchart = radialbarchart;
    // this.radarchart = radarchart;
    // this.multipleradarchart = multipleradarchart;
    // this.basicpolarchart = basicpolarchart;
    // this.polarchart = polarchart;
    // this.simpleBubbleChart = simpleBubbleChart;
    // this.basicScatterChart = basicScatterChart;
    // this.basicHeatmapChart = basicHeatmapChart;
    // this.basicTreemapChart = basicTreemapChart;
  }

}
