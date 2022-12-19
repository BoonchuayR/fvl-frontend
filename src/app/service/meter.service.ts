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
  where,
} from "@angular/fire/firestore";
import { Meter } from "../core/models/meter.model";

@Injectable({
  providedIn: "root",
})
export class MeterService {
  private meterCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.meterCollection = collection(firestore, "meter");
  }

  create(meter: Meter) {
    return addDoc(this.meterCollection, meter);
  }

  getAll() {
    return collectionData(this.meterCollection, {
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
}
