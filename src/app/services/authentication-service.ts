import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import { UserToken, UserRole } from '../models/user-token';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
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

  static loginRoute = "login";
  static logoutRoute = "logout";

  public getUser(): UserToken {
    const currentUser = this.localSessionService.getItem(AuthenticationService.currentUserKey);
    return (currentUser) ? JSON.parse(currentUser) : null;
  }

  public login(username, password) {
    const headers = new HttpHeaders({
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get(`${environment.authenticationApiEndpoint}${AuthenticationService.loginRoute}`,
      {
        headers: headers,
        withCredentials: true,
        observe: 'response'
      }).pipe(
        map(response => {
          if (response.status == 200) {
            var user: UserToken;

            if (response.body) {
              const body: any = response.body;
              user = new UserToken();
              user.username = body.username;
              user.roles = this.defineUserRoles(body.roles);
              this.localSessionService.setItem(AuthenticationService.currentUserKey, user);
            }
            return true;
          } else {
            console.error(response.body);
            return false;
          }
        }),
        catchError(error => {
          console.error(error);
          return [false, error.message];
        })
      );
  }

  private defineUserRoles(roles: Array<String>) {
    const userRoles: Array<UserRole> = [];
    const appAdminRole = environment.roles.appAdminRoles.find(element => roles.includes(element));

    if (appAdminRole) {
      userRoles.push(UserRole.APP_ADMIN);
    }
    const toolboxesAdminRole = environment.roles.toolboxesAdminRoles.find(element => roles.includes(element));
    if (toolboxesAdminRole) {
      userRoles.push(UserRole.CATALOG_ADMIN);
    }

    const toolboxesUserRole = environment.roles.toolboxesUserRoles.find(element => roles.includes(element));
    if (toolboxesUserRole) {
      userRoles.push(UserRole.CATALOG_USER);
    }

    return userRoles;
  }

  public hasAppAdminPermission() {
    const user = this.getUser();
    return user && user.roles.includes(UserRole.APP_ADMIN);
  }

  public hasToolboxesAdminPermission() {
    const user = this.getUser();
    return user && (user.roles.includes(UserRole.CATALOG_ADMIN) || user.roles.includes(UserRole.APP_ADMIN));
  }

  public hasToolboxesUserPermission() {
    const user = this.getUser();
    return user && (user.roles.includes(UserRole.CATALOG_USER));
  }

  public logout() {
    this.http.get(`${environment.authenticationApiEndpoint}${AuthenticationService.logoutRoute}`).subscribe(
      response => {
        console.debug("successfully disconnected", response);
      }
    ),
      catchError(error => {
        console.error(error);
        return [false, error.message];
      });
    this.localSessionService.removeItem(AuthenticationService.currentUserKey)
    this.router.navigate(['']);
  }

}
