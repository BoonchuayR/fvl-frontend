import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

const BASE_API = "https://meter.foodvillath.com/api/controller.php";

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

  meterSelectByBoothId(bootId: string) {
    const bodyReq = {
      CMD_TYPE: "METER_SELECT",
      CMD_TOKEN: "FVIOT_ADMIN_a7e1b49f6dbdd1579de1929af0d7c303",
      CMD_PARAMS: [
        "BOOTH_ID",
        "DEVICE_ZONE",
        "DEVICE_ID",
        "SERIAL_NO",
        "SLAVE_ID",
        "MODEL_SPEC",
        "LINE_VOLTAGE",
        "LINE_FREQUENCY",
        "LINE_CURRENT",
        "ACTIVE_POWER",
        "ACTIVE_ENERGY",
        "UPDATE_DATETIME",
        "METER_STATE",
        "UPDATE_STATE_DATETIME",
        "METER_STATE_ADMIN",
        "UPDATE_STATE_ADMIN_DATETIME",
        "METER_STATE_PREVIOUS_UNIT",
        "METER_STATE_CALCULATE_UNIT"
      ],
      BOOTH_ID: [bootId],
    };

    // console.log("bodyReq: ", bodyReq)

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

  meterUpdateState(boothId: string, state: string) {

    const bodyReq = {
      CMD_TYPE: "METER_UPDATE", 
      CMD_TOKEN: "KANT_IOT_ADMIN_a7e1b49f6dbdd1579de1929af0d7c303", 
      BOOTH_ID:[boothId],
      CMD_PARAMS:[
          {
              "METER_STATE": state
          }
      ]
    }
    return this.http.post(BASE_API, bodyReq);
  }

  meterReport(storeId: string): any {

    const bodyReq = {
      CMD_TYPE: "METER_REPORT",
      USER_TOKEN: "a7e1b49f6dbdd1579de1929af0d7c303",
      STORE_ID: [
        storeId
      ],
      REPORT_TYPE: [
        "DAILY"
      ],
      REPORT_DATATIME: {
        DATATIME_BEGIN: "2022-01-01 00:00:00",
        DATATIME_END: "2022-12-31 23:59:59"
      },
      CMD_PARAMS: [
        "LINE_VOLTAGE",
        "LINE_FREQUENCY",
        "LINE_CURRENT",
        "ACTIVE_POWER",
        "ACTIVE_ENERGY",
        "TIMESTAMP"
      ]
    }

    return this.http.post(BASE_API, bodyReq);
  }
}
