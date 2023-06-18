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
  query,
  updateDoc,
  where
} from "@angular/fire/firestore";
import { Meter } from "../core/models/meter.model";
import { HttpClient } from "@angular/common/http";

const CHECK_DUP_METER_URL = "https://us-central1-fvl-app.cloudfunctions.net/api/checkDupMeter";

@Injectable({
  providedIn: "root",
})
export class MeterService {
  CSVmeter = "C:\fvl\fvl-frontend\import_meters.csv";
  subscribe(arg0: (meters: any) => void) {  
    throw new Error('Method not implemented.');
  }
  private meterCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private http:HttpClient) {
    this.meterCollection = collection(firestore, "meter");
    
  }
  getInfo(){
    return this.http.get(this.CSVmeter,{responseType:'text'});
  }


  create(meter: Meter) {
    let $metersRef=collection(this.firestore, "meter");
    return addDoc(this.meterCollection, meter);
  }

  getAll() {
    let $metersRef = collection(this.firestore, "meter");
    return collectionData($metersRef, {idField: "id"}) as Observable<Meter[]>;
  }
  
  findMeterByStatus(meterstate: string) {
    
    const q = query(this.meterCollection, where("meterState", "==", meterstate));
    
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
  
  findMeterByStoreId(storeId: string) {
    
    const q = query(this.meterCollection, where("storeId", "==", storeId));
    
    return collectionData(q, {
      idField: "id",
    }) as Observable<Meter[]>;
    
  }

  checkDupMeter(storeId: string) {
    return fetch(`${CHECK_DUP_METER_URL}?storeId=${storeId}`);
  }
  
  async getAllMeterFromAPI() {
    const response = await fetch("https://us-central1-fvl-app.cloudfunctions.net/api/meters");
    const users = await response.json();
    return users.data;
  }


}
