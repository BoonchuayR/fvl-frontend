import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, docData, DocumentData, Firestore, updateDoc } from '@angular/fire/firestore'

interface User{

}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) { 
    this.userCollection = collection(firestore, 'users');
  }

  create(users: User) {
    return addDoc(this.userCollection, users);
  }

}
