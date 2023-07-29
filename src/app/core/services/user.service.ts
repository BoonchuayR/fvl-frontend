import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user.models";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class UserProfileService {
  constructor(private http: HttpClient) {}
  /***
   * Get All User
   */
  getAll() {
    return this.http.get<User[]>(`api/users`);
  }

  /***
   * Facked User Register
   */
  register(user: User) {
    return this.http.post(`${environment.apiUrl}/users`, user);
  }

  /***
   * Delete user by uid
   */
  remove(uid: string) {
    return this.http.delete(`${environment.apiUrl}/users/${uid}`);
  }
}
