import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  addDoc, collection, collectionData, CollectionReference, deleteDoc,
  doc, docData, DocumentData, Firestore, Timestamp, updateDoc
} from '@angular/fire/firestore'

interface Customers {
  id: string;
  custCode: string,
  custName: string,
  custEmail: string,
  custPhone: string,
  custMoney: string,
  custPwd: string,
  custStartDate: Timestamp,
  firstMoney: string,
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customerCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.customerCollection = collection(firestore, 'customers');
  }

  create(customers: Customers) {
    return addDoc(this.customerCollection, customers);
  }
  getAll() {
    return collectionData(this.customerCollection, {
      idField: 'id',
    }) as Observable<Customers[]>;
  }

  get(id: string) {
    const customerDocumentReference = doc(this.firestore, `customers/${id}`);
    return docData(customerDocumentReference, { idField: 'id' });
  }

  update(customers: Customers) {

    const customerDocumentReference = doc(this.firestore, `customers/${customers.id}`);
    return updateDoc(customerDocumentReference, { ...customers });
  }

  delete(id: string) {
    const customerDocumentReference = doc(this.firestore, `customers/${id}`);
    return deleteDoc(customerDocumentReference);
  }


}
