import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "@angular/fire/firestore";
import { Meter } from "../core/models/meter.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const CHECK_DUP_METER_URL =
  "https://us-central1-fvl-app.cloudfunctions.net/api/checkDupMeter";
const URL_GRAPH = `https://meter.foodvillath.com/api/controller.php`;
@Injectable({
  providedIn: "root",
})
export class MeterService {
  CSVmeter = "C:\fvl\fvl-frontendimport_meters.csv";
  subscribe(arg0: (meters: any) => void) {
    throw new Error("Method not implemented.");
  }
  private meterCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private http: HttpClient) {
    this.meterCollection = collection(firestore, "meter");
  }

  getInfo() {
    return this.http.get(this.CSVmeter, { responseType: "text" });
  }

  create(meter: Meter) {
    let $metersRef = collection(this.firestore, "meter");
    return addDoc(this.meterCollection, meter);
  }

  getAll() {
    let $metersRef = collection(this.firestore, "meter");
    return collectionData($metersRef, { idField: "id" }) as Observable<Meter[]>;
  }

  findMeterByStatus(meterstate: string) {
    const q = query(
      this.meterCollection,
      where("meterState", "==", meterstate)
    );

    return collectionData(q, {
      idField: "id",
    }) as Observable<Meter[]>;
  }

  findMeterByuid(uid: string) {
    const q = query(this.meterCollection, where("uid", "==", uid));

    return collectionData(q, {
      idField: "id",
    }) as Observable<Meter[]>;
  }

  get(id: string) {
    const meterDocumentReference = doc(this.firestore, `meter/${id}`);
    return docData(meterDocumentReference, { idField: "id" });
  }

  update(meter: Meter) {
    const meterDocumentReference = doc(this.firestore, `meter/${meter.id}`);
    return updateDoc(meterDocumentReference, { ...meter });
  }

  delete(id: string) {
    const meterDocumentReference = doc(this.firestore, `meter/${id}`);
    return deleteDoc(meterDocumentReference);
  }

  modifyState(id: string, state: string) {
    const meterDocRef = doc(this.firestore, `meter/${id}`);
    return updateDoc(meterDocRef, { meterState: state });
  }

  findMeterByZone(zone: string) {
    const q = query(this.meterCollection, where("zone", "==", zone));

    return collectionData(q, {
      idField: "id",
    }) as Observable<Meter[]>;
  }

  findMeterByBooothId(boothId: string) {
    const q = query(this.meterCollection, where("boothId", "==", boothId));

    return collectionData(q, {
      idField: "id",
    }) as Observable<Meter[]>;
  }

  checkDupMeter(boothId: string) {
    return this.http.get(`${CHECK_DUP_METER_URL}?boothId=${boothId}`);
    // return fetch(`${CHECK_DUP_METER_URL}?boothId=${boothId}`);
  }

  async getAllMeterFromAPI() {
    const response = await fetch(
      "https://us-central1-fvl-app.cloudfunctions.net/api/meters"
    );
    const users = await response.json();
    return users.data;
  }

  async getAllMeters() {
    const db = getFirestore();
    const colRef = collection(db, "meter");
    const docsSnap = await getDocs(colRef);
    const meters: any = [];
    docsSnap.forEach((doc) => {
      meters.push(doc.data());
    });
    return meters;
  }

  public fetchDayGraph(deviceId:any) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    const body = {
      CMD_TYPE: "METER_REPORT",
      USER_TOKEN: "a7e1b49f6dbdd1579de1929af0d7c303",
      DEVICE_ID: [deviceId],
      REPORT_TYPE: ["DAILY"],
      CMD_PARAMS: [
        "LINE_VOLTAGE",
        "LINE_FREQUENCY",
        "LINE_CURRENT",
        "ACTIVE_POWER",
        "ACTIVE_ENERGY",
        "TIMESTAMP",
      ],
      REPORT_DATATIME: {
        DATATIME_BEGIN: "2023-12-26 00:00:00",
        DATATIME_END: "2023-12-27 00:00:00",
      },
    };
    return this.http.post(URL_GRAPH, body, options);
  }

  public fetchMonthGraph(deviceId:any) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    const body = {
      CMD_TYPE: "METER_REPORT",
      USER_TOKEN: "a7e1b49f6dbdd1579de1929af0d7c303",
      DEVICE_ID: [deviceId],
      REPORT_TYPE: ["MONTHLY"],
      CMD_PARAMS: [
        "LINE_VOLTAGE",
        "LINE_FREQUENCY",
        "LINE_CURRENT",
        "ACTIVE_POWER",
        "ACTIVE_ENERGY",
        "TIMESTAMP",
      ],
      REPORT_DATATIME: {
        DATATIME_BEGIN: "2023-12-26 00:00:00",
        DATATIME_END: "2023-12-27 00:00:00",
      },
    };
    return this.http.post(URL_GRAPH, body, options);
  }

  public fetchYearGraph(deviceId:any) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    const body = {
      CMD_TYPE: "METER_REPORT",
      USER_TOKEN: "a7e1b49f6dbdd1579de1929af0d7c303",
      DEVICE_ID: [deviceId],
      REPORT_TYPE: ["YEARLY"],
      CMD_PARAMS: [
        "LINE_VOLTAGE",
        "LINE_FREQUENCY",
        "LINE_CURRENT",
        "ACTIVE_POWER",
        "ACTIVE_ENERGY",
        "TIMESTAMP",
      ],
      REPORT_DATATIME: {
        DATATIME_BEGIN: "2023-12-26 00:00:00",
        DATATIME_END: "2023-12-27 00:00:00",
      },
    };
    return this.http.post(URL_GRAPH, body, options);
  }
}
