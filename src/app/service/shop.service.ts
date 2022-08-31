import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { addDoc, collection, collectionData, CollectionReference,
   deleteDoc, doc, docData, DocumentData, Firestore, updateDoc } from '@angular/fire/firestore';

interface Shop {
  id: string;
  shopName : string,
  storeNumber : string,
  contractNumber : string,
  meterNumber : string,
  contractOwner : string,
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private shopCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore){ 
    this.shopCollection = collection(firestore, 'shop');
  }

  create(shop: Shop) {
    return addDoc(this.shopCollection, shop);
  }

  getAll() {
    return collectionData(this.shopCollection, {
      idField: 'id',
    }) as Observable<Shop[]>;
  }

  get(id: string) {
    const shopDocumentReference = doc(this.firestore, `shop/${id}`);
    return docData(shopDocumentReference, { idField: 'id' });
  }

  update(shop: Shop) {

    const shopDocumentReference = doc(this.firestore,`shop/${shop.id}`);
    return updateDoc(shopDocumentReference, { ...shop });
  }

  delete(id: string) {
    const shopDocumentReference = doc(this.firestore, `shop/${id}`);
    return deleteDoc(shopDocumentReference);
  }


}
