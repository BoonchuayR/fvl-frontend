import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-topup-list',
  templateUrl: './topup-list.component.html',
  styleUrls: ['./topup-list.component.scss']
})
export class TopupListComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
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
}
