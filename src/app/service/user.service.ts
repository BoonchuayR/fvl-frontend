import { Injectable } from '@angular/core';
import { from, Observable, of,} from 'rxjs';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, 
  doc, docData, DocumentData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore'
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';
import { ProfileUser } from '../model/user';
import { User } from '../core/models/auth.models';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private firestore: Firestore,private authService: AuthService) {}

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'user', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }

  addUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'user', user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'user', user.uid);
    return from(updateDoc(ref, { ...user }));
  }
  
  getAll() {
    
  }
}
