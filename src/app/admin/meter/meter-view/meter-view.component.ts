import { Component, OnInit } from "@angular/core";
import { MeterService } from "src/app/core/services/meter.service";

@Component({
  selector: "app-meter-view",
  templateUrl: "./meter-view.component.html",
  styleUrls: ["./meter-view.component.scss"],
})
export class MeterViewComponent implements OnInit {
  constructor(private meterService: MeterService) {}

  ngOnInit(): void {
    this.meterService.hello().subscribe((res) => {
      console.log("res: ", res);
    });

    this.meterService.getAllMeters().subscribe((res) => {
      console.log("res: ", res);
    });

    this.meterService.updatMeterState(1).subscribe((res) => {
      console.log("res: ", res);
    });
  }
}
