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

  private static readonly currentUserKey: string = 'currentUser';
  private static readonly secretPassPhrase: string = 'MysecretScalian';
  constructor(
    private http: HttpClient,
    private router: Router) { }

  private encrypt(string) {
    return CryptoJS.AES.encrypt(string, AuthenticationService.secretPassPhrase);
  }

  private decrypt(string) {
    return CryptoJS.AES.decrypt(string, AuthenticationService.secretPassPhrase).toString(CryptoJS.enc.Utf8);
  }
  public getUser() {
    const currentUser = localStorage.getItem(AuthenticationService.currentUserKey);
    return (currentUser) ? JSON.parse(this.decrypt(currentUser)) : null;
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
      localStorage.setItem(AuthenticationService.currentUserKey, this.encrypt(JSON.stringify(user)));
    }
  }

  public logout() {
    localStorage.removeItem(AuthenticationService.currentUserKey);
    this.router.navigate(['']);
  }

}
