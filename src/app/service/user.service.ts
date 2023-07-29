import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
import { map, switchMap } from "rxjs/operators";
import { User } from "../core/models/user.models";
export interface ProfileUser {
  uid: string;
  email?: string;
  displayName?: string;
  phone?: string;
  typeUser?: string;
}

const BASE_API_URL = "https://us-central1-fvl-app.cloudfunctions.net/api";
const GET_ROLE_URL = "https://us-central1-fvl-app.cloudfunctions.net/api/getRole";

@Injectable({
  providedIn: "root",
})
export class UserService {
  
  get(userId: string) {
    throw new Error("Method not implemented.");
  }
  private userCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private authService: AuthService, private _http: HttpClient) {
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

  getAll() {
    return collectionData(this.userCollection, {
      idField: "id",
    }) as Observable<User[]>;
  }

  getUser(id: string) {
    const userDocumentReference = doc(this.firestore, `user/${id}`);
    return docData(userDocumentReference, { idField: "uid" });
  }

  // getUserByEmail(email: string) {
  //   const userDocumentReference = doc(this.firestore, `user/${id}`);
  //   return docData(userDocumentReference, { idField: "uid" });
  // }

  update(user: ProfileUser) {
    const userDocumentReference = doc(this.firestore, `user/${user.uid}`);
    return updateDoc(userDocumentReference, { ...user });
  }

  delete(id: string) {
    const userDocumentReference = doc(this.firestore, `user/${id}`);
    return deleteDoc(userDocumentReference);
  }

  getRole(uid: string) {
    return fetch(`${GET_ROLE_URL}?uid=${uid}`);
  }

  async getAllFromAPI() {
    const response = await fetch("https://us-central1-fvl-app.cloudfunctions.net/api/users");
    const users = await response.json();
    return users.data;
  }

  getUserById(uid: string) {
    return this._http.get<{ user: User }>(`http://127.0.0.1:5001/fvl-app/us-central1/api/users/${uid}`).pipe(map(result => {
      return result.user;
    }));
  }


}
