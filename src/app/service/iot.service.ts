import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

const BASE_API = "https://www.k-tech.co.th/foodvilla/meter/api/controller.php";

@Injectable({
  providedIn: "root",
})
export class IotService {
  constructor(private http: HttpClient) {}

  meterSelectAll() {
    const bodyReq = {
      CMD_TYPE: "METER_SELECT_ALL",
      CMD_SELECT: "*",
      CMD_TOKEN: "a7e1b49f6dbdd1579de1929af0d7c303",
    };

    return this.http.post(BASE_API, bodyReq);
  }

  meterSelectSerialNo() {
    const bodyReq = {
      CMD_TYPE: "METER_SELECT_SERIAL_NO",
      SERIAL_NO: "10568",
      USER_TOKEN: "a7e1b49f6dbdd1579de1929af0d7c303",
    };

    return this.http.post(BASE_API, bodyReq);
  }

  meterUpdateState(serialNo: string, state: number) {
    console.log("serialNo: ", serialNo);
    console.log("state: ", state);
    const bodyReq = {
      CMD_TYPE: "METER_UPDATE_STATE",
      USER_ID: "1",
      USER_TOKEN: "ff15d1de48d17581834cd05f5c1b9caf",
      SERIAL_NO: serialNo,
      METER_STATE_VALUE: state,
    };
    return this.http.post(BASE_API, bodyReq);
  }
}
