import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MeterService } from 'src/app/service/meter.service';

@Component({
  selector: 'app-meter-view',
  templateUrl: './meter-view.component.html',
  styleUrls: ['./meter-view.component.scss']
})
export class MeterViewComponent implements OnInit {

  meterId: any;
  meter: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meterService: MeterService) { }

  ngOnInit(): void {
    this.meterId = this.route.snapshot.params["id"];
    this.meterService.get(this.meterId).subscribe(meter => {
      this.meter = meter;
      console.log("meter: ", meter)
    })
  }

  onBtnBackClicked(): void{
    this.router.navigate([`/meter-list/${this.meter.zone}`]);
  }

}
