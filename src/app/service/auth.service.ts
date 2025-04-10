import { Injectable } from '@angular/core';
import {Auth,signInWithEmailAndPassword,authState,createUserWithEmailAndPassword,
  updateProfile,UserInfo,UserCredential, IdTokenResult,} from '@angular/fire/auth';
  import {  from, Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;
  currentUser$ = authState(this.auth);
  
  constructor(private auth: Auth) { }

  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }
  
  login(email: string, password: string): Observable<any> {
    // console.log("this.auth >>> ", this.auth);
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<any> {
    return from(this.auth.signOut());
  }
}
