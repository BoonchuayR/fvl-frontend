import { Injectable } from "@angular/core";
import { from, Observable, of } from "rxjs";
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
  updateDoc,
} from "@angular/fire/firestore";
import { AuthService } from "./auth.service";
import { switchMap } from "rxjs/operators";
import { User } from "../core/models/user.models";
import { user, UserProfile } from "@angular/fire/auth";

interface ProfileUser {
  uid: string;
  email?: string;
  displayName?: string;
  phone?: string;
  typeUser?: string;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  get(userId: string) {
    throw new Error('Method not implemented.');
  }
  private userCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private authService: AuthService) {
    this.userCollection = collection(firestore, "user");
  }

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, "user", user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }

  addUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, "user", user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, "user", user.uid);
    return from(updateDoc(ref, { ...user }));
  }

  getAllUser() {
    return collectionData(this.userCollection, {
      idField: "id",
    }) as Observable<User[]>;
  }
  getUser(id: string) {
    const userDocumentReference = doc(this.firestore, `user/${id}`);
    return docData(userDocumentReference, { idField: 'uid' });
  }
  
  update(user: ProfileUser) {
    const userDocumentReference = doc(this.firestore,`user/${user.uid}`);
    return updateDoc(userDocumentReference, { ...user });
  }
  
}
