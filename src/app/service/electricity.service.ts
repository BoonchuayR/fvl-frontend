import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, docData, DocumentData, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Electricity } from '../core/models/electricity.model';

@Injectable({
  providedIn: 'root'
})
export class ElectricityService {

  private electricityCollection: CollectionReference<DocumentData>;
  
  constructor(private firestore: Firestore) {
    this.electricityCollection = collection(firestore, "electricity");
  }

  create(electricity: Electricity) {
    return addDoc(this.electricityCollection, electricity);
  }

  getAll() {
    return collectionData(this.electricityCollection, {
      idField: "id",
    }) as Observable<Electricity[]>;
  }

  get(id: string) {
    const electricityDocumentReference = doc(this.firestore, `electricity/${id}`);
    return docData(electricityDocumentReference, { idField: "id" });
  }

  update(electricity: Electricity) {
    const meterDocumentReference = doc(this.firestore, `electricity/${electricity.id}`);
    return updateDoc(meterDocumentReference, { ...electricity });
  }

  delete(id: string) {
    const electricityDocumentReference = doc(this.firestore, `electricity/${id}`);
    return deleteDoc(electricityDocumentReference);
  }
  
  findByStoreId(storeId: string) {
    const q = query(this.electricityCollection, where("storeId", "==", storeId));
    return collectionData(q, {
      idField: "id",
    }) as Observable<Electricity[]>;
    
  }

  findByUID(uid: string) {
    const q = query(this.electricityCollection, where("uid", "==", uid));
    return collectionData(q, {
      idField: "id",
    }) as Observable<Electricity[]>;
    
  }
}
