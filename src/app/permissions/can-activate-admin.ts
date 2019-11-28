import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication-service';
import { UserToken, UserRole } from '../models/user-token';

@Injectable()
export class CanActivateAdmin implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user: UserToken = this.authenticationService.getUser();
    if (user == null || !user.roles.includes(UserRole.ADMIN)) {
      alert('You are not allowed to view this page');
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}