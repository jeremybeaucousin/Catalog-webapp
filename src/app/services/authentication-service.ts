import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpParameterCodec } from '@angular/common/http';

import * as CryptoJS from 'crypto-js';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserToken, UserRole } from '../models/user-token';
import { Router } from '@angular/router';
import { LocalSessionService } from './local-session-service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private static readonly currentUserKey: string = 'currentUser';

  constructor(
    private http: HttpClient,
    private router: Router,
    private localSessionService: LocalSessionService) { }

  public getUser(): UserToken {
    const currentUser = this.localSessionService.getItem(AuthenticationService.currentUserKey);
    return (currentUser) ? JSON.parse(currentUser) : null;
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
      this.localSessionService.setItem(AuthenticationService.currentUserKey, user);
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
    this.localSessionService.removeItem(AuthenticationService.currentUserKey)
    this.router.navigate(['']);
  }

}
