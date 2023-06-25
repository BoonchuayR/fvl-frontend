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
  email: string;
  custCode: string;
  custName: string;
  custPhone: string;
  custStartDate: string;
  minimumMoney: string;
  currentMoney: number;
}
interface BoothCode{
  code: string;
}

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  private customerCollection: CollectionReference<DocumentData>;
  private bootCodeCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.customerCollection = collection(firestore, "customers");
    this.bootCodeCollection = collection(firestore, "options_boot_code");


  }

  create(customers: Customers) {
    return addDoc(this.customerCollection, customers);
  }

  addCustomer(customers: Customers): Observable<void> {
    const ref = doc(this.firestore, "customers", customers.uid);
    return from(setDoc(ref, customers));
  }

  getAll() {
    return collectionData(this.customerCollection, {
      idField: "id",
    }) as Observable<Customers[]>;
  }
  getCode() {
    return collectionData(this.bootCodeCollection, {
      idField: "id",
    }) as Observable<BoothCode[]>;
  }

  get(id: string) {
    const customerDocumentReference = doc(this.firestore, `customers/${id}`);
    return docData(customerDocumentReference, { idField: "id" });
  }

  getCustomer(id: string) {
    const customerDocumentReference = doc(this.firestore, `customers/${id}`);
    return docData(customerDocumentReference, { idField: "id" });
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

  async getAllCustomerFromAPI() {
    const response = await fetch("https://us-central1-fvl-app.cloudfunctions.net/api/customers");
    const users = await response.json();
    return users.data;
  }
  
}
