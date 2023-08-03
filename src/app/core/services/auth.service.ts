import { Injectable } from "@angular/core";
import {
  Auth,
  createUserWithEmailAndPassword,
  UserCredential,
} from "@angular/fire/auth";
import { from, Observable } from "rxjs";
import { getFirebaseBackend } from "../../authUtils";

@Injectable({ providedIn: "root" })

/**
 * Auth-service Component
 */
export class AuthenticationService {
  // user!: Auth;
  currentUserValue: any;

  constructor(private auth: Auth) {}

  /**
   * Performs the register
   * @param email email
   * @param password password
   */
  register(email: string, password: string) {
    return getFirebaseBackend()!
      .registerUser(email, password)
      .then((response: any) => {
        const user = response;
        return user;
      });
  }

  // TODO: Check Again
  register2(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(email: string, password: string) {
    return getFirebaseBackend()!
      .loginUser(email, password)
      .then((response: any) => {
        const user = response;
        // console.log("user >>> ", user);
        return user;
      });
  }

  /**
   * Returns the current user
   */
  public currentUser(): any {
    return getFirebaseBackend()!.getAuthenticatedUser();
  }

  /**
   * Logout the user
   */
  logout() {
    // logout the user
    return getFirebaseBackend()!.logout();
  }

  /**
   * Reset password
   * @param email email
   */
  resetPassword(email: string) {
    return getFirebaseBackend()!
      .forgetPassword(email)
      .then((response: any) => {
        const message = response.data;
        return message;
      });
  }
}
