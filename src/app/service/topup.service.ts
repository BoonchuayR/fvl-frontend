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
  orderBy,
  Timestamp,
  updateDoc,
} from "@angular/fire/firestore";
import { topupData } from "../admin/topup/topup-list/topup-data";


interface Topup {
  uid: string,
  statusName: string,
  custName: string,
  status: string,
  createdAt: string,
  topupMoney: string,
  id:string,
}

@Injectable({
  providedIn: "root",
})
export class TopupService {
  private topupCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.topupCollection = collection(firestore,"topup");
  }

  create(topup: Topup) {
    return addDoc(this.topupCollection, topup);
  }

  getAll() {
    return collectionData(this.topupCollection, {
      idField: "id",
    }) as Observable<Topup[]>;
  }

  get(id: string) {
    const topupDocumentReference = doc(this.firestore, `topup/${id}`);
    return docData(topupDocumentReference, { idField: "uid" });
  }

  update(topup: Topup) {
    const topupDocumentReference = doc(this.firestore, `topup/${topup.id}`);
    return updateDoc(topupDocumentReference, { ...topup });
  }

  delete(id: string) {
    const topupDocumentReference = doc(this.firestore, `topup/${id}`);
    return deleteDoc(topupDocumentReference);
  }
  async getAllTopupFromAPI() {
    const response = await fetch("https://us-central1-fvl-app.cloudfunctions.net/api/Topups");
    const users = await response.json();
    return users.data;
  }
}
