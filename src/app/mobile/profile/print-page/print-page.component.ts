import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-page',
  templateUrl: './print-page.component.html',
  styleUrls: ['./print-page.component.scss']
})
export class PrintPageComponent implements OnInit {

  @Input() printTopup: any;

  receiptInfo = {
    companyName: "ฟู้ดวิลล่า ราชพฤกษ์",
    branchName: "(สำนักงานใหญ่)",
    address1: "141/12 ชั้น 11 ยูนิต 128 อาคารชุด ",
    address2: "สกุลไทย สรวงค์ ทาวเวอร์ ถนนสรวงศ์",
    subDistrict: "แขวงสรวงศ์",
    district: "เขตบางรัก",
    province: "กรุงเทพมหานคร",
    postCode: "10500",
    taxId: "123456789000",
    telNo: "022374777",
    webSite: "www.example.com",
    formName: "ใบกำกับกำภาษีอย่างย่อ/ใบเสร็จรับเงิน",
    docNo: "CA201907001",
    saleName: "สมชาย ใจดี",
    date: "01/07/2019",
    detail: [
      {qty: "1", product: "Double A Copier Paper A4", price: "5,000.00"},
      {qty: "100", product: "Staples(24/Pack) Max 10-", price: "2,000.00"},
      {qty: "10", product: "Desk Furradex EX2590", price: "3,300.00"}
    ],
    totalQty: 111,
    amt: 10300,
    discount: 300,
    totalAmt: 10000,
    vatAmt: 654.21,
    notIncluedVatAmt: 9345.79,
    grandTotalAmt: 10000
  }

  constructor() { }

  ngOnInit(): void {
    
  }

}
