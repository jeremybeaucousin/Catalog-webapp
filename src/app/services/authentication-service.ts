import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpParameterCodec } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserToken, UserRole } from '../models/user-token';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private static readonly currentUserKey: string = 'currentUser';
  constructor(
    private http: HttpClient,
    private router: Router) { }

  public getUser() {
    const currentUser = localStorage.getItem(AuthenticationService.currentUserKey);
    // Crypted twice
    return (currentUser) ? JSON.parse(atob(atob(currentUser))) : null;
  }

  public login(username, password) {
    var testLoginPassword = (expectedLogin, expectedPassord): boolean => {
      return username === expectedLogin && password === expectedPassord;
    }
    var user: UserToken;
    if (testLoginPassword("admin", "adminScalian")) {
      user = new UserToken();
      user.username = "admin";
      user.role = UserRole.ADMIN;
    } else if (testLoginPassword("user", "userScalian")) {
      user = new UserToken();
      user.username = "user";
      user.role = UserRole.USER;
    }
    if (user) {
      localStorage.setItem(AuthenticationService.currentUserKey, btoa(btoa(JSON.stringify(user))));
    }
  }

  public logout() {
    localStorage.removeItem(AuthenticationService.currentUserKey);
    this.router.navigate(['']);
  }

}
