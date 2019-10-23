import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpParameterCodec } from '@angular/common/http';

import * as CryptoJS from 'crypto-js';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserToken, UserRole } from '../models/user-token';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private static readonly secretPassPhrase: string = 'MysecretScalian';
  private static readonly currentUserKey: string = AuthenticationService.encrypt('currentUser');
  constructor(
    private http: HttpClient,
    private router: Router) { }

  private static encrypt(string) {
    return CryptoJS.AES.encrypt(string, AuthenticationService.secretPassPhrase);
  }

  private static decrypt(string) {
    return CryptoJS.AES.decrypt(string, AuthenticationService.secretPassPhrase).toString(CryptoJS.enc.Utf8);
  }

  public getUser(): UserToken {
    const currentUser = localStorage.getItem(AuthenticationService.currentUserKey);
    return (currentUser) ? JSON.parse(AuthenticationService.decrypt(currentUser)) : null;
  }

  public login(username, password) {
    var testLoginPassword = (expectedLogin, expectedPassord): boolean => {
      return username === expectedLogin && password === expectedPassord;
    }
    var user: UserToken;
    // TODO call a real user handler
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
      localStorage.setItem(AuthenticationService.currentUserKey, AuthenticationService.encrypt(JSON.stringify(user)));
      return true;
    } else {
      return false;
    }
  }

  public hasAdminPermission() {
    const user = this.getUser();
    return user && user.role === UserRole.ADMIN;
  }

  public hasUserPermission() {
    const user = this.getUser();
    return user && (user.role === UserRole.USER || user.role === UserRole.ADMIN);
  }
  public logout() {
    localStorage.removeItem(AuthenticationService.currentUserKey);
    this.router.navigate(['']);
  }

}
