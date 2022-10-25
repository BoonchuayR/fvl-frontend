import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
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
  setDoc,
  Timestamp,
  updateDoc,
} from "@angular/fire/firestore";


interface Customers {
  uid: string;
  CustCode: string;
  CustName: string;
  CustEmail: string;
  CustUser: string;
  CustPwd: string;
  CustPhone: string;
  CustStartDate: Timestamp;
  minimumMoney:number;
  currentMoney:number;
}

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  private customerCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.customerCollection = collection(firestore, "customers");
  }

  create(customers: Customers) {
    return addDoc(this.customerCollection, customers);
  }

  addCustomer(customers: Customers): Observable<void> {
    const ref = doc(this.firestore, "user", customers.uid);
    return from(setDoc(ref,customers));
  }

  getAll() {
    return collectionData(this.customerCollection, {
      idField: "id",
    }) as Observable<Customers[]>;
  }

  get(id: string) {
    console.log("id: ", id);
    const customerDocumentReference = doc(this.firestore, `customers/${id}`);
    return docData(customerDocumentReference, { idField: "id" });
  }

  getCustomer(id: string) {
    console.log("id: ", id);
    const customerDocumentReference = doc(this.firestore, `customers/${id}`);
    return docData(customerDocumentReference, { idField: "uid" });
  }

  update(customers: Customers) {
    const customerDocumentReference = doc(
      this.firestore,
      `customers/${customers.uid}`
    );
    return updateDoc(customerDocumentReference, { ...customers });
  }

  delete(id: string) {
    const customerDocumentReference = doc(this.firestore, `customers/${id}`);
    return deleteDoc(customerDocumentReference);
  }
}
