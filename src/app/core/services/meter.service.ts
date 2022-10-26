import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

const base_meter_api_url =
  "https://www.k-tech.co.th/foodvilla/meter/api/controller.php";

@Injectable({
  providedIn: "root",
})
export class MeterService {
  constructor(private http: HttpClient) {}

  hello() {
    const bodyReq = {
      CMD_TYPE: "HELLO",
    };
    const headers = { "content-type": "application/json" };
    return this.http.post(base_meter_api_url, bodyReq, { headers: headers });
  }

  getAllMeters() {
    const bodyReq = {
      CMD_TYPE: "METER_SELECT_ALL",
      CMD_SELECT: "*",
      CMD_TOKEN: "a7e1b49f6dbdd1579de1929af0d7c303",
    };
    const headers = { "content-type": "application/json" };
    return this.http.post(base_meter_api_url, bodyReq, { headers: headers });
  }

  updatMeterState(meterState: number = 1) {
    const bodyReq = {
      CMD_TYPE: "METER_UPDATE_STATE",
      USER_ID: "1",
      USER_TOKEN: "ff15d1de48d17581834cd05f5c1b9caf",
      SERIAL_NO: "10568",
      METER_STATE_VALUE: meterState,
    };
    const headers = { "content-type": "application/json" };
    return this.http.post(base_meter_api_url, bodyReq, { headers: headers });
  }
}
