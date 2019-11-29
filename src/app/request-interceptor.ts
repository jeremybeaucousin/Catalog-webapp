import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { environment } from './../environments/environment';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SnackBarAppService } from './services/snack-bar-app.services';
import { TranslationKeysConstants } from './models/translation-keys.constants';
import { AuthenticationService } from './services/authentication-service';


@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(
        private _snackBar: SnackBarAppService,
        private translate: TranslateService,
        private authenticationService: AuthenticationService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf(environment.catalogApiEndploint) !== -1 || req.url.indexOf(environment.authenticationApiEndpoint) !== -1) {
            const currentUser = this.authenticationService.getUser();
            var headers = req.headers;
            var withCredentials = req.withCredentials;
            if (currentUser) {
                // headers = headers.append('Cookie', authCookie);
                withCredentials = true;
            }
            return next.handle(
                req.clone(
                    {
                        headers: headers,
                        withCredentials: withCredentials
                    }
                )).pipe(
                    catchError((error: HttpErrorResponse) => {
                        return this.errorHandler(req, next, error);
                    })
                );
        } else {
            // Do Nothing
            return next.handle(req);
        }
    }

    errorHandler(req: HttpRequest<any>, next: HttpHandler, error: HttpErrorResponse): Observable<HttpEvent<any>> {
        var message;
        const currentUser = this.authenticationService.getUser();
        // Handle session expiration
        if (currentUser && error.status === 401) {
            message = this.translate.instant(TranslationKeysConstants.SESSION_EXPIRED);
            this.authenticationService.logout();
        } else {
            console.error("an error occured", error);
            message = this.translate.instant(TranslationKeysConstants.ERROR_GENERAL_MESSAGE, { message: error.message });
        }

        const close = this.translate.instant(TranslationKeysConstants.CLOSE);
        this._snackBar.open(message, close, {
            // In seconds
            duration: 3 * 1000,
        });

        return next.handle(req);
    }
}