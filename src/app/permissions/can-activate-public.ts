import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserToken } from './user-token';

@Injectable()
export class CanActivatePublic implements CanActivate {
  constructor(
    private router: Router,
    private currentUser: UserToken) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (false) {
      alert('You are not allowed to view this page');
      //redirect to login/home page etc
      //return false to cancel the navigation
      return false;
    }
    return true;
  }
}