import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { addDoc, collection, collectionData, CollectionReference,
   deleteDoc, doc, docData, DocumentData, Firestore, updateDoc } from '@angular/fire/firestore';

interface Meter {
  id: string;
  SLAVE_ID : string,
  SERIAL_NO : string,
  LINE_VOLTAGE : number,
  LINE_FREQUENCE : number,
  LINE_CURRENT : number,
  ACTIVE_POWER : number,
  ACTIVE_ENERGY : number,
  CURRENT_RATING : number,
  BASIC_CURRENT : number,
  MAXIMUM_CURRENT : number,
  METER_ZONE : string,
  METER_STATE : string,
  METER_SHOP : string,
}

@Injectable({
  providedIn: 'root'
})
export class MeterService {

  private meterCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore){ 
    this.meterCollection = collection(firestore, 'meter');
  }

  create(meter: Meter) {
    return addDoc(this.meterCollection, meter);
  }

  getAll() {
    return collectionData(this.meterCollection, {
      idField: 'id',
    }) as Observable<Meter[]>;
  }

  get(id: string) {
    const meterDocumentReference = doc(this.firestore, `meter/${id}`);
    return docData(meterDocumentReference, { idField: 'id' });
  }

  update(meter: Meter) {

    const meterDocumentReference = doc(this.firestore,`meter/${meter.id}`);
    return updateDoc(meterDocumentReference, { ...meter });
  }

  delete(id: string) {
    const meterDocumentReference = doc(this.firestore, `meter/${id}`);
    return deleteDoc(meterDocumentReference);
  }


}
