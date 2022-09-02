import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, 
  doc, docData, DocumentData, Firestore, Timestamp, updateDoc } from '@angular/fire/firestore'

interface Users{
  id: string;
  UserType: string;
  UserName: string;
  UserPwd: string;
  UserEmail: string;
  UserPhone: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) { 
    this.userCollection = collection(firestore, 'users');
  }

  create(users: Users) {
    return addDoc(this.userCollection, users);
  }
  getAll() {
    return collectionData(this.userCollection, {
      idField: 'id',
    }) as Observable<Users[]>;
  }

  get(id: string) {
    const userDocumentReference = doc(this.firestore, `users/${id}`);
    return docData(userDocumentReference, { idField: 'id' });
  }

  update(users: Users) {

    const userDocumentReference = doc(this.firestore,`users/${users.id}`);
    return updateDoc(userDocumentReference, { ...users});
  }

  delete(id: string) {
    const userDocumentReference = doc(this.firestore, `users/${id}`);
    return deleteDoc(userDocumentReference);
  }

}
